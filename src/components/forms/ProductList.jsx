import React from 'react';
import { Calculator, Trash2, Copy, Edit3, Phone, Wifi, Play, FileText, MapPin } from 'lucide-react';
import { productTypes } from '../../utils/constants.js';
import { formatCurrency } from '../../utils/formatters.js';
import Button from '../ui/Button.jsx';

/**
 * Componente para exibir lista de produtos adicionados
 */
const ProductList = ({
  products,
  onRemoveProduct,
  onDuplicateProduct,
  onEditProduct,
  taxCalculations
}) => {
  const { productsWithTaxes, totalBill } = taxCalculations || {};

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Produtos Adicionados</h2>

        <div className="text-center py-12">
          <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum produto adicionado ainda</p>
          <p className="text-sm text-gray-400 mt-2">
            Use o formulário ao lado para adicionar produtos
          </p>
        </div>
      </div>
    );
  }

  const getProductIcon = (productType) => {
    const iconMap = {
      'Phone': Phone,
      'Wifi': Wifi,
      'Play': Play,
      'FileText': FileText,
      'MapPin': MapPin,
      'Calculator': Calculator
    };

    const type = productTypes.find(t => t.value === productType);
    const iconName = type?.icon || 'Calculator';
    return iconMap[iconName] || Calculator;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Produtos Adicionados ({products.length})
      </h2>

      <div className="space-y-4">
        {products.map((product, index) => {
          const IconComponent = getProductIcon(product.type);
          const productWithTaxes = productsWithTaxes?.find(p => p.id === product.id);
          const taxes = productWithTaxes?.taxes;

          return (
            <div key={product.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <IconComponent className="w-5 h-5 text-red-600 flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {product.description}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      <span>Qtd: {product.quantity}</span>
                      <span className="mx-2">•</span>
                      <span>Unit: {formatCurrency(product.grossValue)}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium">
                        Total: {formatCurrency(product.grossValue * product.quantity)}
                      </span>
                    </div>

                    {taxes && (
                      <div className="text-xs text-gray-400 mt-1">
                        <span>Líquido: {formatCurrency(taxes.netValue * product.quantity)}</span>
                        <span className="mx-2">•</span>
                        <span>Impostos: {formatCurrency(taxes.totalTaxes * product.quantity)}</span>
                        <span className="mx-2">•</span>
                        <span>ICMS: {formatCurrency(taxes.icmsValue * product.quantity)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Copy}
                    onClick={() => onDuplicateProduct?.(product)}
                    title="Duplicar produto"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit3}
                    onClick={() => onEditProduct?.(product)}
                    title="Editar produto"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onRemoveProduct(product.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    title="Remover produto"
                  />
                </div>
              </div>

              {/* Detalhes dos impostos (expandível) */}
              {taxes && (
                <details className="mt-3">
                  <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                    Ver detalhes dos impostos
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-xs grid grid-cols-2 gap-2">
                    <div>ICMS: {formatCurrency(taxes.icmsValue * product.quantity)}</div>
                    <div>FCP: {formatCurrency(taxes.fcpValue * product.quantity)}</div>
                    <div>PIS: {formatCurrency(taxes.pisValue * product.quantity)}</div>
                    <div>COFINS: {formatCurrency(taxes.cofinsValue * product.quantity)}</div>
                    <div>ISS: {formatCurrency(taxes.issValue * product.quantity)}</div>
                    <div>FUST: {formatCurrency(taxes.fustValue * product.quantity)}</div>
                    <div>FUNTTEL: {formatCurrency(taxes.funttelValue * product.quantity)}</div>
                    <div>CSLL: {formatCurrency(taxes.csllValue * product.quantity)}</div>
                    <div>CBS: {formatCurrency(taxes.cbsValue * product.quantity)}</div>
                    <div>IBS-UF: {formatCurrency(taxes.ibsUfValue * product.quantity)}</div>
                  </div>
                </details>
              )}
            </div>
          );
        })}

        {/* Total da Fatura */}
        <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold text-red-800">
                Total da Fatura
              </div>
              {taxCalculations && (
                <div className="text-sm text-red-600">
                  Líquido: {formatCurrency(taxCalculations.totalNet)} |
                  Impostos: {formatCurrency(taxCalculations.totalTaxes)}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-red-800">
              {formatCurrency(totalBill || 0)}
            </div>
          </div>
        </div>

        {/* Resumo dos Impostos */}
        {taxCalculations?.taxBreakdown && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3">Resumo dos Impostos</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="text-center">
                <div className="text-gray-600">ICMS</div>
                <div className="font-semibold text-red-600">
                  {formatCurrency(taxCalculations.taxBreakdown.icms)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">PIS</div>
                <div className="font-semibold text-blue-600">
                  {formatCurrency(taxCalculations.taxBreakdown.pis)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">COFINS</div>
                <div className="font-semibold text-blue-700">
                  {formatCurrency(taxCalculations.taxBreakdown.cofins)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">FUST</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(taxCalculations.taxBreakdown.fust)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">CBS</div>
                <div className="font-semibold text-orange-600">
                  {formatCurrency(taxCalculations.taxBreakdown.cbs)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;