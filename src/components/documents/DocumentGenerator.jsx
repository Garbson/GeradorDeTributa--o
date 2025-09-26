import {
  DISABLE_PDF,
  generateAndDownloadPDF,
  generatePDFForPreview,
  getQualityPreset
} from '../../services/pdfGeneratorHtml2Pdf.js';
import {
  generateFaturaDetalhada,
  generateFaturaResumo,
  generateHistoricoConsumo,
  generateNFComXML,
  generateNFICMSAntiga,
  generateNFISS,
  generateRGC,
  generateSEFAZXML
} from '../../utils/documentTemplates.js';

/**
 * Gera documento com suporte a PDF e HTML
 * @param {string} type - Tipo do documento
 * @param {object} data - Dados para geração
 * @param {object} options - Opções de geração (format, quality, download)
 * @returns {Promise} Promise que resolve com o resultado da geração
 */
const generateDocument = async (type, data, options = {}) => {
  try {
    const {
      format = 'pdf', // 'pdf' ou 'html'
      quality = 'normal', // 'draft', 'normal', 'high', 'print'
      download = true,
      engine = 'auto' // 'auto' | 'html2pdf' | 'print' | 'plain'
    } = options;

    const pdfRequested = format === 'pdf';
    const pdfEnabled = !DISABLE_PDF;

    let documentContent = null;
  let mimeType = (pdfRequested && pdfEnabled) ? 'application/pdf' : 'text/html';
  let filename = '';
  let extension = (pdfRequested && pdfEnabled) ? '.pdf' : '.html';

    // Gerar conteúdo HTML primeiro
    switch (type) {
      case 'fatura-resumo':
        documentContent = generateFaturaResumo(data);
  try { window.__ULTIMO_HTML_FATURA__ = documentContent; } catch(_) {}
        filename = `fatura_resumo_${Date.now()}${extension}`;
        break;

      case 'fatura-detalhada':
        documentContent = generateFaturaDetalhada(data);
  try { window.__ULTIMO_HTML_FATURA__ = documentContent; } catch(_) {}
        filename = `fatura_detalhada_${Date.now()}${extension}`;
        break;

      case 'nf-icms-antiga':
        documentContent = generateNFICMSAntiga(data);
  try { window.__ULTIMO_HTML_FATURA__ = documentContent; } catch(_) {}
        filename = `nf_icms_${Date.now()}${extension}`;
        break;

      case 'nf-icms-nova':
        documentContent = generateNFComXML(data);
        mimeType = 'application/xml';
        filename = `nfcom_${Date.now()}.xml`;
        break;

      case 'nf-iss':
        documentContent = generateNFISS(data);
  try { window.__ULTIMO_HTML_FATURA__ = documentContent; } catch(_) {}
        filename = `nf_iss_${Date.now()}${extension}`;
        break;

      case 'historico-consumo':
        documentContent = generateHistoricoConsumo(data);
  try { window.__ULTIMO_HTML_FATURA__ = documentContent; } catch(_) {}
        filename = `historico_consumo_${Date.now()}${extension}`;
        break;

      case 'sefaz':
        documentContent = generateSEFAZXML(data);
        mimeType = 'application/xml';
        filename = `sefaz_${Date.now()}.xml`;
        break;

      case 'rgc':
        documentContent = generateRGC(data);
        mimeType = 'application/xml';
        filename = `rgc_${Date.now()}.xml`;
        break;

      default:
        throw new Error(`Tipo de documento não suportado: ${type}`);
    }

    // Se for PDF e não for XML, converter HTML para PDF
  if (pdfRequested && pdfEnabled && mimeType !== 'application/xml') {
      // Debug: Verificar tamanho do HTML antes da geração
      if (documentContent) {
        const plainText = documentContent.replace(/<[^>]+>/g, ' ').trim();
        console.debug('[PDF] HTML length:', documentContent.length, 'Plain text length:', plainText.length);
      } else {
        console.warn('[PDF] documentContent indefinido antes da geração.');
      }
      const qualitySettings = getQualityPreset(quality);

      if (download) {
        // Gerar e baixar PDF automaticamente
        const result = await generateAndDownloadPDF(documentContent, type, {
          filename: filename,
          ...qualitySettings,
          engine
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          filename,
          mimeType: 'application/pdf',
          downloaded: true
        };
      } else {
        // Gerar PDF para preview
        const result = await generatePDFForPreview(documentContent, type, {
          filename: filename,
          ...qualitySettings,
          engine
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          content: result.blob,
          url: result.url,
          filename: result.filename,
          mimeType: result.mimeType,
          success: true
        };
      }
    }

    // Se PDF foi solicitado mas está desativado, apenas retorna HTML
    if (pdfRequested && !pdfEnabled && mimeType !== 'application/xml') {
      // garantir extensão correta
      if (!filename.endsWith('.html')) {
        filename = filename.replace(/\.pdf$/i, '.html');
      }
    }

    // Para HTML ou XML, usar método original
    if (download) {
      downloadDocument(documentContent, filename, mimeType);
    }

    return {
      content: documentContent,
      filename,
      mimeType,
      success: true,
      disabledPdf: pdfRequested && !pdfEnabled
    };

  } catch (error) {
    console.error('Erro ao gerar documento:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Faz download do documento
 */
const downloadDocument = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Gera preview do documento (sem download)
 */
const generatePreview = async (type, data, options = {}) => {
  // Permitir sobrescrever engine/quality/format, forçar download:false
  let { engine = 'print', format = 'pdf', quality = 'normal' } = options;
  // Para preview queremos visual mais "bonito"; se engine for print (não gera blob estilizado)
  // usamos html2pdf. Somente em casos explicitamente plain mantemos plain.
  if (engine === 'print') {
    engine = 'html2pdf';
  }
  return generateDocument(type, data, { download: false, engine, format, quality });
};

/**
 * Imprime documento
 */
const printDocument = (content, title = 'Documento') => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');

  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};

/**
 * Valida dados antes da geração
 */
const validateDocumentData = (type, data) => {
  const { products, customerData, selectedState } = data;

  const errors = [];

  // Validações gerais
  if (!products || products.length === 0) {
    errors.push('Adicione pelo menos um produto');
  }

  if (!customerData?.name) {
    errors.push('Preencha os dados do cliente');
  }

  if (!selectedState) {
    errors.push('Selecione o estado do cliente');
  }

  // Validações específicas por tipo
  switch (type) {
    case 'nf-icms-antiga':
    case 'nf-icms-nova':
    case 'nf-iss':
      if (!customerData?.cpfCnpj) {
        errors.push('CPF/CNPJ é obrigatório para notas fiscais');
      }
      if (!customerData?.address) {
        errors.push('Endereço é obrigatório para notas fiscais');
      }
      break;

    case 'historico-consumo':
      // Para histórico, não precisa de produtos nem estado
      if (!data.consumptionHistory || data.consumptionHistory.length === 0) {
        errors.push('Dados de histórico não encontrados');
      }
      break;

    default:
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Exportar as funções para uso direto
export const documentGenerator = {
  /**
   * Gera e baixa documento
   */
  generate: generateDocument,

  /**
   * Gera preview sem download
   */
  preview: generatePreview,

  /**
   * Imprime documento
   */
  print: printDocument,

  /**
   * Valida dados
   */
  validate: validateDocumentData,

  /**
   * Lista tipos de documentos disponíveis
   */
  getDocumentTypes: () => [
    'fatura-resumo',
    'fatura-detalhada',
    'nf-icms-antiga',
    'nf-icms-nova',
    'nf-iss',
    'historico-consumo',
    'sefaz',
    'rgc'
  ],

  /**
   * Obtém formatos disponíveis
   */
  getAvailableFormats: () => ['html', 'pdf'],

  /**
   * Obtém qualidades disponíveis para PDF
   */
  getQualityOptions: () => [
    { value: 'draft', label: 'Rascunho (Rápido)', description: 'Baixa qualidade, menor arquivo' },
    { value: 'normal', label: 'Normal (Recomendado)', description: 'Boa qualidade, tamanho médio' },
    { value: 'high', label: 'Alta (Lento)', description: 'Alta qualidade, arquivo maior' },
    { value: 'print', label: 'Impressão (Muito Lento)', description: 'Máxima qualidade para impressão' }
  ],

  /**
   * Obtém configurações de página disponíveis
   */
  getPageOptions: () => ({
    formats: [
      { value: 'a4', label: 'A4 (210 x 297mm)' },
      { value: 'letter', label: 'Carta (216 x 279mm)' },
      { value: 'a3', label: 'A3 (297 x 420mm)' }
    ],
    orientations: [
      { value: 'portrait', label: 'Retrato' },
      { value: 'landscape', label: 'Paisagem' }
    ]
  }),

  /**
   * Cria configuração customizada de PDF
   */
  createPDFConfig: (options = {}) => {
    const defaultConfig = {
      format: 'pdf',
      quality: 'normal',
      pageFormat: 'a4',
      orientation: 'portrait',
      margin: [10, 10, 10, 10]
    };

    return {
      ...defaultConfig,
      ...options,
      ...getQualityPreset(options.quality || 'normal'),
      jsPDF: {
        unit: 'mm',
        format: options.pageFormat || 'a4',
        orientation: options.orientation || 'portrait',
        compress: true,
        ...options.jsPDF
      }
    };
  },

  /**
   * Obtém informações sobre um tipo de documento
   */
  getDocumentInfo: (type) => {
    const documentInfo = {
      'fatura-resumo': {
        name: 'Fatura Resumo',
        description: 'Resumo com boleto para pagamento',
        format: 'HTML/PDF',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'fatura-detalhada': {
        name: 'Fatura Detalhada',
        description: 'Detalhamento de cada serviço/ligação',
        format: 'HTML/PDF',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'nf-icms-antiga': {
        name: 'NF ICMS Antiga',
        description: 'Nota Fiscal tradicional',
        format: 'HTML/PDF',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'nf-icms-nova': {
        name: 'NF ICMS Nova (NFCom)',
        description: 'Nova Nota Fiscal de Comunicação',
        format: 'XML',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'nf-iss': {
        name: 'NF de ISS',
        description: 'Nota Fiscal de Serviços',
        format: 'HTML/PDF',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'historico-consumo': {
        name: 'Histórico de Consumo',
        description: 'Últimos 6 meses de consumo',
        format: 'HTML/PDF',
        requiresProducts: false,
        requiresCustomer: false,
        requiresState: false
      },
      'sefaz': {
        name: 'XML SEFAZ',
        description: 'Arquivo para envio ao SEFAZ',
        format: 'XML',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: true
      },
      'rgc': {
        name: 'RGC (Relatório)',
        description: 'Relatório Gerencial de Cobrança',
        format: 'XML',
        requiresProducts: true,
        requiresCustomer: true,
        requiresState: false
      }
    };

    return documentInfo[type] || null;
  }
};

export default documentGenerator;