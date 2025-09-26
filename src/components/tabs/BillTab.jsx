import React from 'react';
import { Eye, Printer, FileText, DollarSign, Percent, Info, Calculator, BarChart3 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { documentTypes } from '../../utils/constants.js';

/**
 * Componente da aba de fatura
 */
const BillTab = ({
  products,
  customerData,
  taxCalculations,
  onGenerateDocument,
  onPreviewDocument,
  onPrintDocument
}) => {
  const { totalBill } = taxCalculations || {};

  // Mapear ícones dos documentos
  const iconMap = {
    DollarSign,
    FileText,
    Percent,
    Info,
    Calculator,
    BarChart3
  };

  const handleGenerateDocument = (documentType) => {
    const data = {
      products,
      customerData,
      taxCalculations,
      selectedState: customerData?.state // Adicionar selectedState
    };

    onGenerateDocument(documentType.id, data);
  };

  const handlePreviewDocument = () => {
    const data = {
      products,
      customerData,
      taxCalculations,
      selectedState: customerData?.state
    };

    onPreviewDocument(data);
  };

  return (
    <div className="space-y-8">
      {/* Prévia da Fatura */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Prévia da Fatura</h2>
          <div className="flex gap-3">
            <Button
              variant="primary"
              icon={Eye}
              onClick={handlePreviewDocument}
              disabled={!products?.length}
            >
              Visualizar
            </Button>
            <Button
              variant="secondary"
              icon={Printer}
              onClick={onPrintDocument}
              disabled={!products?.length}
            >
              Imprimir
            </Button>
          </div>
        </div>

        {/* Simulação da Fatura */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-3xl">C</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">CLARO S.A.</h3>
            <p className="text-gray-600">Fatura de Serviços de Telecomunicações</p>
            <p className="text-sm text-gray-500 mt-2">
              Competência: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Dados do Cliente */}
          {customerData?.name && (
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-3">Dados do Cliente:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded">
                <div><strong>Nome:</strong> {customerData.name}</div>
                <div><strong>CPF/CNPJ:</strong> {customerData.cpfCnpj}</div>
                <div><strong>Telefone:</strong> {customerData.phone}</div>
                <div><strong>Endereço:</strong> {customerData.address}</div>
                <div><strong>Cidade:</strong> {customerData.city}/{customerData.state}</div>
                <div><strong>CEP:</strong> {customerData.zipCode}</div>
              </div>
            </div>
          )}

          {/* Serviços Utilizados */}
          {products?.length > 0 ? (
            <div className="mb-8">
              <h4 className="font-semibold text-gray-800 mb-3">Serviços Utilizados:</h4>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <span className="font-medium">{product.description}</span>
                      <span className="text-sm text-gray-500 ml-2">Qtd: {product.quantity}</span>
                    </div>
                    <span className="font-bold">{formatCurrency(product.grossValue * product.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Total da Fatura */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold text-red-800">Total da Fatura</div>
                    {taxCalculations && (
                      <div className="text-sm text-red-600 mt-1">
                        Valor Líquido: {formatCurrency(taxCalculations.totalNet)} |
                        Total de Impostos: {formatCurrency(taxCalculations.totalTaxes)}
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-red-800">
                    {formatCurrency(totalBill || 0)}
                  </div>
                </div>
              </div>

              {/* Informações de Pagamento */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Informações de Pagamento:</h5>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>Vencimento: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</div>
                  <div>PIX: Disponível no QR Code do boleto</div>
                  <div>Débito Automático: Entre em contato para ativar</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Adicione produtos para gerar a prévia da fatura</p>
            </div>
          )}
        </div>
      </div>

      {/* Tipos de Documentos */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Documentos Disponíveis</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentTypes.map((doc) => {
            const IconComponent = iconMap[doc.icon] || FileText;

            return (
              <div key={doc.id} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <IconComponent className="w-8 h-8 text-red-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">{doc.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{doc.desc}</p>

                <Button
                  variant="light"
                  onClick={() => handleGenerateDocument(doc)}
                  disabled={!products?.length || !customerData?.name}
                  className="w-full"
                >
                  Gerar Documento
                </Button>

                {/* Status de disponibilidade */}
                {(!products?.length || !customerData?.name) && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {!products?.length && 'Adicione produtos'}
                    {!customerData?.name && !products?.length && ' e '}
                    {!customerData?.name && 'preencha dados do cliente'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Observações */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">📝 Observações Importantes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Os documentos são gerados conforme a legislação tributária brasileira vigente</li>
            <li>• A NFCom (Nota Fiscal de Comunicação) inclui os novos impostos da reforma tributária</li>
            <li>• Todos os cálculos são feitos automaticamente baseados no estado do cliente</li>
            <li>• Os arquivos podem ser salvos em PDF ou XML conforme o tipo de documento</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BillTab;