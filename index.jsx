// ARQUIVO REFATORADO - A nova versão está em src/App.jsx
// Este arquivo mantém compatibilidade, mas use src/App.jsx para desenvolvimento

import TelecomBillingSystem from './src/App.jsx';

// Exportar o componente refatorado
export default TelecomBillingSystem;

/*
// Código original comentado abaixo para referência:
import { BarChart3, Calculator, DollarSign, Download, Eye, FileText, Info, MapPin, Percent, Phone, Play, Plus, Printer, Trash2, Wifi } from 'lucide-react';
import { useState } from 'react';

const TelecomBillingSystemOriginal = () => {
  const [selectedState, setSelectedState] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    type: 'voice',
    description: '',
    grossValue: '',
    quantity: 1
  });
  
  const [customerData, setCustomerData] = useState({
    name: '',
    cpfCnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [consumptionHistory, setConsumptionHistory] = useState([
    { month: 'Set/2025', voice: 120, data: 45.5, value: 89.90 },
    { month: 'Ago/2025', voice: 98, data: 52.3, value: 94.50 },
    { month: 'Jul/2025', voice: 145, data: 38.7, value: 87.20 },
    { month: 'Jun/2025', voice: 167, data: 41.2, value: 92.30 },
    { month: 'Mai/2025', voice: 134, data: 47.8, value: 91.80 },
    { month: 'Abr/2025', voice: 89, data: 44.1, value: 85.60 }
  ]);

  // Alíquotas de ICMS por estado
  const icmsRates = {
    'AC': 17, 'AL': 17, 'AP': 18, 'AM': 18, 'BA': 18, 'CE': 18,
    'DF': 18, 'ES': 17, 'GO': 17, 'MA': 18, 'MT': 17, 'MS': 17,
    'MG': 18, 'PA': 17, 'PB': 18, 'PR': 18, 'PE': 18, 'PI': 18,
    'RJ': 18, 'RN': 18, 'RS': 18, 'RO': 17.5, 'RR': 17, 'SC': 17,
    'SP': 18, 'SE': 18, 'TO': 18
  };

  // Alíquotas de FCP por estado
  const fcpRates = {
    'AC': 0, 'AL': 2, 'AP': 0, 'AM': 1, 'BA': 1.5, 'CE': 2,
    'DF': 0, 'ES': 1, 'GO': 2, 'MA': 1, 'MT': 2, 'MS': 2,
    'MG': 2, 'PA': 2, 'PB': 2, 'PR': 2, 'PE': 2, 'PI': 1,
    'RJ': 4, 'RN': 2, 'RS': 2, 'RO': 1, 'RR': 0, 'SC': 2,
    'SP': 1, 'SE': 2, 'TO': 2
  };

  // Tipos de produtos telecom
  const productTypes = [
    { value: 'voice', label: 'Ligação Telefônica', icon: Phone },
    { value: 'internet', label: 'Banda Larga', icon: Wifi },
    { value: 'streaming', label: 'Streaming (Netflix, etc.)', icon: Play },
    { value: 'sms', label: 'SMS/Torpedos', icon: FileText },
    { value: 'roaming', label: 'Roaming', icon: MapPin }
  ];

  // Produtos pré-definidos
  const predefinedProducts = {
    voice: [
      { description: 'Ligação Local Fixo-Fixo (por minuto)', grossValue: 0.15 },
      { description: 'Ligação Local Fixo-Móvel (por minuto)', grossValue: 0.45 },
      { description: 'Ligação Interurbana DDD (por minuto)', grossValue: 1.20 },
      { description: 'Ligação Internacional (por minuto)', grossValue: 2.50 }
    ],
    internet: [
      { description: 'Banda Larga 100MB - Mensal', grossValue: 89.90 },
      { description: 'Banda Larga 300MB - Mensal', grossValue: 119.90 },
      { description: 'Banda Larga 500MB - Mensal', grossValue: 149.90 },
      { description: 'Banda Larga 1GB - Mensal', grossValue: 199.90 }
    ],
    streaming: [
      { description: 'Netflix Básico - Claro', grossValue: 25.90 },
      { description: 'Netflix Padrão - Claro', grossValue: 39.90 },
      { description: 'Amazon Prime - Claro', grossValue: 14.90 },
      { description: 'Globoplay - Claro', grossValue: 24.90 }
    ]
  };

  const estados = [
    { code: 'SP', name: 'São Paulo' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'PR', name: 'Paraná' },
    { code: 'SC', name: 'Santa Catarina' }
  ];

  const addProduct = () => {
    if (!currentProduct.description || !currentProduct.grossValue) return;
    
    const newProduct = {
      id: Date.now(),
      ...currentProduct,
      grossValue: parseFloat(currentProduct.grossValue.toString().replace(',', '.'))
    };
    
    setProducts([...products, newProduct]);
    setCurrentProduct({
      type: 'voice',
      description: '',
      grossValue: '',
      quantity: 1
    });
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const calculateTaxes = (grossValue) => {
    if (!selectedState) return null;

    const icmsRate = icmsRates[selectedState];
    const fcpRate = fcpRates[selectedState];
    
    // Cálculo reverso - valor já vem com impostos
    const netValue = grossValue / (1 + (icmsRate + fcpRate + 1.65 + 7.6 + 5 + 1 + 0.5 + 9 + 0.9 + 0.1) / 100);
    
    const icmsValue = netValue * icmsRate / 100;
    const fcpValue = netValue * fcpRate / 100;
    const pisValue = netValue * 1.65 / 100;
    const cofinsValue = netValue * 7.6 / 100;
    const issValue = netValue * 5 / 100;
    const fustValue = netValue * 1 / 100;
    const funttelValue = netValue * 0.5 / 100;
    const csllValue = netValue * 9 / 100;
    const cbsValue = netValue * 0.9 / 100;
    const ibsUfValue = netValue * 0.1 / 100;
    
    return {
      netValue,
      icmsValue,
      fcpValue,
      pisValue,
      cofinsValue,
      issValue,
      fustValue,
      funttelValue,
      csllValue,
      cbsValue,
      ibsUfValue,
      totalTaxes: icmsValue + fcpValue + pisValue + cofinsValue + issValue + fustValue + funttelValue + csllValue + cbsValue + ibsUfValue
    };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const generateXML = () => {
    const totalValue = products.reduce((sum, p) => sum + (p.grossValue * p.quantity), 0);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFCom xmlns="http://www.portalfiscal.inf.br/nfcom">
  <infNFCom Id="NFCom35210114200166000187550010000000011123456789">
    <ide>
      <cUF>35</cUF>
      <cNF>12345678</cNF>
      <natOp>Prestação de Serviços de Comunicação</natOp>
      <mod>62</mod>
      <serie>1</serie>
      <nNF>1</nNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>9</cDV>
      <tpAmb>2</tpAmb>
      <finNFCom>1</finNFCom>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>14200166000187</CNPJ>
      <xNome>CLARO S.A.</xNome>
      <enderEmit>
        <xLgr>Rua Exemplo</xLgr>
        <nro>1000</nro>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>São Paulo</xMun>
        <UF>SP</UF>
        <CEP>01000000</CEP>
      </enderEmit>
      <IE>123456789012</IE>
    </emit>
    <dest>
      <CPF>${customerData.cpfCnpj}</CPF>
      <xNome>${customerData.name}</xNome>
      <enderDest>
        <xLgr>${customerData.address}</xLgr>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>${customerData.city}</xMun>
        <UF>${customerData.state}</UF>
        <CEP>${customerData.zipCode}</CEP>
      </enderDest>
    </dest>
    ${products.map((product, index) => {
      const taxes = calculateTaxes(product.grossValue);
      return `<det nItem="${index + 1}">
      <prod>
        <cProd>${index + 1}</cProd>
        <xProd>${product.description}</xProd>
        <CFOP>5303</CFOP>
        <uCom>UN</uCom>
        <qCom>${product.quantity}</qCom>
        <vUnCom>${product.grossValue.toFixed(2)}</vUnCom>
        <vProd>${(product.grossValue * product.quantity).toFixed(2)}</vProd>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>0</orig>
            <CST>00</CST>
            <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
            <pICMS>${icmsRates[selectedState] || 18}</pICMS>
            <vICMS>${taxes?.icmsValue.toFixed(2) || '0.00'}</vICMS>
          </ICMS00>
        </ICMS>
        <PIS>
          <PISAliq>
            <CST>01</CST>
            <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
            <pPIS>1.65</pPIS>
            <vPIS>${taxes?.pisValue.toFixed(2) || '0.00'}</vPIS>
          </PISAliq>
        </PIS>
        <COFINS>
          <COFINSAliq>
            <CST>01</CST>
            <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
            <pCOFINS>7.60</pCOFINS>
            <vCOFINS>${taxes?.cofinsValue.toFixed(2) || '0.00'}</vCOFINS>
          </COFINSAliq>
        </COFINS>
        <FUST>
          <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
          <pFUST>1.00</pFUST>
          <vFUST>${taxes?.fustValue.toFixed(2) || '0.00'}</vFUST>
        </FUST>
        <FUNTTEL>
          <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
          <pFUNTTEL>0.50</pFUNTTEL>
          <vFUNTTEL>${taxes?.funttelValue.toFixed(2) || '0.00'}</vFUNTTEL>
        </FUNTTEL>
        <CBS>
          <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
          <pCBS>0.90</pCBS>
          <vCBS>${taxes?.cbsValue.toFixed(2) || '0.00'}</vCBS>
        </CBS>
        <IBS>
          <vBC>${taxes?.netValue.toFixed(2) || '0.00'}</vBC>
          <pIBS>0.10</pIBS>
          <vIBS>${taxes?.ibsUfValue.toFixed(2) || '0.00'}</vIBS>
        </IBS>
      </imposto>
    </det>`;
    }).join('')}
  </infNFCom>
</NFCom>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NFCom.xml';
    a.click();
  };

  const totalBill = products.reduce((sum, p) => sum + (p.grossValue * p.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
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
            {[
              { id: 'products', label: 'Produtos', icon: Calculator },
              { id: 'customer', label: 'Cliente', icon: MapPin },
              { id: 'bill', label: 'Fatura', icon: FileText },
              { id: 'history', label: 'Histórico', icon: BarChart3 },
              { id: 'xml', label: 'XML/NFCom', icon: Download }
            ].map(tab => {
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

        {/* Aba Produtos */}
        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Adicionar Produtos</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado do Cliente</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione o estado...</option>
                    {estados.map(estado => (
                      <option key={estado.code} value={estado.code}>
                        {estado.name} ({estado.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Produto</label>
                  <select
                    value={currentProduct.type}
                    onChange={(e) => setCurrentProduct({...currentProduct, type: e.target.value, description: ''})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {productTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                  <select
                    value={currentProduct.description}
                    onChange={(e) => {
                      const selected = predefinedProducts[currentProduct.type]?.find(p => p.description === e.target.value);
                      setCurrentProduct({
                        ...currentProduct, 
                        description: e.target.value,
                        grossValue: selected?.grossValue || ''
                      });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecione um produto...</option>
                    {predefinedProducts[currentProduct.type]?.map(product => (
                      <option key={product.description} value={product.description}>
                        {product.description} - {formatCurrency(product.grossValue)}
                      </option>
                    ))}
                    <option value="custom">Produto personalizado...</option>
                  </select>
                </div>

                {currentProduct.description === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Personalizada</label>
                    <input
                      type="text"
                      placeholder="Digite a descrição do produto..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                    <input
                      type="number"
                      value={currentProduct.quantity}
                      onChange={(e) => setCurrentProduct({...currentProduct, quantity: parseInt(e.target.value) || 1})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor Bruto (c/ impostos)</label>
                    <input
                      type="text"
                      value={currentProduct.grossValue}
                      onChange={(e) => setCurrentProduct({...currentProduct, grossValue: e.target.value})}
                      placeholder="Ex: 89,90"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={addProduct}
                  disabled={!currentProduct.description || !currentProduct.grossValue || !selectedState}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Adicionar Produto
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Produtos Adicionados</h2>
              
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum produto adicionado ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => {
                    const Icon = productTypes.find(t => t.value === product.type)?.icon || Calculator;
                    const taxes = calculateTaxes(product.grossValue);
                    
                    return (
                      <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="font-semibold text-gray-800">{product.description}</div>
                              <div className="text-sm text-gray-500">
                                Qtd: {product.quantity} | Total: {formatCurrency(product.grossValue * product.quantity)}
                              </div>
                              {taxes && (
                                <div className="text-xs text-gray-400">
                                  Líquido: {formatCurrency(taxes.netValue)} | Impostos: {formatCurrency(taxes.totalTaxes)}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="mt-6 p-4 bg-red-50 rounded-lg">
                    <div className="text-lg font-semibold text-red-800">
                      Total da Fatura: {formatCurrency(totalBill)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aba Cliente */}
        {activeTab === 'customer' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dados do Cliente</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</label>
                <input
                  type="text"
                  value={customerData.cpfCnpj}
                  onChange={(e) => setCustomerData({...customerData, cpfCnpj: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  value={customerData.city}
                  onChange={(e) => setCustomerData({...customerData, city: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={customerData.state}
                  onChange={(e) => setCustomerData({...customerData, state: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {estados.map(estado => (
                    <option key={estado.code} value={estado.code}>{estado.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input
                  type="text"
                  value={customerData.zipCode}
                  onChange={(e) => setCustomerData({...customerData, zipCode: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Aba Fatura */}
        {activeTab === 'bill' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Prévia da Fatura</h2>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
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
                </div>

                {customerData.name && (
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-800 mb-3">Dados do Cliente:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Nome:</strong> {customerData.name}</div>
                      <div><strong>CPF/CNPJ:</strong> {customerData.cpfCnpj}</div>
                      <div><strong>Telefone:</strong> {customerData.phone}</div>
                      <div><strong>Cidade:</strong> {customerData.city}/{customerData.state}</div>
                    </div>
                  </div>
                )}

                {products.length > 0 && (
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
                    
                    <div className="mt-6 p-4 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center text-xl font-bold text-red-800">
                        <span>Total da Fatura:</span>
                        <span>{formatCurrency(totalBill)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Adicione produtos para gerar a prévia da fatura</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tipos de Documentos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: '1. Fatura Resumo', desc: 'Resumo com boleto para pagamento', icon: DollarSign },
                { title: '2. Fatura Detalhada', desc: 'Detalhamento de cada serviço/ligação', icon: FileText },
                { title: '3. NF ICMS Antiga', desc: 'Nota Fiscal tradicional', icon: Percent },
                { title: '4. NF ICMS Nova (NFCom)', desc: 'Nova Nota Fiscal de Comunicação', icon: Info },
                { title: '5. NF de ISS', desc: 'Nota Fiscal de Serviços', icon: Calculator },
                { title: '6. Histórico de Consumo', desc: 'Últimos 6 meses de consumo', icon: BarChart3 }
              ].map((doc, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <doc.icon className="w-8 h-8 text-red-600 mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{doc.desc}</p>
                  <button className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                    Gerar Documento
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Histórico */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Histórico de Consumo - Últimos 6 Meses</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-red-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Mês/Ano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Minutos de Voz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Dados (GB)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">Valor da Fatura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {consumptionHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.voice} min</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.data} GB</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{formatCurrency(record.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">Média de Voz</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(consumptionHistory.reduce((sum, r) => sum + r.voice, 0) / consumptionHistory.length)} min
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">Média de Dados</h3>
                <p className="text-2xl font-bold text-green-600">
                  {(consumptionHistory.reduce((sum, r) => sum + r.data, 0) / consumptionHistory.length).toFixed(1)} GB
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-xl">
                <h3 className="font-semibold text-red-800 mb-2">Média de Fatura</h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(consumptionHistory.reduce((sum, r) => sum + r.value, 0) / consumptionHistory.length)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Aba XML/NFCom */}
        {activeTab === 'xml' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Geração de Arquivos XML</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <h3 className="font-semibold text-blue-800 mb-3">NFCom + Reforma Tributária</h3>
                  <p className="text-sm text-blue-600 mb-4">Arquivo XML completo com impostos da reforma tributária (CBS, IBS)</p>
                  <button 
                    onClick={generateXML}
                    disabled={products.length === 0}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Gerar NFCom XML
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-3">XML SEFAZ</h3>
                  <p className="text-sm text-green-600 mb-4">Arquivo para envio ao SEFAZ (sem RGC)</p>
                  <button 
                    disabled={products.length === 0}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Gerar SEFAZ XML
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <h3 className="font-semibold text-purple-800 mb-3">RGC (Relatório)</h3>
                  <p className="text-sm text-purple-600 mb-4">Relatório Gerencial de Cobrança (apenas para fatura)</p>
                  <button 
                    disabled={products.length === 0}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Gerar RGC
                  </button>
                </div>
              </div>

              {products.length > 0 && selectedState && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4">Resumo dos Impostos para XML</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {(() => {
                      const totalTaxes = products.reduce((acc, product) => {
                        const taxes = calculateTaxes(product.grossValue);
                        if (taxes) {
                          acc.icms += taxes.icmsValue * product.quantity;
                          acc.fcp += taxes.fcpValue * product.quantity;
                          acc.pis += taxes.pisValue * product.quantity;
                          acc.cofins += taxes.cofinsValue * product.quantity;
                          acc.iss += taxes.issValue * product.quantity;
                          acc.fust += taxes.fustValue * product.quantity;
                          acc.funttel += taxes.funttelValue * product.quantity;
                          acc.csll += taxes.csllValue * product.quantity;
                          acc.cbs += taxes.cbsValue * product.quantity;
                          acc.ibsUf += taxes.ibsUfValue * product.quantity;
                        }
                        return acc;
                      }, {
                        icms: 0, fcp: 0, pis: 0, cofins: 0, iss: 0, 
                        fust: 0, funttel: 0, csll: 0, cbs: 0, ibsUf: 0
                      });

                      return (
                        <>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">ICMS</div>
                            <div className="font-bold text-red-600">{formatCurrency(totalTaxes.icms)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">FCP</div>
                            <div className="font-bold text-red-700">{formatCurrency(totalTaxes.fcp)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">PIS</div>
                            <div className="font-bold text-blue-600">{formatCurrency(totalTaxes.pis)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">COFINS</div>
                            <div className="font-bold text-blue-700">{formatCurrency(totalTaxes.cofins)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">FUST</div>
                            <div className="font-bold text-green-600">{formatCurrency(totalTaxes.fust)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">FUNTTEL</div>
                            <div className="font-bold text-green-700">{formatCurrency(totalTaxes.funttel)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">CBS Federal</div>
                            <div className="font-bold text-orange-600">{formatCurrency(totalTaxes.cbs)}</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="text-xs text-gray-600">IBS-UF</div>
                            <div className="font-bold text-yellow-600">{formatCurrency(totalTaxes.ibsUf)}</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {(products.length === 0 || !selectedState) && (
                <div className="text-center py-12">
                  <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Adicione produtos e selecione o estado para gerar os arquivos XML</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelecomBillingSystem;*/
