import { icmsRates, fcpRates, taxRates } from './constants.js';

/**
 * Calcula todos os impostos baseado no valor bruto e estado
 * @param {number} grossValue - Valor bruto com impostos
 * @param {string} selectedState - Estado para cálculo do ICMS/FCP
 * @returns {object} Objeto com todos os valores calculados
 */
export const calculateTaxes = (grossValue, selectedState) => {
  if (!selectedState || !grossValue) return null;

  const icmsRate = icmsRates[selectedState] || 18;
  const fcpRate = fcpRates[selectedState] || 0;

  // Soma de todas as alíquotas
  const totalTaxRate = icmsRate + fcpRate +
    taxRates.pis + taxRates.cofins + taxRates.iss +
    taxRates.fust + taxRates.funttel + taxRates.csll +
    taxRates.cbs + taxRates.ibsUf;

  // Cálculo reverso - valor já vem com impostos
  const netValue = grossValue / (1 + (totalTaxRate / 100));

  // Cálculo de cada imposto
  const icmsValue = netValue * icmsRate / 100;
  const fcpValue = netValue * fcpRate / 100;
  const pisValue = netValue * taxRates.pis / 100;
  const cofinsValue = netValue * taxRates.cofins / 100;
  const issValue = netValue * taxRates.iss / 100;
  const fustValue = netValue * taxRates.fust / 100;
  const funttelValue = netValue * taxRates.funttel / 100;
  const csllValue = netValue * taxRates.csll / 100;
  const cbsValue = netValue * taxRates.cbs / 100;
  const ibsUfValue = netValue * taxRates.ibsUf / 100;

  const totalTaxes = icmsValue + fcpValue + pisValue + cofinsValue +
    issValue + fustValue + funttelValue + csllValue + cbsValue + ibsUfValue;

  return {
    netValue: parseFloat(netValue.toFixed(2)),
    icmsValue: parseFloat(icmsValue.toFixed(2)),
    fcpValue: parseFloat(fcpValue.toFixed(2)),
    pisValue: parseFloat(pisValue.toFixed(2)),
    cofinsValue: parseFloat(cofinsValue.toFixed(2)),
    issValue: parseFloat(issValue.toFixed(2)),
    fustValue: parseFloat(fustValue.toFixed(2)),
    funttelValue: parseFloat(funttelValue.toFixed(2)),
    csllValue: parseFloat(csllValue.toFixed(2)),
    cbsValue: parseFloat(cbsValue.toFixed(2)),
    ibsUfValue: parseFloat(ibsUfValue.toFixed(2)),
    totalTaxes: parseFloat(totalTaxes.toFixed(2)),
    icmsRate,
    fcpRate,
    totalTaxRate: parseFloat(totalTaxRate.toFixed(2))
  };
};

/**
 * Calcula o total de impostos para uma lista de produtos
 * @param {Array} products - Array de produtos
 * @param {string} selectedState - Estado para cálculo
 * @returns {object} Totais consolidados
 */
export const calculateProductsTaxes = (products, selectedState) => {
  if (!products || products.length === 0 || !selectedState) {
    return {
      totalGross: 0,
      totalNet: 0,
      totalTaxes: 0,
      taxBreakdown: {
        icms: 0, fcp: 0, pis: 0, cofins: 0, iss: 0,
        fust: 0, funttel: 0, csll: 0, cbs: 0, ibsUf: 0
      }
    };
  }

  return products.reduce((acc, product) => {
    const taxes = calculateTaxes(product.grossValue, selectedState);
    if (taxes) {
      const productTotal = product.grossValue * product.quantity;
      acc.totalGross += productTotal;
      acc.totalNet += taxes.netValue * product.quantity;
      acc.totalTaxes += taxes.totalTaxes * product.quantity;

      // Breakdown por tipo de imposto
      acc.taxBreakdown.icms += taxes.icmsValue * product.quantity;
      acc.taxBreakdown.fcp += taxes.fcpValue * product.quantity;
      acc.taxBreakdown.pis += taxes.pisValue * product.quantity;
      acc.taxBreakdown.cofins += taxes.cofinsValue * product.quantity;
      acc.taxBreakdown.iss += taxes.issValue * product.quantity;
      acc.taxBreakdown.fust += taxes.fustValue * product.quantity;
      acc.taxBreakdown.funttel += taxes.funttelValue * product.quantity;
      acc.taxBreakdown.csll += taxes.csllValue * product.quantity;
      acc.taxBreakdown.cbs += taxes.cbsValue * product.quantity;
      acc.taxBreakdown.ibsUf += taxes.ibsUfValue * product.quantity;
    }
    return acc;
  }, {
    totalGross: 0,
    totalNet: 0,
    totalTaxes: 0,
    taxBreakdown: {
      icms: 0, fcp: 0, pis: 0, cofins: 0, iss: 0,
      fust: 0, funttel: 0, csll: 0, cbs: 0, ibsUf: 0
    }
  });
};

/**
 * Calcula apenas o ICMS (para NF ICMS antiga)
 * @param {number} netValue - Valor líquido
 * @param {string} selectedState - Estado
 * @returns {object} Cálculo do ICMS
 */
export const calculateICMSOnly = (netValue, selectedState) => {
  if (!selectedState || !netValue) return null;

  const icmsRate = icmsRates[selectedState] || 18;
  const fcpRate = fcpRates[selectedState] || 0;

  const icmsValue = netValue * icmsRate / 100;
  const fcpValue = netValue * fcpRate / 100;

  return {
    baseCalculation: netValue,
    icmsRate,
    icmsValue: parseFloat(icmsValue.toFixed(2)),
    fcpRate,
    fcpValue: parseFloat(fcpValue.toFixed(2)),
    totalICMS: parseFloat((icmsValue + fcpValue).toFixed(2))
  };
};

/**
 * Calcula apenas impostos federais (PIS/COFINS/CSLL)
 * @param {number} netValue - Valor líquido
 * @returns {object} Cálculo dos impostos federais
 */
export const calculateFederalTaxes = (netValue) => {
  if (!netValue) return null;

  const pisValue = netValue * taxRates.pis / 100;
  const cofinsValue = netValue * taxRates.cofins / 100;
  const csllValue = netValue * taxRates.csll / 100;

  return {
    baseCalculation: netValue,
    pis: {
      rate: taxRates.pis,
      value: parseFloat(pisValue.toFixed(2))
    },
    cofins: {
      rate: taxRates.cofins,
      value: parseFloat(cofinsValue.toFixed(2))
    },
    csll: {
      rate: taxRates.csll,
      value: parseFloat(csllValue.toFixed(2))
    },
    totalFederal: parseFloat((pisValue + cofinsValue + csllValue).toFixed(2))
  };
};

/**
 * Calcula impostos específicos de telecom (FUST/FUNTTEL)
 * @param {number} netValue - Valor líquido
 * @returns {object} Cálculo dos impostos de telecom
 */
export const calculateTelecomTaxes = (netValue) => {
  if (!netValue) return null;

  const fustValue = netValue * taxRates.fust / 100;
  const funttelValue = netValue * taxRates.funttel / 100;

  return {
    baseCalculation: netValue,
    fust: {
      rate: taxRates.fust,
      value: parseFloat(fustValue.toFixed(2))
    },
    funttel: {
      rate: taxRates.funttel,
      value: parseFloat(funttelValue.toFixed(2))
    },
    totalTelecom: parseFloat((fustValue + funttelValue).toFixed(2))
  };
};

/**
 * Calcula novos impostos da reforma tributária (CBS/IBS)
 * @param {number} netValue - Valor líquido
 * @returns {object} Cálculo dos novos impostos
 */
export const calculateReformTaxes = (netValue) => {
  if (!netValue) return null;

  const cbsValue = netValue * taxRates.cbs / 100;
  const ibsUfValue = netValue * taxRates.ibsUf / 100;

  return {
    baseCalculation: netValue,
    cbs: {
      rate: taxRates.cbs,
      value: parseFloat(cbsValue.toFixed(2))
    },
    ibsUf: {
      rate: taxRates.ibsUf,
      value: parseFloat(ibsUfValue.toFixed(2))
    },
    totalReform: parseFloat((cbsValue + ibsUfValue).toFixed(2))
  };
};

/**
 * Calcula apenas ISS para NF de Serviços
 * @param {number} netValue - Valor líquido
 * @returns {object} Cálculo do ISS
 */
export const calculateISSOnly = (netValue) => {
  if (!netValue) return null;

  const issValue = netValue * taxRates.iss / 100;

  return {
    baseCalculation: netValue,
    issRate: taxRates.iss,
    issValue: parseFloat(issValue.toFixed(2))
  };
};