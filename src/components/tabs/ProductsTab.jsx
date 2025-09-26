import ProductForm from '../forms/ProductForm.jsx';
import ProductList from '../forms/ProductList.jsx';
import { estados } from '../../utils/constants.js';

/**
 * Componente da aba de produtos
 */
const ProductsTab = ({
  // Estados dos produtos
  products,
  currentProduct,
  selectedState,
  onStateChange,

  // Funções de produtos
  onProductChange,
  onAddProduct,
  onRemoveProduct,
  onDuplicateProduct,
  onEditProduct,

  // Estados computados
  canAddProduct,

  // Cálculos de impostos
  taxCalculations
}) => {
  return (
  <div className="grid lg:grid-cols-2 gap-8">
      {/* Formulário de Adição */}
      <ProductForm
        currentProduct={currentProduct}
        onProductChange={onProductChange}
        onAddProduct={onAddProduct}
        selectedState={selectedState}
        canAddProduct={canAddProduct}
        onStateChange={onStateChange}
      />

      {/* Lista de Produtos */}
      <ProductList
        products={products}
        onRemoveProduct={onRemoveProduct}
        onDuplicateProduct={onDuplicateProduct}
        onEditProduct={onEditProduct}
        taxCalculations={taxCalculations}
      />
    </div>
  );
};

export default ProductsTab;