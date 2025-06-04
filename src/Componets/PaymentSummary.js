
import React, { useEffect, useState } from "react";
import axios from "axios";
function PaymentForm() {
    const [companies, setCompanies] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [member, setMember] = useState({});

    const [totalAmount, setTotalAmount] = useState("");
    const [amountPaid, setAmountPaid] = useState("0");
    const [dueAmount, setDueAmount] = useState("0");
    const [newPayment, setNewPayment] = useState("");
    const [receiptNo, setReceiptNo] = useState(`REC-${Math.floor(100 + Math.random() * 900)}`);

    const [chequeNo, setChequeNo] = useState("");
    const [chequeDate, setChequeDate] = useState("");
    const [bankName, setBankName] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isNewTotalAmountEditable, setIsNewTotalAmountEditable] = useState(false);
    const [years, setYears] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [paymentYear, setPaymentYear] = useState('');// New fields
    const [paymentType, setPaymentType] = useState("");
    const [additionalPayable, setAdditionalPayable] = useState("");
    const [remark, setRemark] = useState("");
    const [registrationFees, setRegistrationFees] = React.useState('');
    const [otherCharge, setOtherCharge] = useState(0);
    const [registrationAmount, setRegistrationAmount] = useState(0);

    const fetchRegistrationFees = async (companyId) => {
        try {
            const response = await fetch(`http://localhost:5000/Ohkla/getRegistrationFee/${companyId}`, {
                method: 'GET',
            });
            const data = await response.json();
            console.log(data); // ✅ should log: { success: true, registrationFee: 3000 }

            if (data.success) {
                setRegistrationFees(data.registrationFee); // ✅ Correct value set here
            } else {
                setRegistrationFees('0'); // Fallback if not successful
            }
        } catch (error) {
            console.error('Error fetching registration fees:', error);
            setRegistrationFees('0'); // Fallback on error
        }
    };


    useEffect(() => {
        axios.get("http://localhost:5000/Ohkla/getCompany")
            .then((res) => setCompanies(res.data))
            .catch((err) => console.error("Error fetching companies:", err));

        axios.get("http://localhost:5000/Ohkla/getYear")
            .then((res) => {
                const yearsFromAPI = res.data.map((item) => item.YearRange);
                setYears(yearsFromAPI);
            })
            .catch((err) => console.error("Error fetching years:", err));
    }, []);

    useEffect(() => {
        const idNum = Number(selectedId);
        const selected = companies.find(c => c.MembershipID === idNum);

        if (selected) {
            setCompanyName(selected.CompanyName);
        }

        if (paymentType === "Registration" && selectedId && !isNaN(idNum)) {
            fetchRegistrationFees(selectedId);
        }
    }, [selectedId, selectedYear, paymentType, companies]);


    const fetchMember = async () => {
        if (!selectedId || !paymentType || (paymentType === "Annual" && !selectedYear)) {
            alert("⚠️ Please select Company, Payment Type, and Year (only for Annual).");
            return;
        }
        try {
            setIsLoadingData(true);

            if (paymentType === "Annual") {
                const { data } = await axios.get(
                    `http://localhost:5000/Ohkla/getMemberAndPaymentSummaryById/${selectedId}/${selectedYear}`
                );

                if (data && Object.keys(data).length > 0) {
                    setMember(data);
                    setTotalAmount(String(data.TotalAmount ?? ""));
                    setAmountPaid(String(data.AmountPaid ?? "0"));
                    setDueAmount(String(data.DueAmount ?? "0"));
                    setIsNewTotalAmountEditable(false);
                } else {
                    const resMember = await axios.get(`http://localhost:5000/Ohkla/getMemberById/${selectedId}`);
                    const memData = resMember.data || {};
                    setMember(memData);

                    const tAmt = memData.TotalAmount != null ? Number(memData.TotalAmount) : 0;
                    setTotalAmount(String(tAmt));
                    setAmountPaid("0");
                    setDueAmount(String(tAmt));
                    setIsNewTotalAmountEditable(true);
                }
            } else {
                // For Registration or Other
                const resMember = await axios.get(`http://localhost:5000/Ohkla/getMemberById/${selectedId}`);
                const memData = resMember.data || {};
                console.log(memData.Category);
                // if(memData.Category != ""){
                //     const RegFees = 
                // }
                setMember(memData);
                const tAmt = memData.TotalAmount != null ? Number(memData.TotalAmount) : 0;
                setTotalAmount(String(tAmt));
                setAmountPaid("0");
                setDueAmount(String(tAmt));
                setIsNewTotalAmountEditable(true);
            }

            // Reset form fields
            setNewPayment("");
            setReceiptNo(`REC-${Math.floor(100 + Math.random() * 900)}`);
            setChequeNo("");
            setChequeDate("");
            setBankName("");
            setPaymentMode("");
            setAdditionalPayable("");
            setRemark("");

            setIsLoadingData(false);
        } catch (error) {
            console.error("Error fetching member/payment summary:", error);
            alert("❌ Failed to fetch data.");
            setIsLoadingData(false);
        }
    }; // ✅ This is correct — no extra curly brace needed after this.


    const handleTotalAmountChange = (e) => {
        const val = e.target.value;
        const total = parseFloat(val) || 0;
        const paid = parseFloat(amountPaid) || 0;

        setTotalAmount(val);
        setDueAmount((total - paid).toFixed(2));
    };

    const handleNewPaymentChange = (value) => {
        const newPay = parseFloat(value) || 0;
        const paid = parseFloat(amountPaid) || 0;
        const total = parseFloat(totalAmount) || 0;

        setNewPayment(value);
        setDueAmount((total - (paid + newPay)).toFixed(2));
    };

    const handleSave = async () => {
        const newPay = parseFloat(newPayment) || 0;
        const addPay = parseFloat(additionalPayable) || 0;
        const paid = parseFloat(amountPaid) || 0;
        const total = parseFloat(totalAmount) || 0;

        const actualPaid = paymentType === "Annual" ? newPay : addPay;
        const updatedPaid = paid + actualPaid;
        const updatedDue = total - updatedPaid;


        // if (!selectedId || (actualPaid <= 0 && paymentType !== "Registration")) {
        //     alert("⚠️ Please enter a valid payment amount.");
        //     return;
        // }

        if (!selectedId) {
            alert("⚠️ Please select a member.");
            return;
        }

        if (paymentType === "Registration") {
            if (!registrationFees || registrationFees <= 0) {
                alert("⚠️ Registration Fees must be greater than 0.");
                return;
            }
        } else if (paymentType === "Other") {
            if (!otherCharge || otherCharge <= 0) {
                alert("⚠️ Please enter a valid Other Charge.");
                return;
            }
        }

        let actual = 0;

        if (paymentType === "Registration") {
            actual = registrationFees;
        } else if (paymentType === "Other") {
            actual = otherCharge;
        }


        if (!paymentMode) {
            alert("Payment Mode is required!");
            return;  // stop further processing
        }

        try {
            if (paymentType === "Annual") {
                // ✅ Send to YearlyPaymentSummary
                await axios.post("http://localhost:5000/Ohkla/addPayment", {
                    MembershipID: parseInt(selectedId),
                    PaymentYear: selectedYear,
                    AmountPaid: updatedPaid,
                    DueAmount: updatedDue,
                    TotalAmount: total,
                    ReceiptNumber: receiptNo,
                    ChequeNumber: chequeNo,
                    ChequeReceiveOn: chequeDate || null,
                    BankName: bankName,
                    PaymentType: paymentMode,
                    PaymentCategory: paymentType,
                    Remark: remark
                });

                alert("✅ Payment details saved to YearlyPaymentSummary!");

                const receiptPayload = {
                    ReceiptNumber: receiptNo,
                    ReceiptDate: new Date().toISOString().split('T')[0], // today's date in YYYY-MM-DD
                    MembershipID: parseInt(selectedId),
                    ReceivedAmount: actualPaid,
                    PaymentMode: paymentMode,
                    PaymentType: paymentType,
                    ChequeNumber: chequeNo,
                    BankName: bankName,
                    PaymentYear: paymentType === "Annual" ? selectedYear : null,
                };
                console.log(receiptPayload);
                const receiptRes = await axios.post("http://localhost:5000/Ohkla/ReceiptOfPayment", receiptPayload);
                console.log("✅ Receipt added:", receiptRes.data);

                alert("Receipt added successfully!");

                try {
                    const payload = {
                        MembershipID: parseInt(selectedId),
                        PaymentYear: selectedYear,
                        AmountPaid: updatedPaid
                    };
                    console.log("Sending PUT:", payload);

                    const response = await axios.put("http://localhost:5000/Ohkla/updateAnnualPayment", payload);
                    console.log("Response:", response.data);
                    alert("Annual payment updated successfully!");

                    // const receiptPayload = {
                    //     ReceiptNumber: receiptNo,
                    //     ReceiptDate: new Date().toISOString().split('T')[0], // today's date in YYYY-MM-DD
                    //     MembershipID: parseInt(selectedId),
                    //     ReceivedAmount: updatedPaid,
                    //     PaymentMode: paymentMode,
                    //     PaymentType: paymentType,
                    //     ChequeNumber: chequeNo,
                    //     BankName: bankName,
                    //     PaymentYear: paymentType === "Annual" ? selectedYear : null,
                    // };
                    // console.log(receiptPayload);
                    // const receiptRes = await axios.post("http://localhost:5000/Ohkla/ReceiptOfPayment", receiptPayload);
                    // console.log("✅ Receipt added:", receiptRes.data);

                    // alert("Receipt added successfully!");
                } catch (error) {
                    console.error("❌ PUT error:", error.response?.data || error.message);
                    alert("Error while updating annual payment: " + (error.response?.data?.error || error.message));
                }
            } else {
                // ✅ Send to ExtraDetail
                const response = await axios.post("http://localhost:5000/Ohkla/ExtraDetail", {
                    MembershipID: parseInt(selectedId),
                    CompanyName: companyName,
                    PaymentYear: selectedYear,
                    // Amount: addPay,  // Correct key
                    Amount: actual,
                    ReceiptNumber: receiptNo,
                    ChequeNumber: chequeNo,
                    ChequeReceiveOn: chequeDate ? chequeDate : null,
                    BankName: bankName,
                    PaymentMode: paymentMode,
                    PaymentCategory: paymentType,
                    Remark: remark
                });
                console.log("Payment Type:", paymentType);
                console.log("Registration Fees:", registrationFees);
                console.log("Other Charge:", otherCharge);
                console.log("Amount to send:", actual);

                console.log(response);
                alert("✅ Payment details saved to ExtraDetail!");
                const receiptPayload = {
                    ReceiptNumber: receiptNo,
                    ReceiptDate: new Date().toISOString().split('T')[0],
                    MembershipID: parseInt(selectedId),
                    ReceivedAmount: actual, // ✅ Yeh sahi hai
                    PaymentMode: paymentMode,
                    PaymentType: paymentType,
                    ChequeNumber: chequeNo,
                    BankName: bankName,
                    PaymentYear: null,
                };

                console.log(receiptPayload);

                const receiptRes = await axios.post("http://localhost:5000/Ohkla/ReceiptOfPayment", receiptPayload);
                console.log("✅ Receipt added:", receiptRes.data);


                // ✅ Reset form values
                setCompanyName("");
                setAmountPaid(updatedPaid.toFixed(2));
                setDueAmount(updatedDue.toFixed(2));
                setNewPayment("");
                setReceiptNo(`REC-${Math.floor(100 + Math.random() * 900)}`);
                setChequeNo("");
                setChequeDate("");
                setBankName("");
                setPaymentMode("");
                setAdditionalPayable("");
                setRemark("");
            }
        } catch (err) {
            console.error("❌ Error while saving payment:", err.response || err.message);
            alert("❌ Failed to save payment details. Please try again.");
        }
    };

    return (
        <div className="container my-4 p-4 bg-light rounded shadow" style={{ maxWidth: "900px" }} autoComplete="off">
            <h2 className="text-center mb-4 text-primary">Add Payment Details</h2>

            <div className="row align-items-end mb-3 gx-3">
                <InputSelect
                    label={<><span>Payment Type</span> <span className="star">*</span></>}
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    options={["", "Annual", "Registration", "Other"]}
                    required={true}
                />

                <div className="col-md-5">
                    <label className="form-label">Company Name  <span className="star">*</span></label>
                    <select className="form-select" onChange={(e) => setSelectedId(e.target.value)} value={selectedId}>
                        <option value="" required={true}>Select</option>
                        {companies.map((comp) => (
                            <option key={comp.MembershipID} value={comp.MembershipID}>
                                {comp.CompanyName}
                            </option>
                        ))}
                    </select>
                </div>

                {paymentType !== "Registration" && paymentType !== "Other" && (
                    <div className="col-md-3">
                        <label className="form-label">
                            Payment Year <span className="star">*</span>
                        </label>
                        <select
                            className="form-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            required={true}
                        >
                            <option value="">Select Year</option>
                            {years.map((y, i) => (
                                <option key={i} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="col-md-2 d-grid">
                    <button onClick={fetchMember} className="btn btn-primary" disabled={isLoadingData}>
                        {isLoadingData ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>

            <hr />

            <div className="row g-3">
                <InputField label="Member ID" value={member.MembershipID || ""} readOnly />
                <InputField label="Company Name" value={member.CompanyName || ""} readOnly />
                <InputField label="Member Name" value={member.MemberName || ""} readOnly />
                <InputField label="Email" value={member.Email || ""} readOnly />
                <InputField label="Member Since" value={member.MemberSince || ""} readOnly />
                <InputField label="Contact No." value={member.ContactNumber || ""} readOnly />

                {paymentType !== "Registration" && paymentType !== "Other" && (
                    <>
                        <InputField
                            label="Total Amount"
                            type="number"
                            value={totalAmount}
                            readOnly={!isNewTotalAmountEditable}
                            onChange={isNewTotalAmountEditable ? handleTotalAmountChange : undefined}
                        />

                        <InputField
                            label="Amount Paid"
                            type="number"
                            value={amountPaid}
                            readOnly
                        />

                        <InputField
                            label="Due Amount"
                            type="number"
                            value={dueAmount}
                            readOnly
                        />
                    </>
                )}
                <InputSelect
                    label={<><span>Payment Mode</span> <span className="star">*</span></>} value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    options={["", "UPI", "Online", "Cash", "Cheque"]}
                    required
                />
                <InputField label="Receipt No." value={receiptNo} readOnly />

                {paymentMode === "Cheque" && (
                    <>
                        <InputField
                            label={
                                <>
                                    <span>Cheque No.</span> <span className="star" style={{ color: "red", marginLeft: 4 }}>*</span>
                                </>
                            }
                            value={chequeNo}
                            onChange={(e) => setChequeNo(e.target.value)}
                        />
                        <InputField
                            label={
                                <>
                                    <span>Cheque Receive On</span> <span className="star" style={{ color: "red", marginLeft: 4 }}>*</span>
                                </>
                            }
                            type="date"
                            value={chequeDate}
                            onChange={(e) => setChequeDate(e.target.value)}
                        />

                        <InputField
                            label={
                                <>
                                    <span>Bank</span> <span className="star" style={{ color: "red", marginLeft: 4 }}>*</span>
                                </>
                            }
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                        />
                    </>
                )}
                {/* {(paymentType === "Registration" || paymentType === "Other") && (
                    <InputField
                        label={
                            <>
                                <span>
                                    {paymentType === "Registration" ? "Registration Fees" : "Other Charge"}
                                </span>
                                <span className="star">*</span>
                            </>
                        }
                        type="number"
                        value={registrationFees}
                        readOnly
                    />
                )} */}
                {paymentType === "Other" && (
                    <InputField
                        label={<>Other Charge <span className="star">*</span></>}
                        type="number"
                        value={otherCharge}  // 👈 VERY IMPORTANT
                        onChange={(e) => setOtherCharge(Number(e.target.value))}
                    />
                )}
                {paymentType === "Registration" && (
                    <InputField
                        label={<>Registration Amount <span className="star">*</span></>}
                        type="number"
                        value={registrationFees}
                        onChange={(e) => setRegistrationAmount(Number(e.target.value))}
                    />
                )}
                {paymentType === "Annual" && (
                    <div className="col-12 col-md-6">
                        <label className="form-label fw-bold">Payable<span className="star">*</span></label>
                        <input
                            type="number"
                            className="form-control"
                            value={newPayment}
                            onChange={(e) => handleNewPaymentChange(e.target.value)}
                            required
                        />
                    </div>
                )}
                {paymentType !== "Annual" && (
                    <InputField
                        label={<><span>Remark</span> <span className="star">*</span></>} value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        required
                    />
                )}
            </div>
            <div className="mt-4 text-center">
                <button onClick={handleSave} className="btn btn-success btn-lg px-5" disabled={isLoadingData}>
                    Save
                </button>
            </div>
        </div>
    );
}
function InputField({ label, value, onChange, readOnly = false, type = "text" }) {
    return (
        <div className="col-12 col-md-6">
            <label className="form-label">{label}</label>
            <input type={type} className="form-control" value={value} onChange={onChange} readOnly={readOnly} />
        </div>
    );
}
function InputSelect({ label, value, onChange, options }) {
    return (
        <div className="col-12 col-md-6">
            <label className="form-label">{label}</label>
            <select className="form-select" value={value} onChange={onChange}>
                {options.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt === "" ? "Select" : opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PaymentForm;
