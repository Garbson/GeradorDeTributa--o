import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para gerenciamento de preview e impressão
 * @returns {object} Estados e funções para preview e impressão
 */
export const usePrintPreview = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  // Abrir preview
  const openPreview = useCallback((content, title = 'Documento') => {
    setPreviewContent(content);
    setPreviewTitle(title);
    setIsPreviewOpen(true);
    setCurrentPage(1);
    setZoomLevel(100);

    // Calcular número de páginas (simulado por enquanto)
    // TODO: Implementar cálculo real baseado no conteúdo
    setTotalPages(Math.ceil(content?.length / 1000) || 1);
  }, []);

  // Fechar preview
  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewContent(null);
    setPreviewTitle('');
    setCurrentPage(1);
    setTotalPages(1);
    setZoomLevel(100);
  }, []);

  // Navegar páginas
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Controle de zoom
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(100);
  }, []);

  // Imprimir documento atual
  const printDocument = useCallback((options = {}) => {
    if (!previewContent) return;

    setIsLoading(true);

    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');

      const printHTML = generatePrintHTML(previewContent, previewTitle, options);

      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Aguardar carregamento antes de imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          if (options.closeAfterPrint !== false) {
            printWindow.close();
          }
          setIsLoading(false);
        }, 500);
      };
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      setIsLoading(false);
    }
  }, [previewContent, previewTitle]);

  // Download como PDF (simulado)
  const downloadAsPDF = useCallback(async (filename) => {
    if (!previewContent) return;

    setIsLoading(true);

    try {
      // TODO: Implementar geração real de PDF
      // Por enquanto, simula o download
      const blob = new Blob([previewContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${previewTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    } finally {
      setIsLoading(false);
    }
  }, [previewContent, previewTitle]);

  // Atalhos de teclado
  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          closePreview();
          break;
        case 'ArrowLeft':
          previousPage();
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'p':
        case 'P':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            printDocument();
          }
          break;
        case '+':
        case '=':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            zoomOut();
          }
          break;
        case '0':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetZoom();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, closePreview, previousPage, nextPage, printDocument, zoomIn, zoomOut, resetZoom]);

  return {
    // Estados
    isPreviewOpen,
    previewContent,
    previewTitle,
    currentPage,
    totalPages,
    zoomLevel,
    isLoading,

    // Funções de controle
    openPreview,
    closePreview,

    // Navegação
    goToPage,
    nextPage,
    previousPage,

    // Zoom
    zoomIn,
    zoomOut,
    resetZoom,

    // Ações
    printDocument,
    downloadAsPDF,

    // Estados computados
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  };
};

// Função para gerar HTML para impressão
const generatePrintHTML = (content, title, options = {}) => {
  const {
    orientation = 'portrait',
    margins = '20mm',
    fontSize = '12pt',
    fontFamily = 'Arial, sans-serif'
  } = options;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4 ${orientation};
          margin: ${margins};
        }

        body {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          line-height: 1.4;
          margin: 0;
          padding: 0;
          color: #000;
          background: #fff;
        }

        .header {
          border-bottom: 2px solid #333;
          margin-bottom: 20px;
          padding-bottom: 10px;
        }

        .footer {
          border-top: 1px solid #ccc;
          margin-top: 20px;
          padding-top: 10px;
          font-size: 10pt;
          color: #666;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }

        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }

        @media print {
          .no-print { display: none; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <p>Documento gerado pelo Sistema de Faturamento Telecom - Claro S.A.</p>
      </div>
    </body>
    </html>
  `;
};