import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters.js';
import { companyInfo } from '../utils/constants.js';

/**
 * Serviço para geração de documentos PDF
 *
 * Este serviço simula a geração de PDFs utilizando HTML/CSS
 * Em produção, seria integrado com bibliotecas como jsPDF, Puppeteer ou similar
 */

/**
 * Gera cabeçalho padrão para documentos
 */
const generateDocumentHeader = (title, subtitle = '') => {
  return `
    <div class="document-header">
      <div class="company-logo">
        <div class="logo-circle">C</div>
        <div class="company-info">
          <h1>${companyInfo.razaoSocial}</h1>
          <p>CNPJ: ${companyInfo.cnpj}</p>
          <p>${companyInfo.endereco.logradouro}, ${companyInfo.endereco.numero} - ${companyInfo.endereco.bairro}</p>
          <p>${companyInfo.endereco.municipio}/${companyInfo.endereco.uf} - CEP: ${companyInfo.endereco.cep}</p>
        </div>
      </div>
      <div class="document-title">
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
        <p class="generation-date">Gerado em: ${formatDateTime(new Date())}</p>
      </div>
    </div>
  `;
};

/**
 * Gera rodapé padrão para documentos
 */
const generateDocumentFooter = (pageNumber = 1, totalPages = 1) => {
  return `
    <div class="document-footer">
      <div class="footer-content">
        <p>Sistema de Faturamento Telecom - ${companyInfo.nomeFantasia}</p>
        <p>Telefone: ${companyInfo.telefone} | Email: ${companyInfo.email}</p>
      </div>
      <div class="page-number">
        Página ${pageNumber} de ${totalPages}
      </div>
    </div>
  `;
};

/**
 * Gera seção de dados do cliente
 */
const generateCustomerSection = (customerData) => {
  if (!customerData?.name) return '';

  return `
    <div class="customer-section">
      <h3>Dados do Cliente</h3>
      <div class="customer-grid">
        <div class="customer-item">
          <strong>Nome:</strong> ${customerData.name}
        </div>
        <div class="customer-item">
          <strong>CPF/CNPJ:</strong> ${customerData.cpfCnpj}
        </div>
        <div class="customer-item">
          <strong>Telefone:</strong> ${customerData.phone}
        </div>
        <div class="customer-item">
          <strong>Endereço:</strong> ${customerData.address}
        </div>
        <div class="customer-item">
          <strong>Cidade/UF:</strong> ${customerData.city}/${customerData.state}
        </div>
        <div class="customer-item">
          <strong>CEP:</strong> ${customerData.zipCode}
        </div>
      </div>
    </div>
  `;
};

/**
 * Gera tabela de produtos/serviços
 */
const generateProductsTable = (products, taxCalculations, showTaxDetails = false) => {
  if (!products?.length) return '';

  const productsWithTaxes = taxCalculations?.productsWithTaxes || products;

  const tableRows = products.map((product, index) => {
    const productWithTaxes = productsWithTaxes.find(p => p.id === product.id);
    const taxes = productWithTaxes?.taxes;

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.description}</td>
        <td class="text-center">${product.quantity}</td>
        <td class="text-right">${formatCurrency(product.grossValue)}</td>
        <td class="text-right">${formatCurrency(product.grossValue * product.quantity)}</td>
        ${showTaxDetails && taxes ? `
          <td class="text-right">${formatCurrency(taxes.netValue * product.quantity)}</td>
          <td class="text-right">${formatCurrency(taxes.totalTaxes * product.quantity)}</td>
        ` : ''}
      </tr>
    `;
  }).join('');

  return `
    <div class="products-section">
      <h3>Produtos e Serviços</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Total</th>
            ${showTaxDetails ? '<th>Líquido</th><th>Impostos</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
  `;
};

/**
 * Gera seção de totais
 */
const generateTotalsSection = (taxCalculations) => {
  if (!taxCalculations) return '';

  return `
    <div class="totals-section">
      <div class="totals-grid">
        <div class="total-item">
          <span>Valor Líquido:</span>
          <span>${formatCurrency(taxCalculations.totalNet || 0)}</span>
        </div>
        <div class="total-item">
          <span>Total de Impostos:</span>
          <span>${formatCurrency(taxCalculations.totalTaxes || 0)}</span>
        </div>
        <div class="total-item total-final">
          <span>TOTAL GERAL:</span>
          <span>${formatCurrency(taxCalculations.totalBill || 0)}</span>
        </div>
      </div>
    </div>
  `;
};

/**
 * Gera detalhamento de impostos
 */
const generateTaxBreakdown = (taxCalculations) => {
  if (!taxCalculations?.taxBreakdown) return '';

  const breakdown = taxCalculations.taxBreakdown;

  return `
    <div class="tax-breakdown">
      <h3>Detalhamento dos Impostos</h3>
      <div class="tax-grid">
        <div class="tax-item">
          <span>ICMS:</span>
          <span>${formatCurrency(breakdown.icms || 0)}</span>
        </div>
        <div class="tax-item">
          <span>FCP:</span>
          <span>${formatCurrency(breakdown.fcp || 0)}</span>
        </div>
        <div class="tax-item">
          <span>PIS:</span>
          <span>${formatCurrency(breakdown.pis || 0)}</span>
        </div>
        <div class="tax-item">
          <span>COFINS:</span>
          <span>${formatCurrency(breakdown.cofins || 0)}</span>
        </div>
        <div class="tax-item">
          <span>ISS:</span>
          <span>${formatCurrency(breakdown.iss || 0)}</span>
        </div>
        <div class="tax-item">
          <span>FUST:</span>
          <span>${formatCurrency(breakdown.fust || 0)}</span>
        </div>
        <div class="tax-item">
          <span>FUNTTEL:</span>
          <span>${formatCurrency(breakdown.funttel || 0)}</span>
        </div>
        <div class="tax-item">
          <span>CSLL:</span>
          <span>${formatCurrency(breakdown.csll || 0)}</span>
        </div>
        <div class="tax-item">
          <span>CBS:</span>
          <span>${formatCurrency(breakdown.cbs || 0)}</span>
        </div>
        <div class="tax-item">
          <span>IBS-UF:</span>
          <span>${formatCurrency(breakdown.ibsUf || 0)}</span>
        </div>
      </div>
    </div>
  `;
};

/**
 * Gera CSS básico para documentos
 */
const generateDocumentCSS = () => {
  return `
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        margin: 0;
        padding: 20px;
        color: #333;
      }

      .document-header {
        border-bottom: 2px solid #dc2626;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      .company-logo {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .logo-circle {
        width: 60px;
        height: 60px;
        background: #dc2626;
        color: white;
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        margin-right: 20px;
      }

      .company-info h1 {
        margin: 0 0 5px 0;
        font-size: 18px;
        color: #dc2626;
      }

      .company-info p {
        margin: 2px 0;
        font-size: 10px;
        color: #666;
      }

      .document-title {
        text-align: center;
      }

      .document-title h2 {
        margin: 0 0 10px 0;
        font-size: 20px;
        color: #dc2626;
      }

      .generation-date {
        font-size: 10px;
        color: #666;
      }

      .customer-section, .products-section, .totals-section, .tax-breakdown {
        margin: 30px 0;
      }

      .customer-section h3, .products-section h3, .tax-breakdown h3 {
        background: #f3f4f6;
        padding: 10px;
        margin: 0 0 15px 0;
        border-left: 4px solid #dc2626;
        font-size: 14px;
      }

      .customer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .customer-item {
        padding: 8px;
        background: #f9f9f9;
        border-radius: 4px;
      }

      .products-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .products-table th,
      .products-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      .products-table th {
        background: #f3f4f6;
        font-weight: bold;
        font-size: 11px;
      }

      .products-table td {
        font-size: 11px;
      }

      .text-center { text-align: center; }
      .text-right { text-align: right; }

      .totals-section {
        background: #fef2f2;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #dc2626;
      }

      .totals-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .total-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #fecaca;
      }

      .total-final {
        font-weight: bold;
        font-size: 14px;
        color: #dc2626;
        border-bottom: 2px solid #dc2626;
        padding-top: 15px;
      }

      .tax-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .tax-item {
        display: flex;
        justify-content: space-between;
        padding: 6px;
        background: #f9f9f9;
        border-radius: 4px;
        font-size: 11px;
      }

      .document-footer {
        border-top: 1px solid #ddd;
        padding-top: 20px;
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        color: #666;
      }

      .page-number {
        font-weight: bold;
      }

      @media print {
        body { margin: 0; padding: 15px; }
        .page-break { page-break-before: always; }
      }
    </style>
  `;
};

/**
 * Função principal para gerar HTML de documento
 */
export const generateDocumentHTML = (content, title, options = {}) => {
  const {
    showHeader = true,
    showFooter = true,
    pageNumber = 1,
    totalPages = 1
  } = options;

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      ${generateDocumentCSS()}
    </head>
    <body>
      ${showHeader ? generateDocumentHeader(title) : ''}
      ${content}
      ${showFooter ? generateDocumentFooter(pageNumber, totalPages) : ''}
    </body>
    </html>
  `;
};

// Exportar todas as funções de geração
export {
  generateDocumentHeader,
  generateDocumentFooter,
  generateCustomerSection,
  generateProductsTable,
  generateTotalsSection,
  generateTaxBreakdown,
  generateDocumentCSS
};