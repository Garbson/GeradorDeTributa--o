import { Plus } from 'lucide-react';
import { estados, predefinedProducts, productTypes } from '../../utils/constants.js';
import { formatDecimal } from '../../utils/formatters.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

/**
 * Componente para formulário de adição de produtos
 */
const ProductForm = ({
  currentProduct,
  onProductChange,
  onAddProduct,
  selectedState,
  canAddProduct,
  onStateChange
}) => {
  const handleTypeChange = (e) => {
    onProductChange({
      type: e.target.value,
      description: '',
      grossValue: ''
    });
  };

  const handleProductSelect = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      onProductChange({
        description: 'custom',
        grossValue: ''
      });
    } else {
      const selectedProduct = predefinedProducts[currentProduct.type]?.find(
        p => p.description === selectedValue
      );

      if (selectedProduct) {
        onProductChange({
          description: selectedValue,
          grossValue: formatDecimal(selectedProduct.grossValue)
        });
      }
    }
  };

  const handleCustomDescriptionChange = (e) => {
    onProductChange({
      description: e.target.value
    });
  };

  const handleValueChange = (e) => {
    onProductChange({
      grossValue: e.target.value
    });
  };

  const handleQuantityChange = (e) => {
    onProductChange({
      quantity: parseInt(e.target.value) || 1
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Adicionar Produtos</h2>

      <div className="space-y-6">
        {/* Estado do Cliente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado do Cliente *</label>
          <select
            value={selectedState}
            onChange={(e)=> onStateChange && onStateChange(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          >
            <option value="">Selecione...</option>
            {estados.map(est => (
              <option key={est.code} value={est.code}>{est.name} ({est.code})</option>
            ))}
          </select>
        </div>

        {/* Tipo de Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Produto
          </label>
          <select
            value={currentProduct.type}
            onChange={handleTypeChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {productTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto
          </label>
          <select
            value={currentProduct.description}
            onChange={handleProductSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Selecione um produto...</option>
            {predefinedProducts[currentProduct.type]?.map(product => (
              <option key={product.description} value={product.description}>
                {product.description} - R$ {formatDecimal(product.grossValue)}
              </option>
            ))}
            <option value="custom">Produto personalizado...</option>
          </select>
        </div>

        {/* Descrição Personalizada */}
        {currentProduct.description === 'custom' && (
          <Input
            label="Descrição Personalizada"
            placeholder="Digite a descrição do produto..."
            value=""
            onChange={handleCustomDescriptionChange}
            required
          />
        )}

        {/* Quantidade e Valor */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantidade"
            type="number"
            value={currentProduct.quantity}
            onChange={handleQuantityChange}
            min="1"
            required
          />

          <Input
            label="Valor Bruto (c/ impostos)"
            placeholder="Ex: 89,90"
            value={currentProduct.grossValue}
            onChange={handleValueChange}
            helpText="Valor com todos os impostos incluídos"
            required
          />
        </div>

        {/* Botão Adicionar */}
        <Button
          onClick={onAddProduct}
          disabled={!canAddProduct || !selectedState}
          icon={Plus}
          className="w-full"
          size="lg"
        >
          Adicionar Produto
        </Button>

        {/* Mensagens de Erro */}
        {!selectedState && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
            Selecione o estado para liberar o cálculo de impostos.
          </div>
        )}

        {!canAddProduct && selectedState && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ❌ Preencha todos os campos obrigatórios para adicionar o produto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;