import { formatDate } from '../utils/formatters.js';
import { companyInfo } from '../utils/constants.js';
import { calculateTaxes } from '../utils/taxCalculations.js';

/**
 * Serviço para geração de documentos XML
 */

/**
 * Gera cabeçalho XML padrão
 */
const generateXMLHeader = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>`;
};

/**
 * Gera identificação do documento NFCom
 */
const generateDocumentIdentification = (customerData) => {
  const now = new Date();
  const uf = customerData?.state || 'SP';
  const municipio = getCodigoMunicipio(uf);

  return `
    <ide>
      <cUF>${getCodigoUF(uf)}</cUF>
      <cNF>${generateRandomNumber(8)}</cNF>
      <natOp>Prestação de Serviços de Comunicação</natOp>
      <mod>62</mod>
      <serie>1</serie>
      <nNF>${generateSequentialNumber()}</nNF>
      <dhEmi>${now.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>${municipio}</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${generateDV()}</cDV>
      <tpAmb>2</tpAmb>
      <finNFCom>1</finNFCom>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
  `;
};

/**
 * Gera dados do emitente
 */
const generateEmitterData = () => {
  return `
    <emit>
      <CNPJ>${companyInfo.cnpj}</CNPJ>
      <xNome>${companyInfo.razaoSocial}</xNome>
      <enderEmit>
        <xLgr>${companyInfo.endereco.logradouro}</xLgr>
        <nro>${companyInfo.endereco.numero}</nro>
        <xBairro>${companyInfo.endereco.bairro}</xBairro>
        <cMun>${companyInfo.endereco.codigoMunicipio}</cMun>
        <xMun>${companyInfo.endereco.municipio}</xMun>
        <UF>${companyInfo.endereco.uf}</UF>
        <CEP>${companyInfo.endereco.cep.replace(/\D/g, '')}</CEP>
      </enderEmit>
      <IE>${companyInfo.inscricaoEstadual}</IE>
    </emit>
  `;
};

/**
 * Gera dados do destinatário
 */
const generateRecipientData = (customerData) => {
  const cpfCnpj = customerData.cpfCnpj?.replace(/\D/g, '') || '';
  const isCpf = cpfCnpj.length === 11;

  return `
    <dest>
      ${isCpf ? `<CPF>${cpfCnpj}</CPF>` : `<CNPJ>${cpfCnpj}</CNPJ>`}
      <xNome>${escapeXML(customerData.name || '')}</xNome>
      <enderDest>
        <xLgr>${escapeXML(customerData.address || '')}</xLgr>
        <xBairro>Centro</xBairro>
        <cMun>${getCodigoMunicipio(customerData.state || 'SP')}</cMun>
        <xMun>${escapeXML(customerData.city || '')}</xMun>
        <UF>${customerData.state || 'SP'}</UF>
        <CEP>${customerData.zipCode?.replace(/\D/g, '') || '00000000'}</CEP>
      </enderDest>
    </dest>
  `;
};

/**
 * Gera detalhes dos produtos/serviços
 */
const generateProductDetails = (products, selectedState) => {
  if (!products?.length) return '';

  return products.map((product, index) => {
    const taxes = calculateTaxes(product.grossValue, selectedState);

    return `
    <det nItem="${index + 1}">
      <prod>
        <cProd>${index + 1}</cProd>
        <xProd>${escapeXML(product.description)}</xProd>
        <CFOP>5303</CFOP>
        <uCom>UN</uCom>
        <qCom>${product.quantity}</qCom>
        <vUnCom>${formatDecimalXML(product.grossValue)}</vUnCom>
        <vProd>${formatDecimalXML(product.grossValue * product.quantity)}</vProd>
      </prod>
      ${generateTaxDetails(taxes, product.quantity)}
    </det>`;
  }).join('');
};

/**
 * Gera detalhes dos impostos para um item
 */
const generateTaxDetails = (taxes, quantity) => {
  if (!taxes) return '';

  return `
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>0</orig>
            <CST>00</CST>
            <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
            <pICMS>${formatDecimalXML(taxes.icmsRate)}</pICMS>
            <vICMS>${formatDecimalXML(taxes.icmsValue * quantity)}</vICMS>
          </ICMS00>
        </ICMS>
        ${taxes.fcpValue > 0 ? `
        <FCP>
          <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
          <pFCP>${formatDecimalXML(taxes.fcpRate)}</pFCP>
          <vFCP>${formatDecimalXML(taxes.fcpValue * quantity)}</vFCP>
        </FCP>` : ''}
        <PIS>
          <PISAliq>
            <CST>01</CST>
            <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
            <pPIS>1.65</pPIS>
            <vPIS>${formatDecimalXML(taxes.pisValue * quantity)}</vPIS>
          </PISAliq>
        </PIS>
        <COFINS>
          <COFINSAliq>
            <CST>01</CST>
            <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
            <pCOFINS>7.60</pCOFINS>
            <vCOFINS>${formatDecimalXML(taxes.cofinsValue * quantity)}</vCOFINS>
          </COFINSAliq>
        </COFINS>
        <FUST>
          <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
          <pFUST>1.00</pFUST>
          <vFUST>${formatDecimalXML(taxes.fustValue * quantity)}</vFUST>
        </FUST>
        <FUNTTEL>
          <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
          <pFUNTTEL>0.50</pFUNTTEL>
          <vFUNTTEL>${formatDecimalXML(taxes.funttelValue * quantity)}</vFUNTTEL>
        </FUNTTEL>
        <CBS>
          <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
          <pCBS>0.90</pCBS>
          <vCBS>${formatDecimalXML(taxes.cbsValue * quantity)}</vCBS>
        </CBS>
        <IBS>
          <vBC>${formatDecimalXML(taxes.netValue * quantity)}</vBC>
          <pIBS>0.10</pIBS>
          <vIBS>${formatDecimalXML(taxes.ibsUfValue * quantity)}</vIBS>
        </IBS>
      </imposto>`;
};

/**
 * Gera totais da NFCom
 */
const generateTotals = (taxCalculations) => {
  if (!taxCalculations) return '';

  return `
    <total>
      <vProd>${formatDecimalXML(taxCalculations.totalNet || 0)}</vProd>
      <vNF>${formatDecimalXML(taxCalculations.totalBill || 0)}</vNF>
      <ICMS>
        <vBC>${formatDecimalXML(taxCalculations.totalNet || 0)}</vBC>
        <vICMS>${formatDecimalXML(taxCalculations.taxBreakdown?.icms || 0)}</vICMS>
      </ICMS>
      <PIS>
        <vPIS>${formatDecimalXML(taxCalculations.taxBreakdown?.pis || 0)}</vPIS>
      </PIS>
      <COFINS>
        <vCOFINS>${formatDecimalXML(taxCalculations.taxBreakdown?.cofins || 0)}</vCOFINS>
      </COFINS>
      <FUST>
        <vFUST>${formatDecimalXML(taxCalculations.taxBreakdown?.fust || 0)}</vFUST>
      </FUST>
      <FUNTTEL>
        <vFUNTTEL>${formatDecimalXML(taxCalculations.taxBreakdown?.funttel || 0)}</vFUNTTEL>
      </FUNTTEL>
      <CBS>
        <vCBS>${formatDecimalXML(taxCalculations.taxBreakdown?.cbs || 0)}</vCBS>
      </CBS>
      <IBS>
        <vIBS>${formatDecimalXML(taxCalculations.taxBreakdown?.ibsUf || 0)}</vIBS>
      </IBS>
    </total>
  `;
};

/**
 * Gera XML completo da NFCom
 */
export const generateNFComXML = (data) => {
  const { products, selectedState, customerData, taxCalculations } = data;

  const xmlContent = `${generateXMLHeader()}
<NFCom xmlns="http://www.portalfiscal.inf.br/nfcom">
  <infNFCom Id="NFCom${generateNFComId()}">
    ${generateDocumentIdentification(customerData)}
    ${generateEmitterData()}
    ${generateRecipientData(customerData)}
    ${generateProductDetails(products, selectedState)}
    ${generateTotals(taxCalculations)}
  </infNFCom>
</NFCom>`;

  return xmlContent;
};

/**
 * Gera XML para SEFAZ (sem alguns detalhes específicos)
 */
export const generateSEFAZXML = (data) => {
  // Para o SEFAZ, removemos alguns campos específicos e simplificamos
  const nfcomXML = generateNFComXML(data);

  // Aqui faria as adaptações necessárias para o SEFAZ
  return nfcomXML;
};

/**
 * Gera RGC (Relatório Gerencial de Cobrança)
 */
export const generateRGC = (data) => {
  const { products, customerData, taxCalculations } = data;
  const now = new Date();

  return `${generateXMLHeader()}
<RGC>
  <cabecalho>
    <dataGeracao>${formatDate(now)}</dataGeracao>
    <empresa>${companyInfo.razaoSocial}</empresa>
    <cnpj>${companyInfo.cnpj}</cnpj>
  </cabecalho>
  <cliente>
    <nome>${escapeXML(customerData?.name || '')}</nome>
    <documento>${customerData?.cpfCnpj || ''}</documento>
    <endereco>${escapeXML(customerData?.address || '')}</endereco>
    <cidade>${escapeXML(customerData?.city || '')}</cidade>
    <uf>${customerData?.state || ''}</uf>
  </cliente>
  <faturamento>
    <valorLiquido>${formatDecimalXML(taxCalculations?.totalNet || 0)}</valorLiquido>
    <valorImpostos>${formatDecimalXML(taxCalculations?.totalTaxes || 0)}</valorImpostos>
    <valorTotal>${formatDecimalXML(taxCalculations?.totalBill || 0)}</valorTotal>
    <itens>
      ${products?.map((product, index) => `
      <item>
        <sequencia>${index + 1}</sequencia>
        <descricao>${escapeXML(product.description)}</descricao>
        <quantidade>${product.quantity}</quantidade>
        <valorUnitario>${formatDecimalXML(product.grossValue)}</valorUnitario>
        <valorTotal>${formatDecimalXML(product.grossValue * product.quantity)}</valorTotal>
      </item>`).join('') || ''}
    </itens>
  </faturamento>
</RGC>`;
};

// Funções auxiliares

/**
 * Escapa caracteres especiais para XML
 */
const escapeXML = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Formata número decimal para XML
 */
const formatDecimalXML = (value) => {
  if (typeof value !== 'number') return '0.00';
  return value.toFixed(2);
};

/**
 * Gera número aleatório
 */
const generateRandomNumber = (length) => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

/**
 * Gera número sequencial (simulado)
 */
const generateSequentialNumber = () => {
  return Math.floor(Math.random() * 999999) + 1;
};

/**
 * Gera dígito verificador (simulado)
 */
const generateDV = () => {
  return Math.floor(Math.random() * 10);
};

/**
 * Gera ID da NFCom
 */
const generateNFComId = () => {
  const uf = '35'; // SP por padrão
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const cnpj = companyInfo.cnpj.replace(/\D/g, '');
  const sequence = generateRandomNumber(9);

  return `${uf}${year}${month}${cnpj}550010000000011${sequence}`;
};

/**
 * Obtém código da UF
 */
const getCodigoUF = (uf) => {
  const codigos = {
    'AC': '12', 'AL': '17', 'AP': '16', 'AM': '23', 'BA': '29', 'CE': '23',
    'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21', 'MT': '51', 'MS': '50',
    'MG': '31', 'PA': '15', 'PB': '25', 'PR': '41', 'PE': '26', 'PI': '22',
    'RJ': '33', 'RN': '24', 'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42',
    'SP': '35', 'SE': '28', 'TO': '17'
  };
  return codigos[uf] || '35';
};

/**
 * Obtém código do município (simulado)
 */
const getCodigoMunicipio = (uf) => {
  // Em produção, isso seria uma consulta real à tabela do IBGE
  const principais = {
    'SP': '3550308', // São Paulo
    'RJ': '3304557', // Rio de Janeiro
    'MG': '3106200', // Belo Horizonte
    'RS': '4314902', // Porto Alegre
    'PR': '4106902', // Curitiba
    'SC': '4205407'  // Florianópolis
  };
  return principais[uf] || '3550308';
};