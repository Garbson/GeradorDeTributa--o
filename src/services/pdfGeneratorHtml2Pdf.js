import html2pdfImported from 'html2pdf.js';
// Normalizar referência (casos ESM/CJS)
const resolveHtml2pdf = () => {
  if (typeof html2pdfImported === 'function') return html2pdfImported;
  if (html2pdfImported && typeof html2pdfImported.default === 'function') return html2pdfImported.default;
  if (typeof window !== 'undefined' && typeof window.html2pdf === 'function') return window.html2pdf;
  return null;
};
// Nota: Problemas de PDF em branco normalmente ligados a:
// 1. Elemento fora da viewport com dimensões 0
// 2. Conteúdo async (imagens / fontes) não carregados
// 3. html2canvas falhando silenciosamente (CORS / canvas tainted)
// 4. Versão / API html2pdf encadeada de forma incorreta
// 5. HTML completo com <html> causando parse inesperado

/**
 * Serviço para conversão de HTML para PDF usando html2pdf.js
 */

/**
 * Configurações padrão para geração de PDF
 */
const defaultOptions = {
  margin: [10, 10, 10, 10], // top, right, bottom, left em mm
  filename: 'documento.pdf',
  image: {
    type: 'jpeg',
    quality: 0.95
  },
  html2canvas: {
    scale: 2,
    useCORS: true,
    letterRendering: true,
    logging: true,
    backgroundColor: '#ffffff'
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
    compress: true
  }
};

/**
 * Configurações específicas por tipo de documento
 */
const documentConfigs = {
  'fatura-resumo': {
    filename: 'fatura_resumo.pdf',
    margin: [15, 10, 15, 10],
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  },
  'fatura-detalhada': {
    filename: 'fatura_detalhada.pdf',
    margin: [10, 8, 10, 8],
    pagebreak: { mode: ['css', 'legacy'] }
  },
  'nf-icms-antiga': {
    filename: 'nota_fiscal_icms.pdf',
    margin: [12, 10, 12, 10],
    pagebreak: { mode: 'avoid-all' }
  },
  'nf-iss': {
    filename: 'nota_fiscal_iss.pdf',
    margin: [12, 10, 12, 10],
    pagebreak: { mode: 'avoid-all' }
  },
  'historico-consumo': {
    filename: 'historico_consumo.pdf',
    margin: [15, 10, 15, 10],
    pagebreak: { mode: 'css' }
  }
};

// Flag para desativar completamente geração PDF (mantém HTML)
export const DISABLE_PDF = false;

// Engines suportados: 'html2pdf' (default), 'print' (janela + print), 'plain' (jsPDF texto), 'auto'
export const DEFAULT_PDF_ENGINE = 'print';

const resolveEngine = (requested) => {
  if (!requested || requested === 'auto') return 'html2pdf';
  return requested;
};

/**
 * Gera PDF a partir de conteúdo HTML
 * @param {string} htmlContent - Conteúdo HTML para converter
 * @param {string} documentType - Tipo do documento para configurações específicas
 * @param {object} options - Opções customizadas
 * @returns {Promise} Promise que resolve com o PDF gerado
 */
export const generatePDFFromHTML = async (htmlContent, documentType = 'default', options = {}) => {
  if (DISABLE_PDF) {
    return {
      success: true,
      blob: new Blob([htmlContent], { type: 'text/html' }),
      filename: (options.filename || 'documento') + '.html',
      mimeType: 'text/html',
      disabled: true
    };
  }
  try {
    const engine = resolveEngine(options.engine);
    if (engine === 'plain') {
      return generatePlainPDF(htmlContent, options.filename || 'documento.pdf');
    }
    if (engine === 'print') {
      return generatePDFViaPrint(htmlContent, options.filename || 'documento.pdf');
    }
    // Obter configurações específicas do documento
    const docConfig = documentConfigs[documentType] || {};

    // Combinar configurações: padrão + documento específico + opções customizadas
    const finalOptions = {
      ...defaultOptions,
      ...docConfig,
      ...options,
      html2canvas: {
        ...defaultOptions.html2canvas,
        ...docConfig.html2canvas,
        ...options.html2canvas
      },
      jsPDF: {
        ...defaultOptions.jsPDF,
        ...docConfig.jsPDF,
        ...options.jsPDF
      }
    };

    // Normalizar conteúdo (remoção de doctype/<html>/<head>/<body> e extração de estilos)
    const normalizedHtml = normalizeHtmlForPdf(htmlContent);

    // Criar elemento temporário com o HTML já normalizado
    const element = createTempElement(normalizedHtml);
    pdfOverlay('[PDF] texto=' + (((element.textContent || '').trim().slice(0, 60)) || '(vazio)'));

    // Pequena espera para garantir layout / fontes / imagens (caso futuramente adicionadas)
    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch (_) { /* noop */ }
    }
    await new Promise(r => setTimeout(r, 40));

    // Validação de conteúdo antes de gerar
    const textLength = (element.textContent || '').trim().length;
    if (textLength === 0) {
      console.warn('[PDF] Conteúdo aparente vazio (textLength=0). Prosseguindo.');
      try { alert('DEBUG PDF: texto vazio detectado antes de gerar.'); } catch (_) { }
    }

    // Gerar PDF (corrigido: uso de toPdf().output('blob') para compatibilidade)
    const lib = resolveHtml2pdf();
    if (!lib) {
      console.error('[PDF] html2pdf não disponível. Fallback para HTML.');
      const fbBlob = new Blob([normalizedHtml], { type: 'text/html' });
      cleanup(element);
      return { success: true, blob: fbBlob, filename: (finalOptions.filename || 'documento') + '.html', mimeType: 'text/html', fallback: true };
    }
    const pdfBlob = await generatePdfWithRetry(element, finalOptions, lib);
    if (pdfBlob.size < 3000) {
      pdfOverlay('[PDF] blob pequeno ' + pdfBlob.size + ' bytes (fallback txt)');
      const plain = element.textContent || 'Sem conteúdo';
      // Fallback: criar PDF mínimo via jsPDF se disponível globalmente
      try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(plain, 520);
        doc.text(lines, 40, 60);
        const altBlob = doc.output('blob');
        if (altBlob.size > pdfBlob.size) {
          return {
            success: true,
            blob: altBlob,
            filename: finalOptions.filename,
            mimeType: 'application/pdf',
            fallback: 'jspdf-plain'
          };
        }
      } catch (e) {
        console.warn('[PDF] jsPDF fallback falhou', e);
      }
    }

    // Expor info debug global
    window.__LAST_PDF_DEBUG__ = {
      type: documentType,
      options: finalOptions,
      textLength,
      htmlLength: normalizedHtml.length,
      blobSize: pdfBlob.size,
      timestamp: Date.now()
    };

    // Limpar elemento temporário
    cleanup(element);

    return {
      success: true,
      blob: pdfBlob,
      filename: finalOptions.filename,
      mimeType: 'application/pdf'
    };

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gera e faz download do PDF
 * @param {string} htmlContent - Conteúdo HTML
 * @param {string} documentType - Tipo do documento
 * @param {object} options - Opções customizadas
 */
export const generateAndDownloadPDF = async (htmlContent, documentType, options = {}) => {
  if (DISABLE_PDF) {
    const filename = (options.filename || 'documento') + '.html';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, disabled: true, filename, mimeType: 'text/html' };
  }
  try {
    const engine = resolveEngine(options.engine);
    if (engine === 'plain') {
      const r = await generatePlainPDF(htmlContent, options.filename || 'documento.pdf');
      if (r.success) triggerBlobDownload(r.blob, r.filename);
      return r;
    }
    if (engine === 'print') {
      const r = await generatePDFViaPrint(htmlContent, options.filename || 'documento.pdf', { autoDownload: true });
      return r;
    }
    const docConfig = documentConfigs[documentType] || {};
    const finalOptions = {
      ...defaultOptions,
      ...docConfig,
      ...options
    };

    const normalizedHtml = normalizeHtmlForPdf(htmlContent);
    const element = createTempElement(normalizedHtml);
    pdfOverlay('[PDF] texto=' + (((element.textContent || '').trim().slice(0, 60)) || '(vazio)'));

    if (document.fonts?.ready) {
      try { await document.fonts.ready; } catch (_) { /* noop */ }
    }
    await new Promise(r => setTimeout(r, 40));

    if ((element.textContent || '').trim().length === 0) {
      console.warn('[PDF] Conteúdo aparente vazio no download (textLength=0).');
      try { alert('DEBUG PDF: texto vazio detectado antes de baixar.'); } catch (_) { }
    }

    // html2pdf automaticamente faz o download (corrigido para cadeia estável)
    const lib = resolveHtml2pdf();
    if (!lib) {
      alert('Biblioteca PDF não carregada. Baixando HTML.');
      const fbBlob = new Blob([normalizedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(fbBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (finalOptions.filename || 'documento') + '.html';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      cleanup(element);
      return { success: true, fallback: true };
    }
    await lib().set(finalOptions).from(element).save();

    // Debug pós geração (salvo somente se devtools aberto comum)
    window.__LAST_PDF_DEBUG__ = {
      type: documentType,
      options: finalOptions,
      textLength: (element.textContent || '').trim().length,
      htmlLength: normalizedHtml.length,
      downloaded: true,
      timestamp: Date.now()
    };

    cleanup(element);

    return { success: true };

  } catch (error) {
    console.error('Erro ao gerar e baixar PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gera PDF para preview (retorna blob)
 * @param {string} htmlContent - Conteúdo HTML
 * @param {string} documentType - Tipo do documento
 * @param {object} options - Opções customizadas
 */
export const generatePDFForPreview = async (htmlContent, documentType, options = {}) => {
  if (DISABLE_PDF) {
    const filename = (options.filename || 'preview_' + documentType) + '.html';
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    return { success: true, url, blob, filename, mimeType: 'text/html', disabled: true };
  }
  const engine = resolveEngine(options.engine);
  if (engine === 'plain') {
    const r = await generatePlainPDF(htmlContent, options.filename || 'preview.pdf');
    if (r.success) {
      const url = URL.createObjectURL(r.blob);
      return { ...r, url };
    }
    return r;
  }
  if (engine === 'print') {
    // print engine não retorna blob real; gerar plain como preview
    const r = await generatePlainPDF(htmlContent, options.filename || 'preview.pdf');
    if (r.success) {
      const url = URL.createObjectURL(r.blob);
      return { ...r, url, engine: 'print-fallback' };
    }
    return r;
  }
  const result = await generatePDFFromHTML(htmlContent, documentType, {
    ...options,
    filename: `preview_${documentType}_${Date.now()}.pdf`
  });

  if (result.success) {
    // Criar URL para preview
    const url = URL.createObjectURL(result.blob);
    return {
      success: true,
      url,
      blob: result.blob,
      filename: result.filename,
      mimeType: result.mimeType
    };
  }

  return result;
};

/**
 * Cria elemento temporário para renderização
 * @param {string} htmlContent - Conteúdo HTML
 * @returns {HTMLElement} Elemento DOM temporário
 */
const createTempElement = (htmlContent) => {
  const element = document.createElement('div');
  element.innerHTML = htmlContent;

  // Colocar FORA da viewport (não invisível) porque opacity:0 às vezes gera canvas vazio em alguns cenários de html2canvas.
  // Estratégia: position:absolute; left:-10000px ainda computa layout completo e evita branco.
  element.style.cssText = `
    position: absolute;
    left: -10000px;
    top: 0;
    /* visível mas fora da tela */
    pointer-events: none;
    width: 794px; /* ~210mm @96dpi */
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    font-size: 12px;
    line-height: 1.4;
    color: #000;
    background: #fff;
    padding: 16px;
  `;

  document.body.appendChild(element);

  // Log dimensões para debug
  const rect = element.getBoundingClientRect();
  pdfOverlay(`[PDF] layout ${Math.round(rect.width)}x${Math.round(rect.height)}`);

  // Expor info rápida para inspeção no console se necessário
  try {
    window.__PDF_CAPTURE_INFO__ = {
      width: rect.width,
      height: rect.height,
      textSample: (element.textContent || '').trim().slice(0, 120),
      timestamp: Date.now()
    };
  } catch (_) {}

  return element;
};

/**
 * Remove elemento temporário
 * @param {HTMLElement} element - Elemento para remover
 */
const cleanup = (element) => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

const triggerBlobDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

// Engine print: abre nova janela e usa print dialog para salvar em PDF (depende do navegador)
const generatePDFViaPrint = async (rawHtml, filename = 'documento.pdf', opts = {}) => {
  try {
    const win = window.open('', '_blank', 'width=1024,height=800');
    if (!win) return { success: false, error: 'Popup bloqueado' };
    const styles = `body{margin:16px;font-family:Arial, sans-serif;color:#000;} @page { margin: 12mm; }`;
    win.document.write(`<!DOCTYPE html><html><head><title>${filename}</title><style>${styles}</style></head><body>${rawHtml}</body></html>`);
    win.document.close();
    await new Promise(r => setTimeout(r, 150));
    if (opts.autoDownload) {
      try { win.focus(); win.print(); } catch (_) { }
    }
    return { success: true, engine: 'print', note: 'Use o diálogo do navegador para salvar em PDF.' };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

/**
 * Normaliza HTML completo (com <html>/<head>/<body>) em apenas conteúdo + estilos inline
 * Garantindo que html2pdf capture apenas a área relevante e evitando PDFs em branco.
 * @param {string} rawHtml
 * @returns {string}
 */
const normalizeHtmlForPdf = (rawHtml = '') => {
  if (!rawHtml || typeof rawHtml !== 'string') return '<div>Sem conteúdo</div>';

  // Heurística rápida: se não contém <html ou <body, já retornar
  const hasFullDoc = /<html[\s>]/i.test(rawHtml) || /<body[\s>]/i.test(rawHtml);
  if (!hasFullDoc) return rawHtml;

  let bodyContent = rawHtml;
  let collectedStyles = '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');
    bodyContent = doc.body?.innerHTML || rawHtml;
    // Concatenar <style> tags
    const styleTags = doc.head?.querySelectorAll('style');
    styleTags?.forEach(tag => { collectedStyles += tag.outerHTML; });
  } catch (e) {
    console.warn('[PDF] Falha ao parsear HTML, usando conteúdo bruto.', e);
  }

  return `\n${collectedStyles}\n<div class="pdf-root">${bodyContent}</div>`;
};

/**
 * Gera PDF com tentativa de retry se o blob ficar muito pequeno (possível branco)
 * @param {HTMLElement} element
 * @param {object} finalOptions
 * @returns {Promise<Blob>}
 */
const generatePdfWithRetry = async (element, finalOptions, lib) => {
  // Primeira tentativa
  const worker1 = lib().set(finalOptions).from(element).toPdf();
  let blob = await worker1.output('blob');
  if (blob.size > 3000) return blob; // tamanho razoável aumentado

  console.warn('[PDF] Blob muito pequeno (', blob.size, 'bytes). Tentando retry com ajustes.');

  // Ajuste: aumentar scale e remover letterRendering
  const retryOptions = {
    ...finalOptions,
    html2canvas: {
      ...finalOptions.html2canvas,
      scale: Math.max(2, (finalOptions.html2canvas?.scale || 1.5) + 0.5),
      letterRendering: false
    }
  };

  await new Promise(r => setTimeout(r, 80));
  const worker2 = lib().set(retryOptions).from(element).toPdf();
  blob = await worker2.output('blob');
  if (blob.size > 3000) return blob;

  // Último fallback: clonar somente texto simples embrulhado
  console.warn('[PDF] Segunda tentativa ainda pequena (', blob.size, 'bytes). Aplicando fallback minimalista.');
  const textOnly = element.textContent || 'Documento sem conteúdo textual';
  const fallbackDiv = document.createElement('div');
  fallbackDiv.innerHTML = `<pre style="white-space:pre-wrap;font-family:Arial;font-size:12px;">${escapeHtml(textOnly)}</pre>`;
  element.appendChild(fallbackDiv);
  await new Promise(r => setTimeout(r, 50));
  const worker3 = lib().set(retryOptions).from(element).toPdf();
  blob = await worker3.output('blob');
  return blob; // mesmo que pequeno, retorna
};

// Fallback simples direto usando jsPDF apenas com o texto plano
export const generatePlainPDF = async (rawHtml, filename = 'documento.pdf') => {
  try {
    const { jsPDF } = await import('jspdf');
    const tmp = document.createElement('div');
    tmp.innerHTML = rawHtml || '';
    const plain = (tmp.textContent || 'Sem conteúdo').replace(/\s+/g, ' ').trim();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const lines = doc.splitTextToSize(plain, 520);
    doc.text(lines, 40, 60);
    const blob = doc.output('blob');
    return { success: true, blob, filename, mimeType: 'application/pdf', fallback: 'plain' };
  } catch (e) {
    console.error('[PDF] Falha fallback plain jsPDF', e);
    return { success: false, error: e.message };
  }
};

const escapeHtml = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

// Overlay simples para diagnóstico quando console não aparece
let __pdfOverlay;
const pdfOverlay = (msg) => {
  if (!msg) return;
  if (!__pdfOverlay) {
    __pdfOverlay = document.createElement('div');
    __pdfOverlay.style.cssText = 'position:fixed;bottom:12px;right:12px;background:#fffbdd;color:#222;font:12px/1.3 monospace;padding:8px 12px;border:1px solid #d4b106;border-radius:6px;z-index:2147483647;max-width:320px;white-space:pre-wrap;box-shadow:0 2px 6px rgba(0,0,0,.25);';
    document.body.appendChild(__pdfOverlay);
  }
  __pdfOverlay.style.display = 'block';
  __pdfOverlay.textContent = msg;
};

// Função de teste manual
if (typeof window !== 'undefined' && !window.DEBUG_PDF_TEST) {
  window.DEBUG_PDF_TEST = async () => {
    pdfOverlay('Iniciando teste PDF...');
    const testHtml = '<div style="padding:40px;font-family:Arial"><h1>Teste PDF</h1><p>Verificação básica.</p></div>';
    const r = await generatePDFFromHTML(testHtml, 'fatura-resumo', { filename: 'debug_teste.pdf' });
    pdfOverlay('Teste concluído. fallback=' + !!r.fallback + ' size=' + (r.blob?.size || 0));
    return r;
  };
}

/**
 * Configurações de qualidade
 */
export const qualityPresets = {
  draft: {
    html2canvas: { scale: 1 },
    image: { quality: 0.7 },
    jsPDF: { compress: true }
  },
  normal: {
    html2canvas: { scale: 1.5 },
    image: { quality: 0.85 },
    jsPDF: { compress: true }
  },
  high: {
    html2canvas: { scale: 2 },
    image: { quality: 0.95 },
    jsPDF: { compress: false }
  },
  print: {
    html2canvas: { scale: 3 },
    image: { quality: 1.0 },
    jsPDF: { compress: false }
  }
};

/**
 * Obter preset de qualidade
 * @param {string} preset - Nome do preset (draft, normal, high, print)
 * @returns {object} Configurações do preset
 */
export const getQualityPreset = (preset = 'normal') => {
  return qualityPresets[preset] || qualityPresets.normal;
};