import React, { useState } from 'react';
import { User, Phone, MapPin, CreditCard } from 'lucide-react';
import Input from '../ui/Input.jsx';
import { estados } from '../../utils/constants.js';
import {
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  isValidCPF,
  isValidCNPJ,
  isValidCEP
} from '../../utils/formatters.js';

/**
 * Componente para formulário de dados do cliente
 */
const CustomerForm = ({
  customerData,
  onCustomerDataChange
}) => {
  const [errors, setErrors] = useState({});

  // Máscara para CPF/CNPJ
  const maskCpfCnpj = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return formatCPF(cleaned);
    } else {
      return formatCNPJ(cleaned);
    }
  };

  // Validação em tempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;

      case 'cpfCnpj':
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned) {
          newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório';
        } else if (cleaned.length === 11) {
          if (!isValidCPF(cleaned)) {
            newErrors.cpfCnpj = 'CPF inválido';
          } else {
            delete newErrors.cpfCnpj;
          }
        } else if (cleaned.length === 14) {
          if (!isValidCNPJ(cleaned)) {
            newErrors.cpfCnpj = 'CNPJ inválido';
          } else {
            delete newErrors.cpfCnpj;
          }
        } else {
          newErrors.cpfCnpj = 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
        }
        break;

      case 'phone':
        const cleanedPhone = value.replace(/\D/g, '');
        if (!cleanedPhone) {
          newErrors.phone = 'Telefone é obrigatório';
        } else if (cleanedPhone.length < 10) {
          newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'zipCode':
        if (!value) {
          newErrors.zipCode = 'CEP é obrigatório';
        } else if (!isValidCEP(value)) {
          newErrors.zipCode = 'CEP inválido';
        } else {
          delete newErrors.zipCode;
        }
        break;

      case 'address':
        if (!value.trim()) {
          newErrors.address = 'Endereço é obrigatório';
        } else {
          delete newErrors.address;
        }
        break;

      case 'city':
        if (!value.trim()) {
          newErrors.city = 'Cidade é obrigatória';
        } else {
          delete newErrors.city;
        }
        break;

      case 'state':
        if (!value) {
          newErrors.state = 'Estado é obrigatório';
        } else {
          delete newErrors.state;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    // Aplicar formatação específica
    switch (field) {
      case 'cpfCnpj':
        value = maskCpfCnpj(value);
        break;
      case 'phone':
        value = formatPhone(value);
        break;
      case 'zipCode':
        value = formatCEP(value);
        break;
      default:
        break;
    }

    // Atualizar dados
    onCustomerDataChange({ [field]: value });

    // Validar campo
    validateField(field, value);
  };

  const handleBlur = (field) => (e) => {
    validateField(field, e.target.value);
  };

  // Função para buscar CEP (simulada)
  const handleCepLookup = async (cep) => {
    if (!isValidCEP(cep)) return;

    try {
      // TODO: Implementar busca real de CEP via API
      // Por enquanto, simula preenchimento automático
      const cleanCep = cep.replace(/\D/g, '');

      // Simulação de dados baseados no CEP
      if (cleanCep.startsWith('01')) {
        onCustomerDataChange({
          address: 'Praça da Sé',
          city: 'São Paulo',
          state: 'SP'
        });
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Dados do Cliente</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome Completo */}
        <div className="md:col-span-2">
          <Input
            label="Nome Completo"
            placeholder="Digite o nome completo"
            value={customerData.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={errors.name}
            required
            icon={User}
          />
        </div>

        {/* CPF/CNPJ */}
        <Input
          label="CPF/CNPJ"
          placeholder="000.000.000-00 ou 00.000.000/0001-00"
          value={customerData.cpfCnpj}
          onChange={handleChange('cpfCnpj')}
          onBlur={handleBlur('cpfCnpj')}
          error={errors.cpfCnpj}
          required
          icon={CreditCard}
          helpText="Digite apenas números"
        />

        {/* Telefone */}
        <Input
          label="Telefone"
          placeholder="(11) 99999-9999"
          value={customerData.phone}
          onChange={handleChange('phone')}
          onBlur={handleBlur('phone')}
          error={errors.phone}
          required
          icon={Phone}
        />

        {/* CEP */}
        <Input
          label="CEP"
          placeholder="00000-000"
          value={customerData.zipCode}
          onChange={handleChange('zipCode')}
          onBlur={(e) => {
            handleBlur('zipCode')(e);
            handleCepLookup(e.target.value);
          }}
          error={errors.zipCode}
          required
          icon={MapPin}
          helpText="CEP será usado para preenchimento automático"
        />

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            value={customerData.state}
            onChange={handleChange('state')}
            onBlur={handleBlur('state')}
            className={`
              w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200
              ${errors.state
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
              }
            `}
          >
            <option value="">Selecione o estado...</option>
            {estados.map(estado => (
              <option key={estado.code} value={estado.code}>
                {estado.name} ({estado.code})
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state}</p>
          )}
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <Input
            label="Endereço Completo"
            placeholder="Rua, número, bairro"
            value={customerData.address}
            onChange={handleChange('address')}
            onBlur={handleBlur('address')}
            error={errors.address}
            required
            icon={MapPin}
          />
        </div>

        {/* Cidade */}
        <Input
          label="Cidade"
          placeholder="Nome da cidade"
          value={customerData.city}
          onChange={handleChange('city')}
          onBlur={handleBlur('city')}
          error={errors.city}
          required
          icon={MapPin}
        />
      </div>

      {/* Resumo dos erros */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Corrija os seguintes erros:
          </h3>
          <ul className="text-sm text-red-600 space-y-1">
            {Object.values(errors).map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validação completa */}
      {Object.keys(errors).length === 0 && customerData.name && customerData.cpfCnpj && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Dados do cliente válidos e completos
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerForm;