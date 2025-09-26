// Alíquotas de ICMS por estado
export const icmsRates = {
  'AC': 17, 'AL': 17, 'AP': 18, 'AM': 18, 'BA': 18, 'CE': 18,
  'DF': 18, 'ES': 17, 'GO': 17, 'MA': 18, 'MT': 17, 'MS': 17,
  'MG': 18, 'PA': 17, 'PB': 18, 'PR': 18, 'PE': 18, 'PI': 18,
  'RJ': 18, 'RN': 18, 'RS': 18, 'RO': 17.5, 'RR': 17, 'SC': 17,
  'SP': 18, 'SE': 18, 'TO': 18
};

// Alíquotas de FCP por estado
export const fcpRates = {
  'AC': 0, 'AL': 2, 'AP': 0, 'AM': 1, 'BA': 1.5, 'CE': 2,
  'DF': 0, 'ES': 1, 'GO': 2, 'MA': 1, 'MT': 2, 'MS': 2,
  'MG': 2, 'PA': 2, 'PB': 2, 'PR': 2, 'PE': 2, 'PI': 1,
  'RJ': 4, 'RN': 2, 'RS': 2, 'RO': 1, 'RR': 0, 'SC': 2,
  'SP': 1, 'SE': 2, 'TO': 2
};

// Estados disponíveis
export const estados = [
  { code: 'SP', name: 'São Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'PR', name: 'Paraná' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'BA', name: 'Bahia' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'CE', name: 'Ceará' },
  { code: 'GO', name: 'Goiás' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

// Tipos de produtos telecom
export const productTypes = [
  { value: 'voice', label: 'Ligação Telefônica', icon: 'Phone' },
  { value: 'internet', label: 'Banda Larga', icon: 'Wifi' },
  { value: 'streaming', label: 'Streaming (Netflix, etc.)', icon: 'Play' },
  { value: 'sms', label: 'SMS/Torpedos', icon: 'FileText' },
  { value: 'roaming', label: 'Roaming', icon: 'MapPin' }
];

// Produtos pré-definidos
export const predefinedProducts = {
  voice: [
    { description: 'Ligação Local Fixo-Fixo (por minuto)', grossValue: 0.15 },
    { description: 'Ligação Local Fixo-Móvel (por minuto)', grossValue: 0.45 },
    { description: 'Ligação Interurbana DDD (por minuto)', grossValue: 1.20 },
    { description: 'Ligação Internacional (por minuto)', grossValue: 2.50 }
  ],
  internet: [
    { description: 'Banda Larga 100MB - Mensal', grossValue: 89.90 },
    { description: 'Banda Larga 300MB - Mensal', grossValue: 119.90 },
    { description: 'Banda Larga 500MB - Mensal', grossValue: 149.90 },
    { description: 'Banda Larga 1GB - Mensal', grossValue: 199.90 }
  ],
  streaming: [
    { description: 'Netflix Básico - Claro', grossValue: 25.90 },
    { description: 'Netflix Padrão - Claro', grossValue: 39.90 },
    { description: 'Amazon Prime - Claro', grossValue: 14.90 },
    { description: 'Globoplay - Claro', grossValue: 24.90 }
  ],
  sms: [
    { description: 'SMS Nacional (por unidade)', grossValue: 0.25 },
    { description: 'SMS Internacional (por unidade)', grossValue: 0.50 },
    { description: 'Pacote 100 SMS', grossValue: 19.90 },
    { description: 'Pacote 500 SMS', grossValue: 79.90 }
  ],
  roaming: [
    { description: 'Roaming Nacional - Voz (por minuto)', grossValue: 1.99 },
    { description: 'Roaming Nacional - Dados (por MB)', grossValue: 0.99 },
    { description: 'Roaming Internacional - Voz (por minuto)', grossValue: 9.99 },
    { description: 'Roaming Internacional - Dados (por MB)', grossValue: 19.99 }
  ]
};

// Dados padrão de histórico de consumo
export const defaultConsumptionHistory = [
  { month: 'Set/2025', voice: 120, data: 45.5, value: 89.90 },
  { month: 'Ago/2025', voice: 98, data: 52.3, value: 94.50 },
  { month: 'Jul/2025', voice: 145, data: 38.7, value: 87.20 },
  { month: 'Jun/2025', voice: 167, data: 41.2, value: 92.30 },
  { month: 'Mai/2025', voice: 134, data: 47.8, value: 91.80 },
  { month: 'Abr/2025', voice: 89, data: 44.1, value: 85.60 }
];

// Tipos de documentos disponíveis
export const documentTypes = [
  {
    id: 'fatura-resumo',
    title: '1. Fatura Resumo',
    desc: 'Resumo com boleto para pagamento',
    icon: 'DollarSign'
  },
  {
    id: 'fatura-detalhada',
    title: '2. Fatura Detalhada',
    desc: 'Detalhamento de cada serviço/ligação',
    icon: 'FileText'
  },
  {
    id: 'nf-icms-antiga',
    title: '3. NF ICMS Antiga',
    desc: 'Nota Fiscal tradicional',
    icon: 'Percent'
  },
  {
    id: 'nf-icms-nova',
    title: '4. NF ICMS Nova (NFCom)',
    desc: 'Nova Nota Fiscal de Comunicação',
    icon: 'Info'
  },
  {
    id: 'nf-iss',
    title: '5. NF de ISS',
    desc: 'Nota Fiscal de Serviços',
    icon: 'Calculator'
  },
  {
    id: 'historico-consumo',
    title: '6. Histórico de Consumo',
    desc: 'Últimos 6 meses de consumo',
    icon: 'BarChart3'
  }
];

// Alíquotas de impostos federais e outros
export const taxRates = {
  pis: 1.65,
  cofins: 7.6,
  iss: 5,
  fust: 1,
  funttel: 0.5,
  csll: 9,
  cbs: 0.9,
  ibsUf: 0.1
};

// Informações da empresa emitente
export const companyInfo = {
  cnpj: '14200166000187',
  razaoSocial: 'CLARO S.A.',
  nomeFantasia: 'Claro',
  endereco: {
    logradouro: 'Rua Exemplo',
    numero: '1000',
    bairro: 'Centro',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '01000000',
    codigoMunicipio: '3550308'
  },
  inscricaoEstadual: '123456789012',
  telefone: '(11) 4002-8922',
  email: 'faturamento@claro.com.br'
};