// import React, { useState } from 'react';
// import axios from 'axios';

// const YearlyPaymentForm = () => {
//     const [yearRange, setYearRange] = useState('');
//     const [payments, setPayments] = useState({
//         Printer: '',
//         Provider: '',
//         MachineDealer: '',
//         Publisher: ''
//     });
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setPayments({
//             ...payments,
//             [name]: value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         if (!yearRange.match(/^\d{4}-\d{4}$/)) {
//             setError('Year Range format should be like 2024-2025');
//             return;
//         }

//         try {
//             const res = await axios.post('http://localhost:5000/Ohkla/addYear', {
//                 yearRange,
//                 payments: {
//                     Printer: parseFloat(payments.Printer),
//                     Provider: parseFloat(payments.Provider),
//                     MachineDealer: parseFloat(payments.MachineDealer),
//                     Publisher: parseFloat(payments.Publisher)
//                 }
//             });

//             setMessage(res.data.message);
//             setYearRange('');
//             setPayments({
//                 Printer: '',
//                 Provider: '',
//                 MachineDealer: '',
//                 Publisher: ''
//             });
//         } catch (error) {
//             console.error('Error:', error);
//             setError('Failed to save yearly payments');
//         }
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//             <div className="card shadow p-4" style={{ width: '420px', borderRadius: '12px' }}>
//                 <h2 className="text-center mb-4 fw-bold text-dark">Add Yearly Payment</h2>

//                 {message && <div className="alert alert-success text-center">{message}</div>}
//                 {error && <div className="alert alert-danger text-center">{error}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label fw-semibold">Year Range</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="e.g. 2024-2025"
//                             value={yearRange}
//                             onChange={(e) => setYearRange(e.target.value)}
//                             required
//                         />
//                     </div>

//                     {['Printer', 'Provider', 'MachineDealer', 'Publisher'].map((category) => (
//                         <div className="mb-3" key={category}>
//                             <label className="form-label fw-semibold">{category} Payment</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 name={category}
//                                 placeholder={`Enter payment for ${category}`}
//                                 value={payments[category]}
//                                 onChange={handleInputChange}
//                                 min="0"
//                                 step="0.01"
//                                 required
//                             />
//                         </div>
//                     ))}

//                     <button
//                         type="submit"
//                         className="btn btn-primary w-100 fw-bold"
//                         style={{
//                             fontSize: '1.1rem',
//                             padding: '10px',
//                             borderRadius: '8px',
//                             boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)',
//                             transition: 'background-color 0.3s ease'
//                         }}
//                         onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
//                         onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0d6efd')}
//                     >
//                         Save Payments
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default YearlyPaymentForm;


import React, { useState } from 'react';
import axios from 'axios';

const YearlyPaymentForm = () => {
    const [yearRange, setYearRange] = useState('');
    const [payments, setPayments] = useState({
        Printer: '',
        Provider: '',
        MachineDealer: '',
        Publisher: ''
    });
    const [registrations, setRegistrations] = useState({
        Printer: '',
        Provider: '',
        MachineDealer: '',
        Publisher: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e, type) => {
        const { name, value } = e.target;
        if (type === 'payment') {
            setPayments(prev => ({
                ...prev,
                [name]: value
            }));
        } else if (type === 'registration') {
            setRegistrations(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!yearRange.match(/^\d{4}-\d{4}$/)) {
            setError('Year Range format should be like 2024-2025');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/Ohkla/addNewYearAndInsertForAllMember', {
                yearRange,
                payments: {
                    Printer: parseFloat(payments.Printer),
                    Provider: parseFloat(payments.Provider),
                    MachineDealer: parseFloat(payments.MachineDealer),
                    Publisher: parseFloat(payments.Publisher)
                },
                registrations: {
                    Printer: parseFloat(registrations.Printer),
                    Provider: parseFloat(registrations.Provider),
                    MachineDealer: parseFloat(registrations.MachineDealer),
                    Publisher: parseFloat(registrations.Publisher)
                }
            });

            setMessage(res.data.message || 'Data saved successfully');
            setYearRange('');
            setPayments({
                Printer: '',
                Provider: '',
                MachineDealer: '',
                Publisher: ''
            });
            setRegistrations({
                Printer: '',
                Provider: '',
                MachineDealer: '',
                Publisher: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to save yearly payments');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: '560px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 fw-bold text-dark">Add Yearly Payment</h2>

                {message && <div className="alert alert-success text-center">{message}</div>}
                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Year Range</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. 2024-2025"
                            value={yearRange}
                            onChange={(e) => setYearRange(e.target.value)}
                            required
                        />
                    </div>

                    {['Printer', 'Provider', 'MachineDealer', 'Publisher'].map((category) => (
                        <div className="mb-3" key={category}>
                            <div className="row">
                                <div className="col-12 fw-semibold mb-1">{category}</div>
                                <div className="col-md-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name={category}
                                        placeholder={`${category} Payment`}
                                        value={payments[category]}
                                        onChange={(e) => handleInputChange(e, 'payment')}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name={category}
                                        placeholder={`${category} Registration`}
                                        value={registrations[category]}
                                        onChange={(e) => handleInputChange(e, 'registration')}
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold mt-3"
                        style={{
                            fontSize: '1.1rem',
                            padding: '10px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
                        onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0d6efd')}
                    >
                        Save Payments
                    </button>
                </form>
            </div>
        </div>
    );
};

export default YearlyPaymentForm;
