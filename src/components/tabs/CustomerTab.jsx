import CustomerForm from '../forms/CustomerForm.jsx';

/**
 * Componente da aba de cliente
 */
const CustomerTab = ({
  customerData,
  onCustomerDataChange,
  selectedState
}) => {
  // Se ainda não definido no customerData mas existe selectedState global, sincroniza
  if (selectedState && !customerData.state) {
    try { onCustomerDataChange({ state: selectedState }); } catch(_) {}
  }
  return (
    <div className="max-w-4xl mx-auto">
      <CustomerForm
        customerData={customerData}
        onCustomerDataChange={onCustomerDataChange}
      />
    </div>
  );
};

export default CustomerTab;