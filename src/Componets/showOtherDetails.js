import React, { useEffect, useState } from "react";
import axios from "axios";

const OtherPaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [search, setSearch] = useState({
        MembershipID: "",
        CompanyName: "",
        PaymentCategory: "",
        Amount: "",
        ReceiptNumber: "",
        Remark: "",
    });

    useEffect(() => {
        fetchOtherPayments();
    }, []);

    const fetchOtherPayments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/Ohkla/getAllOtherPayments");
            const sorted = res.data.sort((a, b) => a.MembershipID - b.MembershipID);
            setPayments(sorted);
            setFilteredPayments(sorted);
        } catch (err) {
            console.error("❌ Failed to fetch OtherPayments:", err.message);
        }
    };

    const handleSearch = (e, field) => {
        const value = e.target.value;
        setSearch((prev) => ({ ...prev, [field]: value }));

        const filtered = payments.filter((p) =>
            String(p[field] || "")
                .toLowerCase()
                .includes(value.toLowerCase())
        );

        setFilteredPayments(filtered);
    };

    const getCategoryBadge = (category) => {
        switch (category?.toLowerCase()) {
            case 'registration':
                return <span className="badge bg-success">{category}</span>;
            case 'other':
                return <span className="badge bg-warning text-dark">{category}</span>;
            default:
                return <span className="badge bg-secondary">{category}</span>;
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm rounded">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">🧾 Other Payments Summary</h4>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0 text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>
                                        Membership ID<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "MembershipID")}
                                            value={search.MembershipID}
                                            placeholder="Search Membership ID"
                                        />
                                    </th>
                                    <th>
                                        Company Name<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "CompanyName")}
                                            value={search.CompanyName}
                                            placeholder="Search Company"
                                        />
                                    </th>
                                    <th>
                                        Category<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "PaymentCategory")}
                                            value={search.PaymentCategory}
                                            placeholder="Search Category"
                                        />
                                    </th>
                                    <th>
                                        Amount<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "Amount")}
                                            value={search.Amount}
                                            placeholder="Search Amount"
                                        />
                                    </th>
                                    <th>
                                        Receipt No.<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "ReceiptNumber")}
                                            value={search.ReceiptNumber}
                                            placeholder="Search Receipt No."
                                        />
                                    </th>
                                    <th>
                                        Remark<br />
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            onChange={(e) => handleSearch(e, "Remark")}
                                            value={search.Remark}
                                            placeholder="Search Remark"
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((p, index) => (
                                        <tr key={p.ID || index}>
                                            <td>{index + 1}</td>
                                            <td>{p.MembershipID}</td>
                                            <td>{p.CompanyName}</td>
                                            <td>{getCategoryBadge(p.PaymentCategory)}</td>
                                            <td>₹{parseFloat(p.Amount).toFixed(2)}</td>
                                            <td>{p.ReceiptNumber}</td>
                                            <td>{p.Remark || "-"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted p-3">
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherPaymentsTable;
