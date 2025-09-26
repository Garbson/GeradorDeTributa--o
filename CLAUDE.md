# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Projeto

Este é um **Sistema de Faturamento de Telecomunicações baseado em React** para empresas de telecomunicações (especificamente Claro/Embratel). É uma aplicação de página única construída com React que gera faturas de telecom, calcula impostos brasileiros (ICMS, FCP, PIS, COFINS, etc.) e exporta arquivos XML para NFCom (Nota Fiscal de Comunicação).

## Arquitetura

- **Aplicação React de arquivo único**: Toda a aplicação está contida em `index.jsx`
- **Sem sistema de build**: Parece ser um arquivo React standalone que pode ser executado diretamente
- **Gerenciamento de estado**: Usa React hooks (useState, useEffect) para gerenciamento de estado local
- **Motor de cálculo tributário**: Cálculos tributários brasileiros integrados com alíquotas de ICMS específicas por estado
- **Geração de XML**: Gera arquivos XML NFCom para conformidade fiscal brasileira

## Principais Componentes e Funcionalidades

### Sistema de Cálculo Tributário
- Alíquotas de ICMS por estado brasileiro (linhas 35-41)
- Alíquotas de FCP (Fundo de Combate à Pobreza) por estado (linhas 44-50)
- Cálculo tributário abrangente incluindo PIS, COFINS, ISS, FUST, FUNTTEL, CSLL, CBS, IBS (função calculateTaxes na linha 114)

### Gestão de Produtos
- Produtos de telecom pré-definidos (voz, internet, streaming) com preços
- Suporte para produtos personalizados
- Tipos de produtos incluem: chamadas de voz, planos de internet, serviços de streaming, SMS, roaming

### Geração de Documentos
- Geração de XML NFCom para conformidade tributária brasileira
- Suporte para múltiplos tipos de documentos (faturas, notas fiscais, relatórios)
- Visualização de detalhamento tributário

### Gestão de Clientes
- Formulários de dados do cliente com campos específicos do Brasil (CPF/CNPJ)
- Gestão de endereços com seleção de estado

## Notas de Desenvolvimento

- **Sem package.json**: Este projeto não usa npm/yarn - é um arquivo React standalone
- **Dependências**: Usa React, ícones Lucide React, provavelmente espera ser executado em um ambiente onde estes estejam disponíveis
- **Estilização**: Usa classes Tailwind CSS por toda a aplicação
- **Conformidade brasileira**: Construído especificamente para regulamentações e requisitos tributários brasileiros de telecom

## Estrutura de Arquivos

```
/
├── index.jsx          # Aplicação React principal (arquivo único)
└── CLAUDE.md         # Este arquivo de documentação
```

## Funções Principais

- `calculateTaxes(grossValue)` (linha 114): Lógica central de cálculo tributário
- `formatCurrency(value)` (linha 150): Formatação de moeda brasileira
- `generateXML()` (linha 157): Geração de XML NFCom
- `addProduct()` (linha 92): Gestão de produtos
- Sistema de navegação por abas para diferentes seções da aplicação

## Contexto Tributário Brasileiro

Este sistema implementa a complexa tributação brasileira de telecom incluindo:
- ICMS (imposto estadual) com diferentes alíquotas por estado
- Impostos federais: PIS, COFINS, CSLL
- Impostos específicos de telecom: FUST, FUNTTEL
- Novos impostos da reforma: CBS, IBS
- FCP (fundo de combate à pobreza) variando por estado

## Executando a Aplicação

Como não há configuração de build, isso parece ser projetado para executar em um ambiente React que fornece as dependências necessárias. A aplicação normalmente seria servida através de um servidor web ou ambiente de desenvolvimento React.