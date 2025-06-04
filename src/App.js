import React from 'react';
import MemberForm from './Componets/MemberForm';
import MemberTable from './Componets/ShowMemberData';
import PaymentForm from './Componets/PaymentSummary';
import ReceiptTable from './Componets/ReceptTable';
import Dashboard from './Componets/Desboard';
import YearlyPaymentForm from './Componets/addPaymentForm';
import YearlySummary from './Componets/YearlySummary';
import AnnualPaymentsTable from './Componets/AnnualPaymentRecord';
import PaymentReceiptTable from './Componets/ReceptTable';
import OtherPaymentsTable from './Componets/showOtherDetails';
import TotalPaymentsList from './Componets/YearlyPaymentList';


function App() {
  return (
    <div className="App">
      <MemberForm />
      <MemberTable />
      <PaymentForm />
      {/* <ReceiptTable /> */}
      <Dashboard />
      <YearlyPaymentForm />
      {/* <YearlySummary /> */}
      <AnnualPaymentsTable />
      {/* <PaymentForm1 /> */}
      <PaymentReceiptTable />
      <OtherPaymentsTable />
      <TotalPaymentsList />
    </div>
  );
}

export default App;
