import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalPaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Ohkla/YearlyPaymentList")
      .then((response) => {
        if (response.data.success) {
          setPayments(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching total payments:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-4 text-center fw-semibold text-secondary">
        Loading payments...
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold" style={{ color: "#003366" }}>
        Yearly Payment Summary
      </h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-primary text-nowrap bg-primary text-white">
            <tr>
              <th>Year</th>
              <th>Printer Payment</th>
              <th>Provider Payment</th>
              <th>Machine Dealer Payment</th>
              <th>Publisher Payment</th>
              <th>Printer Reg.</th>
              <th>Provider Reg.</th>
              <th>Machine Dealer Reg.</th>
              <th>Publisher Reg.</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item, index) => (
              <tr key={index}>
                <td>{item.YearRange}</td>
                <td>₹{Number(item.PrinterPayment).toLocaleString()}</td>
                <td>₹{Number(item.ProviderPayment).toLocaleString()}</td>
                <td>₹{Number(item.MachineDealerPayment).toLocaleString()}</td>
                <td>₹{Number(item.PublisherPayment).toLocaleString()}</td>
                <td>{item.PrinterRegistration || "-"}</td>
                <td>{item.ProviderRegistration || "-"}</td>
                <td>{item.MachineDealerRegistration || "-"}</td>
                <td>{item.PublisherRegistration || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalPaymentsList;
