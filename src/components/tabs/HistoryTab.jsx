import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';
import { defaultConsumptionHistory } from '../../utils/constants.js';

/**
 * Componente da aba de histórico
 */
const HistoryTab = ({
  consumptionHistory = defaultConsumptionHistory
}) => {
  // Calcular médias
  const averageVoice = Math.round(
    consumptionHistory.reduce((sum, r) => sum + r.voice, 0) / consumptionHistory.length
  );

  const averageData = (
    consumptionHistory.reduce((sum, r) => sum + r.data, 0) / consumptionHistory.length
  ).toFixed(1);

  const averageBill = (
    consumptionHistory.reduce((sum, r) => sum + r.value, 0) / consumptionHistory.length
  );

  // Calcular tendências (comparando último mês com média)
  const lastMonth = consumptionHistory[0];
  const voiceTrend = lastMonth.voice > averageVoice ? 'up' : 'down';
  const dataTrend = lastMonth.data > averageData ? 'up' : 'down';
  const billTrend = lastMonth.value > averageBill ? 'up' : 'down';

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Tabela de Histórico */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Histórico de Consumo - Últimos 6 Meses
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-red-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Mês/Ano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Minutos de Voz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Dados (GB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Valor da Fatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-800 uppercase tracking-wider">
                  Variação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {consumptionHistory.map((record, index) => {
                const previousRecord = consumptionHistory[index + 1];
                const variation = previousRecord
                  ? ((record.value - previousRecord.value) / previousRecord.value * 100)
                  : 0;

                return (
                  <tr key={index} className={`hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.month}
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Atual
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.voice} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.data} GB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(record.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index === 0 ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className={variation > 0 ? 'text-red-600' : 'text-green-600'}>
                          {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Média de Voz */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Média de Voz</h3>
              <p className="text-2xl font-bold text-blue-600">{averageVoice} min</p>
              <p className="text-sm text-blue-600 mt-1">
                Último mês: {lastMonth.voice} min
              </p>
            </div>
            <div className={`${getTrendColor(voiceTrend)}`}>
              {React.createElement(getTrendIcon(voiceTrend), { className: "w-8 h-8" })}
            </div>
          </div>
        </div>

        {/* Média de Dados */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 mb-1">Média de Dados</h3>
              <p className="text-2xl font-bold text-green-600">{averageData} GB</p>
              <p className="text-sm text-green-600 mt-1">
                Último mês: {lastMonth.data} GB
              </p>
            </div>
            <div className={`${getTrendColor(dataTrend)}`}>
              {React.createElement(getTrendIcon(dataTrend), { className: "w-8 h-8" })}
            </div>
          </div>
        </div>

        {/* Média de Fatura */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Média de Fatura</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(averageBill)}</p>
              <p className="text-sm text-red-600 mt-1">
                Último mês: {formatCurrency(lastMonth.value)}
              </p>
            </div>
            <div className={`${getTrendColor(billTrend)}`}>
              {React.createElement(getTrendIcon(billTrend), { className: "w-8 h-8" })}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Simples (ASCII Art) */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Evolução dos Valores</h3>

        <div className="space-y-4">
          {consumptionHistory.map((record, index) => {
            const maxValue = Math.max(...consumptionHistory.map(r => r.value));
            const percentage = (record.value / maxValue) * 100;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-600 text-right">
                  {record.month.split('/')[0]}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {formatCurrency(record.value)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Insights e Recomendações</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Análise de Consumo</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Consumo de voz {voiceTrend === 'up' ? 'aumentou' : 'diminuiu'} no último mês</li>
              <li>• Uso de dados {dataTrend === 'up' ? 'cresceu' : 'reduziu'} comparado à média</li>
              <li>• Fatura {billTrend === 'up' ? 'subiu' : 'baixou'} em relação ao histórico</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2">💡 Recomendações</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Considere planos com mais dados se o consumo está crescendo</li>
              <li>• Verifique promoções para chamadas de voz frequentes</li>
              <li>• Monitore picos de consumo para otimizar custos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;