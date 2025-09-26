import { useState, useCallback } from 'react';
import { generateId, parseDecimal } from '../utils/formatters.js';

/**
 * Hook para gerenciamento de produtos
 * @returns {object} Estados e funções para gerenciar produtos
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    type: 'voice',
    description: '',
    grossValue: '',
    quantity: 1
  });

  // Adicionar produto à lista
  const addProduct = useCallback(() => {
    if (!currentProduct.description || !currentProduct.grossValue) {
      return { success: false, error: 'Descrição e valor são obrigatórios' };
    }

    try {
      const grossValue = parseDecimal(currentProduct.grossValue);

      if (isNaN(grossValue) || grossValue <= 0) {
        return { success: false, error: 'Valor deve ser um número positivo' };
      }

      if (currentProduct.quantity <= 0) {
        return { success: false, error: 'Quantidade deve ser maior que zero' };
      }

      const newProduct = {
        id: generateId(),
        ...currentProduct,
        grossValue,
        quantity: parseInt(currentProduct.quantity) || 1
      };

      setProducts(prev => [...prev, newProduct]);

      // Reset form
      setCurrentProduct({
        type: 'voice',
        description: '',
        grossValue: '',
        quantity: 1
      });

      return { success: true, product: newProduct };
    } catch (error) {
      return { success: false, error: 'Erro ao adicionar produto' };
    }
  }, [currentProduct]);

  // Remover produto
  const removeProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Editar produto
  const editProduct = useCallback((id, updatedProduct) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...updatedProduct, grossValue: parseDecimal(updatedProduct.grossValue) }
          : p
      )
    );
  }, []);

  // Limpar todos os produtos
  const clearProducts = useCallback(() => {
    setProducts([]);
  }, []);

  // Atualizar produto atual (formulário)
  const updateCurrentProduct = useCallback((updates) => {
    setCurrentProduct(prev => ({ ...prev, ...updates }));
  }, []);

  // Carregar produto pré-definido
  const loadPredefinedProduct = useCallback((productData) => {
    setCurrentProduct(prev => ({
      ...prev,
      description: productData.description,
      grossValue: productData.grossValue.toString().replace('.', ',')
    }));
  }, []);

  // Duplicar produto
  const duplicateProduct = useCallback((product) => {
    const duplicated = {
      ...product,
      id: generateId(),
      description: `${product.description} (Cópia)`
    };
    setProducts(prev => [...prev, duplicated]);
  }, []);

  // Validar se pode adicionar produto
  const canAddProduct = currentProduct.description && currentProduct.grossValue;

  // Calcular total de produtos
  const totalProducts = products.length;

  // Calcular total bruto
  const totalGrossValue = products.reduce((sum, p) => sum + (p.grossValue * p.quantity), 0);

  return {
    // Estados
    products,
    currentProduct,

    // Funções
    addProduct,
    removeProduct,
    editProduct,
    clearProducts,
    updateCurrentProduct,
    loadPredefinedProduct,
    duplicateProduct,

    // Estados computados
    canAddProduct,
    totalProducts,
    totalGrossValue,

    // Estado setter direto (para casos especiais)
    setProducts,
    setCurrentProduct
  };
};