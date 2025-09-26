import { useMemo } from 'react';
import { calculateTaxes, calculateProductsTaxes } from '../utils/taxCalculations.js';

/**
 * Hook para cálculos de impostos
 * @param {Array} products - Lista de produtos
 * @param {string} selectedState - Estado selecionado
 * @returns {object} Dados calculados de impostos
 */
export const useTaxCalculation = (products, selectedState) => {
  const calculatedData = useMemo(() => {
    if (!products || !selectedState) {
      return {
        totalBill: 0,
        totalNet: 0,
        totalTaxes: 0,
        taxBreakdown: {
          icms: 0, fcp: 0, pis: 0, cofins: 0, iss: 0,
          fust: 0, funttel: 0, csll: 0, cbs: 0, ibsUf: 0
        },
        productsWithTaxes: []
      };
    }

    // Calcula totais
    const totals = calculateProductsTaxes(products, selectedState);

    // Calcula impostos para cada produto individualmente
    const productsWithTaxes = products.map(product => {
      const taxes = calculateTaxes(product.grossValue, selectedState);
      return {
        ...product,
        taxes: taxes || {
          netValue: 0,
          totalTaxes: 0,
          icmsValue: 0,
          fcpValue: 0,
          pisValue: 0,
          cofinsValue: 0,
          issValue: 0,
          fustValue: 0,
          funttelValue: 0,
          csllValue: 0,
          cbsValue: 0,
          ibsUfValue: 0
        }
      };
    });

    // Total da fatura (valor bruto total)
    const totalBill = products.reduce((sum, p) => sum + (p.grossValue * p.quantity), 0);

    return {
      totalBill,
      totalNet: totals.totalNet,
      totalTaxes: totals.totalTaxes,
      taxBreakdown: totals.taxBreakdown,
      productsWithTaxes
    };
  }, [products, selectedState]);

  return calculatedData;
};

/**
 * Hook para cálculo de impostos de um produto específico
 * @param {number} grossValue - Valor bruto do produto
 * @param {string} selectedState - Estado selecionado
 * @returns {object} Dados calculados para o produto
 */
export const useProductTaxCalculation = (grossValue, selectedState) => {
  const taxData = useMemo(() => {
    return calculateTaxes(grossValue, selectedState);
  }, [grossValue, selectedState]);

  return taxData;
};