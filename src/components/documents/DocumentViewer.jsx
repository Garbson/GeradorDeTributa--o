import { ChevronLeft, ChevronRight, Download, Printer, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Modal, { ModalContent, ModalFooter } from '../ui/Modal.jsx';

/**
 * Componente para visualização de documentos
 */
const DocumentViewer = ({
  isOpen,
  onClose,
  document,
  title = 'Visualização do Documento'
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (document?.content && isOpen) {
      // Simular cálculo de páginas baseado no conteúdo
      const estimatedPages = Math.ceil(document.content.length / 3000);
      setTotalPages(Math.max(1, estimatedPages));
      setCurrentPage(1);
      setZoomLevel(100);
    }
  }, [document, isOpen]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleDownload = () => {
    if (!document) return;

    setIsLoading(true);
    try {
      const blob = new Blob([document.content], { type: document.mimeType || 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.filename || `documento_${Date.now()}`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!document?.content) return;

    setIsLoading(true);
    try {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write(document.content);
      printWindow.document.close();

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setIsLoading(false);
        }, 500);
      };
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      setIsLoading(false);
    }
  };

  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    // Limpar URL anterior
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    if (document?.content instanceof Blob) {
      const url = URL.createObjectURL(document.content);
      setObjectUrl(url);
    } else if (document?.blob instanceof Blob) { // caso estrutura diferente
      const url = URL.createObjectURL(document.blob);
      setObjectUrl(url);
    } else if (document?.url) {
      setObjectUrl(document.url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  const renderDocumentContent = () => {
    if (!document?.content && !document?.blob && !document?.url) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <p>Nenhum documento para visualizar</p>
        </div>
      );
    }
    const mime = document.mimeType || (document.filename?.endsWith('.pdf') ? 'application/pdf' : 'text/html');

    // Se for PDF e temos blob/url
    if (mime === 'application/pdf') {
      if (!objectUrl) {
        return <div className="h-96 flex items-center justify-center text-gray-500">Carregando PDF...</div>;
      }
      return (
        <div className="w-full h-[80vh] bg-gray-200 rounded-lg border">
          <object data={objectUrl} type="application/pdf" className="w-full h-full rounded" aria-label="Pré-visualização PDF">
            <p className="p-4 text-sm">Seu navegador não conseguiu embutir o PDF. <a href={objectUrl} target="_blank" rel="noreferrer" className="text-red-600 underline">Abrir em nova aba</a></p>
          </object>
        </div>
      );
    }

    // XML
    if (mime === 'application/xml') {
      const text = document.content instanceof Blob ? '[XML Blob]' : (document.content || '');
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="bg-white p-4 rounded border font-mono text-xs overflow-auto max-h-[70vh]">
            <pre className="whitespace-pre-wrap">{text}</pre>
          </div>
        </div>
      );
    }

    // HTML: se veio blob, converter a URL e mostrar em iframe; se string, usar dangerouslySetInnerHTML
    if (document.content instanceof Blob && objectUrl) {
      return (
        <iframe
          title="Preview HTML"
          src={objectUrl}
          className="w-full h-[80vh] bg-white border rounded"
        />
      );
    }

    const htmlString = typeof document.content === 'string' ? document.content : '[object Blob]';
    return (
      <div className="document-preview bg-white border rounded-lg overflow-auto relative" style={{ maxHeight: '80vh' }}>
        <div
          className="document-content p-4"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
        {htmlString === '[object Blob]' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm text-red-600">
            Conteúdo em Blob; gere novamente ou baixe para visualizar.
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="full"
      className="document-viewer-modal"
    >
      <ModalContent className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            {/* Controles de Zoom */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                icon={ZoomOut}
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                title="Diminuir zoom"
              />
              <span className="px-2 py-1 text-sm font-medium min-w-[60px] text-center">
                {zoomLevel}%
              </span>
              <Button
                size="sm"
                variant="ghost"
                icon={ZoomIn}
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                title="Aumentar zoom"
              />
              <Button
                size="sm"
                variant="ghost"
                icon={RotateCcw}
                onClick={handleResetZoom}
                title="Resetar zoom"
              />
            </div>

            {/* Navegação de Páginas */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 border rounded-lg p-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ChevronLeft}
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  title="Página anterior"
                />
                <span className="px-2 py-1 text-sm font-medium min-w-[80px] text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ChevronRight}
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  title="Próxima página"
                />
              </div>
            )}
          </div>

          {/* Informações do Documento */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tipo:</span> {document?.mimeType?.split('/')[1]?.toUpperCase() || 'HTML'}
            </div>
            {document?.filename && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Arquivo:</span> {document.filename}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={Download}
              onClick={handleDownload}
              loading={isLoading}
              title="Fazer download"
            >
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={Printer}
              onClick={handlePrint}
              loading={isLoading}
              title="Imprimir"
            >
              Imprimir
            </Button>
          </div>
        </div>

        {/* Área de Visualização */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="max-w-full mx-auto">
            {renderDocumentContent()}
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-gray-500">
            Use Ctrl+P para imprimir ou Ctrl+S para salvar
          </div>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default DocumentViewer;