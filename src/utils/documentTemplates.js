import {
  generateDocumentHTML,
  generateCustomerSection,
  generateProductsTable,
  generateTotalsSection,
  generateTaxBreakdown
} from '../services/pdfGenerator.js';
import { generateNFComXML, generateSEFAZXML, generateRGC } from '../services/xmlGenerator.js';
import { formatCurrency, formatDate } from './formatters.js';

/**
 * Templates para geração de documentos
 */

/**
 * Template para Fatura Resumo
 */
export const generateFaturaResumo = (data) => {
  const { products, customerData, taxCalculations } = data;

  const content = `
    ${generateCustomerSection(customerData)}

    <div class="billing-period">
      <h3>Período de Cobrança</h3>
      <p><strong>Competência:</strong> ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
      <p><strong>Vencimento:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</p>
    </div>

    <div class="services-summary">
      <h3>Resumo dos Serviços</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          ${generateServicesSummary(products)}
        </tbody>
      </table>
    </div>

    ${generateTotalsSection(taxCalculations)}

    <div class="payment-info">
      <h3>Informações de Pagamento</h3>
      <div class="payment-grid">
        <div class="payment-method">
          <h4>Débito Automático</h4>
          <p>Entre em contato para ativar</p>
        </div>
        <div class="payment-method">
          <h4>PIX</h4>
          <p>Escaneie o QR Code no boleto</p>
        </div>
        <div class="payment-method">
          <h4>Boleto Bancário</h4>
          <p>Disponível em anexo</p>
        </div>
      </div>
    </div>

    <div class="contact-info">
      <h3>Atendimento ao Cliente</h3>
      <p><strong>Central de Atendimento:</strong> 1052 (para capital) | 10621 (para interior)</p>
      <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
      <p><strong>Site:</strong> www.claro.com.br</p>
    </div>
  `;

  return generateDocumentHTML(content, 'Fatura Resumo - Claro');
};

/**
 * Template para Fatura Detalhada
 */
export const generateFaturaDetalhada = (data) => {
  const { products, customerData, taxCalculations } = data;

  const content = `
    ${generateCustomerSection(customerData)}

    <div class="detailed-usage">
      <h3>Detalhamento de Uso</h3>
      ${generateDetailedUsage(products)}
    </div>

    ${generateProductsTable(products, taxCalculations, true)}
    ${generateTaxBreakdown(taxCalculations)}
    ${generateTotalsSection(taxCalculations)}

    <div class="usage-charts">
      <h3>Histórico de Consumo</h3>
      ${generateUsageCharts()}
    </div>

    <div class="legal-notices">
      <h3>Informações Legais</h3>
      <p><strong>Marco Legal:</strong> Esta fatura está de acordo com a Lei Geral de Telecomunicações e regulamentações da ANATEL.</p>
      <p><strong>Tributos:</strong> Os impostos estão destacados conforme legislação tributária vigente.</p>
      <p><strong>SAC:</strong> 1052 - Atendimento gratuito de segunda a domingo, 24h.</p>
    </div>
  `;

  return generateDocumentHTML(content, 'Fatura Detalhada - Claro');
};

/**
 * Template para NF ICMS Antiga (tradicional)
 */
export const generateNFICMSAntiga = (data) => {
  const { products, customerData, taxCalculations } = data;

  const content = `
    <div class="nf-header">
      <div class="nf-title">
        <h1>NOTA FISCAL DE SERVIÇOS DE COMUNICAÇÃO</h1>
        <p>Série: 001 | Número: ${generateNFNumber()}</p>
      </div>
    </div>

    ${generateCustomerSection(customerData)}

    <div class="nf-services">
      <h3>Discriminação dos Serviços</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Valor Total</th>
            <th>Alíq. ICMS</th>
            <th>Valor ICMS</th>
          </tr>
        </thead>
        <tbody>
          ${generateNFItems(products, taxCalculations)}
        </tbody>
      </table>
    </div>

    <div class="icms-details">
      <h3>Cálculo do ICMS</h3>
      <div class="tax-grid">
        <div class="tax-item">
          <span>Base de Cálculo ICMS:</span>
          <span>${formatCurrency(taxCalculations?.totalNet || 0)}</span>
        </div>
        <div class="tax-item">
          <span>Valor do ICMS:</span>
          <span>${formatCurrency(taxCalculations?.taxBreakdown?.icms || 0)}</span>
        </div>
        ${taxCalculations?.taxBreakdown?.fcp > 0 ? `
        <div class="tax-item">
          <span>Valor do FCP:</span>
          <span>${formatCurrency(taxCalculations.taxBreakdown.fcp)}</span>
        </div>
        ` : ''}
      </div>
    </div>

    ${generateTotalsSection(taxCalculations)}

    <div class="nf-observations">
      <h3>Observações</h3>
      <p>Documento fiscal emitido nos termos da legislação vigente.</p>
      <p>ICMS recolhido conforme regime de apuração.</p>
      <p>Prestação de serviços de telecomunicações sujeita à regulamentação da ANATEL.</p>
    </div>
  `;

  return generateDocumentHTML(content, 'Nota Fiscal ICMS - Claro');
};

/**
 * Template para NF de ISS
 */
export const generateNFISS = (data) => {
  const { products, customerData, taxCalculations } = data;

  const content = `
    <div class="nf-header">
      <div class="nf-title">
        <h1>NOTA FISCAL DE SERVIÇOS</h1>
        <p>Série: RPS | Número: ${generateRPSNumber()}</p>
      </div>
    </div>

    ${generateCustomerSection(customerData)}

    <div class="service-description">
      <h3>Descrição dos Serviços</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Total</th>
            <th>ISS</th>
          </tr>
        </thead>
        <tbody>
          ${generateISSItems(products, taxCalculations)}
        </tbody>
      </table>
    </div>

    <div class="iss-calculation">
      <h3>Cálculo do ISS</h3>
      <div class="tax-grid">
        <div class="tax-item">
          <span>Base de Cálculo ISS:</span>
          <span>${formatCurrency(taxCalculations?.totalNet || 0)}</span>
        </div>
        <div class="tax-item">
          <span>Alíquota ISS:</span>
          <span>5,00%</span>
        </div>
        <div class="tax-item">
          <span>Valor ISS:</span>
          <span>${formatCurrency(taxCalculations?.taxBreakdown?.iss || 0)}</span>
        </div>
      </div>
    </div>

    <div class="municipality-info">
      <h3>Informações Municipais</h3>
      <p><strong>Município de Prestação:</strong> ${customerData?.city || 'São Paulo'}</p>
      <p><strong>Código de Serviço:</strong> 06.04 - Telecomunicações</p>
      <p><strong>Item Lista Serviços:</strong> Serviços de telecomunicações</p>
    </div>

    ${generateTotalsSection(taxCalculations)}
  `;

  return generateDocumentHTML(content, 'Nota Fiscal ISS - Claro');
};

/**
 * Template para Histórico de Consumo
 */
export const generateHistoricoConsumo = (data) => {
  const { consumptionHistory = [] } = data;

  const content = `
    <div class="history-overview">
      <h3>Resumo do Período</h3>
      <div class="period-stats">
        <div class="stat-item">
          <span>Período Analisado:</span>
          <span>Últimos 6 meses</span>
        </div>
        <div class="stat-item">
          <span>Data de Geração:</span>
          <span>${formatDate(new Date())}</span>
        </div>
      </div>
    </div>

    <div class="consumption-table">
      <h3>Histórico Detalhado</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Mês/Ano</th>
            <th>Minutos de Voz</th>
            <th>Dados (GB)</th>
            <th>Valor da Fatura</th>
            <th>Variação (%)</th>
          </tr>
        </thead>
        <tbody>
          ${generateHistoryRows(consumptionHistory)}
        </tbody>
      </table>
    </div>

    <div class="consumption-analysis">
      <h3>Análise de Consumo</h3>
      ${generateConsumptionAnalysis(consumptionHistory)}
    </div>

    <div class="recommendations">
      <h3>Recomendações</h3>
      ${generateRecommendations(consumptionHistory)}
    </div>
  `;

  return generateDocumentHTML(content, 'Histórico de Consumo - Claro');
};

// Funções auxiliares para geração de conteúdo específico

const generateServicesSummary = (products) => {
  const summary = {};

  products?.forEach(product => {
    const type = product.type;
    if (!summary[type]) {
      summary[type] = { count: 0, total: 0 };
    }
    summary[type].count += product.quantity;
    summary[type].total += product.grossValue * product.quantity;
  });

  return Object.entries(summary).map(([type, data]) => {
    const typeLabels = {
      voice: 'Serviços de Voz',
      internet: 'Banda Larga',
      streaming: 'Streaming',
      sms: 'Mensagens SMS',
      roaming: 'Roaming'
    };

    return `
      <tr>
        <td>${typeLabels[type] || type}</td>
        <td>${data.count}</td>
        <td class="text-right">${formatCurrency(data.total)}</td>
      </tr>
    `;
  }).join('');
};

const generateDetailedUsage = (products) => {
  return `
    <div class="usage-details">
      ${products?.map(product => `
        <div class="usage-item">
          <h4>${product.description}</h4>
          <div class="usage-stats">
            <span>Quantidade utilizada: ${product.quantity}</span>
            <span>Valor: ${formatCurrency(product.grossValue * product.quantity)}</span>
          </div>
        </div>
      `).join('') || ''}
    </div>
  `;
};

const generateUsageCharts = () => {
  return `
    <div class="chart-placeholder">
      <p>📊 Gráfico de evolução do consumo nos últimos 6 meses</p>
      <p><em>Em uma implementação completa, aqui seria renderizado um gráfico interativo</em></p>
    </div>
  `;
};

const generateNFItems = (products, taxCalculations) => {
  return products?.map((product, index) => {
    const productWithTaxes = taxCalculations?.productsWithTaxes?.find(p => p.id === product.id);
    const taxes = productWithTaxes?.taxes;

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.description}</td>
        <td class="text-center">${product.quantity}</td>
        <td class="text-right">${formatCurrency(product.grossValue)}</td>
        <td class="text-right">${formatCurrency(product.grossValue * product.quantity)}</td>
        <td class="text-center">${taxes?.icmsRate || 18}%</td>
        <td class="text-right">${formatCurrency((taxes?.icmsValue || 0) * product.quantity)}</td>
      </tr>
    `;
  }).join('') || '';
};

const generateISSItems = (products, taxCalculations) => {
  return products?.map((product, index) => {
    const productWithTaxes = taxCalculations?.productsWithTaxes?.find(p => p.id === product.id);
    const taxes = productWithTaxes?.taxes;

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.description}</td>
        <td class="text-center">${product.quantity}</td>
        <td class="text-right">${formatCurrency(product.grossValue * product.quantity)}</td>
        <td class="text-right">${formatCurrency((taxes?.issValue || 0) * product.quantity)}</td>
      </tr>
    `;
  }).join('') || '';
};

const generateHistoryRows = (consumptionHistory) => {
  return consumptionHistory?.map((record, index) => {
    const previousRecord = consumptionHistory[index + 1];
    const variation = previousRecord
      ? ((record.value - previousRecord.value) / previousRecord.value * 100)
      : 0;

    return `
      <tr>
        <td>${record.month}</td>
        <td class="text-center">${record.voice} min</td>
        <td class="text-center">${record.data} GB</td>
        <td class="text-right">${formatCurrency(record.value)}</td>
        <td class="text-center ${variation > 0 ? 'text-red' : 'text-green'}">
          ${index === 0 ? '-' : `${variation > 0 ? '+' : ''}${variation.toFixed(1)}%`}
        </td>
      </tr>
    `;
  }).join('') || '';
};

const generateConsumptionAnalysis = (consumptionHistory) => {
  if (!consumptionHistory?.length) return '<p>Dados não disponíveis</p>';

  const avgVoice = Math.round(consumptionHistory.reduce((sum, r) => sum + r.voice, 0) / consumptionHistory.length);
  const avgData = (consumptionHistory.reduce((sum, r) => sum + r.data, 0) / consumptionHistory.length).toFixed(1);
  const avgBill = consumptionHistory.reduce((sum, r) => sum + r.value, 0) / consumptionHistory.length;

  return `
    <div class="analysis-grid">
      <div class="analysis-item">
        <h4>Média de Voz</h4>
        <p>${avgVoice} minutos/mês</p>
      </div>
      <div class="analysis-item">
        <h4>Média de Dados</h4>
        <p>${avgData} GB/mês</p>
      </div>
      <div class="analysis-item">
        <h4>Média de Fatura</h4>
        <p>${formatCurrency(avgBill)}</p>
      </div>
    </div>
  `;
};

const generateRecommendations = (consumptionHistory) => {
  return `
    <div class="recommendations-list">
      <div class="recommendation">
        <h4>📱 Otimização de Plano</h4>
        <p>Baseado no seu histórico, considere ajustar seu plano para melhor aproveitamento.</p>
      </div>
      <div class="recommendation">
        <h4>💡 Economia</h4>
        <p>Monitore picos de consumo para identificar oportunidades de economia.</p>
      </div>
      <div class="recommendation">
        <h4>🔄 Revisão Periódica</h4>
        <p>Recomendamos revisar seu plano a cada 6 meses conforme seu padrão de uso.</p>
      </div>
    </div>
  `;
};

// Funções para números de documentos

const generateNFNumber = () => {
  return Math.floor(Math.random() * 999999) + 1;
};

const generateRPSNumber = () => {
  return Math.floor(Math.random() * 999999) + 1;
};

// Exportar templates XML também
export {
  generateNFComXML,
  generateSEFAZXML,
  generateRGC
};