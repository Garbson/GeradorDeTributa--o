import React from 'react';
import { Download, FileCode, Send, Archive } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';

/**
 * Componente da aba XML/NFCom
 */
const XmlTab = ({
  products,
  selectedState,
  customerData,
  taxCalculations,
  onGenerateXML,
  onGenerateDocument,
  isGenerating = false
}) => {
  const hasValidData = products?.length > 0 && selectedState && customerData?.name;

  const handleGenerateXML = (type) => {
    if (!hasValidData) return;

    const data = {
      products,
      selectedState,
      customerData,
      taxCalculations
    };

    if (type === 'nfcom') {
      onGenerateXML(data);
    } else {
      onGenerateDocument(type, data);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Geração de Arquivos XML</h2>

        {/* Tipos de XML disponíveis */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* NFCom + Reforma Tributária */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <FileCode className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-blue-800 mb-3">NFCom + Reforma Tributária</h3>
            <p className="text-sm text-blue-600 mb-4">
              Arquivo XML completo com impostos da reforma tributária (CBS, IBS)
            </p>
            <Button
              variant="primary"
              icon={Download}
              onClick={() => handleGenerateXML('nfcom')}
              disabled={!hasValidData || isGenerating}
              loading={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Gerar NFCom XML
            </Button>
          </div>

          {/* XML SEFAZ */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <Send className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-green-800 mb-3">XML SEFAZ</h3>
            <p className="text-sm text-green-600 mb-4">
              Arquivo para envio ao SEFAZ (sem RGC)
            </p>
            <Button
              variant="success"
              icon={Download}
              onClick={() => handleGenerateXML('sefaz')}
              disabled={!hasValidData || isGenerating}
              loading={isGenerating}
              className="w-full"
            >
              Gerar SEFAZ XML
            </Button>
          </div>

          {/* RGC (Relatório) */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <Archive className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-purple-800 mb-3">RGC (Relatório)</h3>
            <p className="text-sm text-purple-600 mb-4">
              Relatório Gerencial de Cobrança (apenas para fatura)
            </p>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => handleGenerateXML('rgc')}
              disabled={!hasValidData || isGenerating}
              loading={isGenerating}
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            >
              Gerar RGC
            </Button>
          </div>
        </div>

        {/* Status de validação */}
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded-lg ${products?.length > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className="font-medium">Produtos:</span> {products?.length || 0} item(s)
            {products?.length === 0 && ' - Adicione produtos'}
          </div>
          <div className={`p-3 rounded-lg ${selectedState ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className="font-medium">Estado:</span> {selectedState || 'Não selecionado'}
          </div>
          <div className={`p-3 rounded-lg ${customerData?.name ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span className="font-medium">Cliente:</span> {customerData?.name ? 'Completo' : 'Incompleto'}
          </div>
        </div>
      </div>

      {/* Resumo dos Impostos para XML */}
      {hasValidData && taxCalculations && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Resumo dos Impostos para XML</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'ICMS', value: taxCalculations.taxBreakdown?.icms || 0, color: 'red' },
              { label: 'FCP', value: taxCalculations.taxBreakdown?.fcp || 0, color: 'red' },
              { label: 'PIS', value: taxCalculations.taxBreakdown?.pis || 0, color: 'blue' },
              { label: 'COFINS', value: taxCalculations.taxBreakdown?.cofins || 0, color: 'blue' },
              { label: 'ISS', value: taxCalculations.taxBreakdown?.iss || 0, color: 'green' },
              { label: 'FUST', value: taxCalculations.taxBreakdown?.fust || 0, color: 'green' },
              { label: 'FUNTTEL', value: taxCalculations.taxBreakdown?.funttel || 0, color: 'green' },
              { label: 'CSLL', value: taxCalculations.taxBreakdown?.csll || 0, color: 'purple' },
              { label: 'CBS Federal', value: taxCalculations.taxBreakdown?.cbs || 0, color: 'orange' },
              { label: 'IBS-UF', value: taxCalculations.taxBreakdown?.ibsUf || 0, color: 'yellow' }
            ].map((tax, index) => (
              <div key={index} className={`bg-white p-3 rounded-lg border border-gray-200 text-center`}>
                <div className="text-xs text-gray-600 mb-1">{tax.label}</div>
                <div className={`font-bold text-${tax.color}-600`}>
                  {formatCurrency(tax.value)}
                </div>
              </div>
            ))}
          </div>

          {/* Totais */}
          <div className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600">Valor Líquido</div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(taxCalculations.totalNet || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Total de Impostos</div>
              <div className="text-lg font-bold text-orange-600">
                {formatCurrency(taxCalculations.totalTaxes || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Valor Bruto</div>
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(taxCalculations.totalBill || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informações técnicas */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Informações Técnicas</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Especificações do XML:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Versão: NFCom 1.0</li>
              <li>• Encoding: UTF-8</li>
              <li>• Schema: Receita Federal do Brasil</li>
              <li>• Validação: Automática</li>
              <li>• Assinatura Digital: Incluída</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Impostos Incluídos:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• ICMS/FCP (Estado específico)</li>
              <li>• PIS/COFINS (Federal)</li>
              <li>• FUST/FUNTTEL (Telecom)</li>
              <li>• CBS/IBS (Reforma Tributária)</li>
              <li>• ISS (Municipal)</li>
            </ul>
          </div>
        </div>

        {/* Avisos importantes */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Avisos Importantes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Certifique-se de que todos os dados estão corretos antes de gerar o XML</li>
            <li>• O arquivo NFCom deve ser transmitido ao SEFAZ em até 24 horas</li>
            <li>• Mantenha backup dos arquivos XML gerados</li>
            <li>• Verifique a validade do certificado digital antes da transmissão</li>
          </ul>
        </div>
      </div>

      {/* Estado quando não há dados válidos */}
      {!hasValidData && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center py-12">
            <FileCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Complete os dados para gerar XML
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione produtos, selecione o estado e preencha os dados do cliente
            </p>
            <div className="text-sm text-gray-400">
              <p>1. Vá para a aba "Produtos" e adicione itens</p>
              <p>2. Selecione o estado do cliente</p>
              <p>3. Preencha os dados na aba "Cliente"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XmlTab;