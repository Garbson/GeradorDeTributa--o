import { BarChart3, Calculator, Download, FileText, MapPin } from 'lucide-react';
import { useState } from 'react';

// Hooks customizados
import { useDocumentGeneration } from './hooks/useDocumentGeneration.js';
import { usePrintPreview } from './hooks/usePrintPreview.js';
import { useProducts } from './hooks/useProducts.js';
import { useTaxCalculation } from './hooks/useTaxCalculation.js';

// Componentes das abas
import BillTab from './components/tabs/BillTab.jsx';
import CustomerTab from './components/tabs/CustomerTab.jsx';
import HistoryTab from './components/tabs/HistoryTab.jsx';
import ProductsTab from './components/tabs/ProductsTab.jsx';
import XmlTab from './components/tabs/XmlTab.jsx';

// Componentes de documentos
import { documentGenerator } from './components/documents/DocumentGenerator.jsx';
import DocumentViewer from './components/documents/DocumentViewer.jsx';

// Utilitários e constantes
import { defaultConsumptionHistory, estados } from './utils/constants.js';

/**
 * Componente principal da aplicação refatorado
 */
const TelecomBillingSystem = () => {
  // Estados principais
  const [selectedState, setSelectedState] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [customerData, setCustomerData] = useState({
    name: '',
    cpfCnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [consumptionHistory] = useState(defaultConsumptionHistory);

  // Hooks customizados
  const {
    products,
    currentProduct,
    addProduct,
    removeProduct,
    updateCurrentProduct,
    duplicateProduct,
    canAddProduct,
    totalGrossValue
  } = useProducts();

  const taxCalculations = useTaxCalculation(products, selectedState);

  const {
    generateDocument,
    generatePreview,
    isGenerating,
    error: documentError
  } = useDocumentGeneration();

  const {
    isPreviewOpen,
    previewContent,
    previewTitle,
    openPreview,
    closePreview,
    printDocument
  } = usePrintPreview();

  // Estado para viewer de documentos
  const [viewerDocument, setViewerDocument] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  // Engine fixo: print (navegador)
  const pdfEngine = 'print';

  // Expor lista de estados global para ProductsTab (evitar import duplo rápido)
  if (typeof window !== 'undefined' && !window.__ESTADOS_LIST__) {
    window.__ESTADOS_LIST__ = estados;
  }

  // Definição das abas
  const tabs = [
    { id: 'products', label: 'Produtos', icon: Calculator },
    { id: 'customer', label: 'Cliente', icon: MapPin },
    { id: 'bill', label: 'Fatura', icon: FileText },
    { id: 'history', label: 'Histórico', icon: BarChart3 },
    { id: 'xml', label: 'XML/NFCom', icon: Download }
  ];

  // Handlers
  const handleSelectedStateChange = (uf) => {
    setSelectedState(uf);
    setCustomerData(prev => ({ ...prev, state: uf }));
  };
  const handleProductChange = (updates) => {
    updateCurrentProduct(updates);
  };

  const handleAddProduct = () => {
    const result = addProduct();
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleCustomerDataChange = (updates) => {
    setCustomerData(prev => ({ ...prev, ...updates }));

    // Sincronizar estado selecionado
    if (updates.state && updates.state !== selectedState) {
      setSelectedState(updates.state);
    }
  };

  const handleGenerateDocument = async (type, data) => {
    try {
      // Garantir que selectedState está presente
      const dataWithState = {
        ...data,
        selectedState: data.selectedState || selectedState || customerData.state
      };

      // Validar dados
      const validation = documentGenerator.validate(type, dataWithState);
      if (!validation.isValid) {
        alert('Erro: ' + validation.errors.join(', '));
        return;
      }

      // Gerar documento
  const result = await documentGenerator.generate(type, dataWithState, { format:'pdf', engine: 'print' });
      if (!result.success) {
        alert('Erro ao gerar documento: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro inesperado ao gerar documento');
    }
  };

  const handlePreviewDocument = async (data) => {
    try {
      // Garantir que selectedState está presente
      const dataWithState = {
        ...data,
        selectedState: data.selectedState || selectedState || customerData.state
      };

  const result = await documentGenerator.preview('fatura-resumo', dataWithState, { format:'pdf', engine: 'print' });
      if (result.success) {
        setViewerDocument(result);
        setIsViewerOpen(true);
      }
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
    }
  };

  const handlePrintDocument = () => {
    const data = {
      products,
      customerData,
      taxCalculations,
      selectedState: selectedState || customerData.state
    };

    handlePreviewDocument(data);
  };

  const handleGenerateXML = async (data) => {
    try {
      // Garantir que selectedState está presente
      const dataWithState = {
        ...data,
        selectedState: data.selectedState || selectedState || customerData.state
      };

  const result = await documentGenerator.generate('nf-icms-nova', dataWithState, { format:'pdf', engine: 'print' });
      if (!result.success) {
        alert('Erro ao gerar XML: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao gerar XML:', error);
      alert('Erro inesperado ao gerar XML');
    }
  };

  const closeDocumentViewer = () => {
    setIsViewerOpen(false);
    setViewerDocument(null);
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-white font-bold text-2xl">C</div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-800">Sistema de Faturamento Telecom</h1>
              <div className="text-lg text-red-600 font-semibold">Claro / Embratel</div>
            </div>
          </div>
          <p className="text-lg text-gray-600">Geração Completa de Faturas e NFCom</p>
        </header>

        {/* Navegação por Abas */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="flex border-b">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-colors
                    ${activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            currentProduct={currentProduct}
            selectedState={selectedState}
            onStateChange={handleSelectedStateChange}
            onProductChange={handleProductChange}
            onAddProduct={handleAddProduct}
            onRemoveProduct={removeProduct}
            onDuplicateProduct={duplicateProduct}
            canAddProduct={canAddProduct}
            taxCalculations={taxCalculations}
          />
        )}

        {activeTab === 'customer' && (
          <CustomerTab
            customerData={customerData}
            onCustomerDataChange={handleCustomerDataChange}
            selectedState={selectedState}
          />
        )}

        {activeTab === 'bill' && (
          <BillTab
            products={products}
            customerData={customerData}
            taxCalculations={taxCalculations}
            onGenerateDocument={handleGenerateDocument}
            onPreviewDocument={handlePreviewDocument}
            onPrintDocument={handlePrintDocument}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            consumptionHistory={consumptionHistory}
          />
        )}

        {activeTab === 'xml' && (
          <XmlTab
            products={products}
            selectedState={selectedState}
            customerData={customerData}
            taxCalculations={taxCalculations}
            onGenerateXML={handleGenerateXML}
            onGenerateDocument={handleGenerateDocument}
            isGenerating={isGenerating}
          />
        )}

        {/* Seletor de Estado Global */}
  {/* Card de estado removido; seleção agora dentro das abas */}

        {/* Viewer de Documentos */}
        <DocumentViewer
          isOpen={isViewerOpen}
          onClose={closeDocumentViewer}
          document={viewerDocument}
          title="Visualização do Documento"
          extraInfo={'Engine: print'}
        />

        {/* Indicador de Status */}
        {(isGenerating || documentError) && (
          <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 max-w-sm">
            {isGenerating && (
              <div className="flex items-center gap-3">
                <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600">Gerando documento...</span>
              </div>
            )}
            {documentError && (
              <div className="text-sm text-red-600">
                Erro: {documentError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TelecomBillingSystem;