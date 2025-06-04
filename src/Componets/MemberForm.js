
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const MemberForm = () => {
    const [formData, setFormData] = useState({
        MemberName: '',
        CompanyName: '',
        ContactNumber: '',
        Email: '',
        GSTNo: '',
        UdhyamAadhar: '',
        RegistrationDate: '',
        MemberSince: '',
        Address1: '',
        Address2: '',
        Area: '',
        City: '',
        State: '',
        IsActive: true,
        // UpdatedDate: '',
        Owner: '',
        Category: '',
        PrinterCategory: []
    });

    const [errors, setErrors] = useState({});
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const res = await axios.get('http://localhost:5000/Ohkla/getYearRange');
                if (res.data.years && res.data.years.length > 0) {
                    setYears(res.data.years);
                    setSelectedYear(res.data.years[0]); // default latest year
                }
            } catch (error) {
                console.error('Error fetching years:', error);
            }
        };
        fetchYears();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePrinterCategoryChange = (selectedOptions) => {
        const values = selectedOptions.map(option => option.value);
        setFormData({ ...formData, PrinterCategory: values });
    };

    const validate = () => {
        let tempErrors = {};

        if (!formData.MemberName.trim()) tempErrors.MemberName = "Member Name is required";
        if (!formData.CompanyName.trim()) tempErrors.CompanyName = "Company Name is required";
        if (!formData.ContactNumber.trim()) tempErrors.ContactNumber = "Contact Number is required";
        if (!formData.Email.trim()) tempErrors.Email = "Email is required";
        if (!formData.RegistrationDate) tempErrors.RegistrationDate = "Registration Date is required";
        if (!formData.State) tempErrors.State = "State/UT is required";
        if (!formData.Category) tempErrors.Category = "Category is required";
        if (!formData.Owner.trim()) tempErrors.Owner = "Owner is required";

        if (!/^\d{10}$/.test(formData.ContactNumber)) {
            tempErrors.ContactNumber = 'Contact number must be exactly 10 digits';
        }

        if (formData.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            tempErrors.Email = 'Invalid email format';
        }

        if (formData.GSTNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.GSTNo)) {
            tempErrors.GSTNo = 'Invalid GST number format (e.g., 07ABCDE1234F1Z5)';
        }

        if (formData.UdhyamAadhar && !/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(formData.UdhyamAadhar)) {
            tempErrors.UdhyamAadhar = 'Invalid Udyam Aadhaar format (e.g., UDYAM-DL-00-1234567)';
        }

        // if (!formData.MemberSince.trim()) {
        //     tempErrors.MemberSince = "Member Since is required";
        // } else {
        //     // Regex for pattern: 4 digits - 4 digits
        //     const pattern = /^\d{4}-\d{4}$/;
        //     if (!pattern.test(formData.MemberSince)) {
        //         tempErrors.MemberSince = "Format must be YYYY-YYYY (e.g., 2021-2022)";
        //     } else {
        //         // Extract years and check difference
        //         const years = formData.MemberSince.split('-');
        //         const startYear = parseInt(years[0], 10);
        //         const endYear = parseInt(years[1], 10);
        //         if (endYear - startYear !== 1) {
        //             tempErrors.MemberSince = "End year must be exactly 1 year after start year";
        //         }
        //     }
        // }


        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            // const response = await axios.post('http://localhost:5000/Ohkla/Member', formData);
            // alert(response.data.message);

            const yearRes = await axios.get('http://localhost:5000/Ohkla/getYearRange');
            const years = yearRes.data.years;

            if (!years || years.length === 0) {
                alert('❌ No year available in TotalPayments table');
                return;
            }

            const latestYear = years[0]; // Pick latest year (assuming DESC order)
            console.log("📅 Inserting AnnualPayment for Year:", latestYear);

            // 3. Insert AnnualPayment for selected/latest year
            const paymentResponse = await axios.post('http://localhost:5000/Ohkla/insertAnnualPayments', formData);

            alert(paymentResponse.data.message);

            setFormData({
                MemberName: '',
                CompanyName: '',
                ContactNumber: '',
                Email: '',
                GSTNo: '',
                UdhyamAadhar: '',
                RegistrationDate: '',
                MemberSince: '',
                Address1: '',
                Address2: '',
                Area: '',
                City: '',
                State: '',
                IsActive: true,
                // UpdatedDate: '',
                Owner: '',
                Category: '',
                PrinterCategory: []
            });

            setErrors({});
        } catch (error) {
            console.error(error);
            alert('Error saving member');
        }
    };

    const printerCategoryOptions = [
        { value: 'Offset', label: 'Offset' },
        { value: 'Digital Printer', label: 'Digital Printer' },
        { value: 'Book Printer', label: 'Book Printer' },
        { value: 'Commercial Printer', label: 'Commercial Printer' },
        { value: 'Screen Printer', label: 'Screen Printer' }
    ];


    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">New Member Registration</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="row">
                            {/* Existing Fields */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label" required={true}>Member Name<span className="star">*</span></label>
                                <input type="text" name="MemberName" className="form-control" value={formData.MemberName} onChange={handleChange} autoComplete="new-password" required={true} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" required={true}>Company Name<span className="star">*</span></label>
                                <input type="text" name="CompanyName" className="form-control" autoComplete="new-password" value={formData.CompanyName} onChange={handleChange} required={true} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" required={true}>Contact Number <span className="star">*</span></label>
                                <input type="text" name="ContactNumber" autoComplete="new-password" className={`form-control ${errors.ContactNumber ? 'is-invalid' : ''}`} value={formData.ContactNumber} onChange={handleChange} required={true} />
                                {errors.ContactNumber && <div className="invalid-feedback">{errors.ContactNumber}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" required={true}>Email<span className="star">*</span></label>
                                <input type="email" name="Email" className={`form-control ${errors.Email ? 'is-invalid' : ''}`} autoComplete="new-password" value={formData.Email} onChange={handleChange} required={true} />
                                {errors.Email && <div className="invalid-feedback">{errors.Email}</div>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">GST Number</label>
                                <input type="text" name="GSTNo" className={`form-control ${errors.GSTNo ? 'is-invalid' : ''}`} autoComplete="new-password" value={formData.GSTNo} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Udhyam Aadhar</label>
                                <input type="text" name="UdhyamAadhar" className={`form-control ${errors.UdhyamAadhar ? 'is-invalid' : ''}`} autoComplete="new-password" value={formData.UdhyamAadhar} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label" >Registration Date<span className="star">*</span></label>
                                <input type="date" name="RegistrationDate" className="form-control" value={formData.RegistrationDate} autoComplete="new-password" onChange={handleChange} required={true} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Member Since</label>
                                <input type="text" name="MemberSince" className="form-control" autoComplete="new-password" value={formData.MemberSince} onChange={handleChange} />
                            </div>
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">Member Since</label>
                                <input
                                    type="text"
                                    name="MemberSince"
                                    className={`form-control ${errors.MemberSince ? 'is-invalid' : ''}`}
                                    autoComplete="new-password"
                                    value={formData.MemberSince}
                                    onChange={handleChange}
                                />
                                {errors.MemberSince && <div className="invalid-feedback">{errors.MemberSince}</div>}
                            </div> */}

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Address Line 1</label>
                                <input type="text" name="Address1" className="form-control" autoComplete="new-password" value={formData.Address1} onChange={handleChange} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Address Line 2</label>
                                <input type="text" name="Address2" className="form-control" autoComplete="new-password" value={formData.Address2} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Area</label>
                                <input type="text" name="Area" className="form-control" autoComplete="new-password" value={formData.Area} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">City</label>
                                <input type="text" name="City" className="form-control" autoComplete="new-password" value={formData.City} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">State/UT <span className="star">*</span></label>
                                <select
                                    name="State"
                                    className="form-control"
                                    value={formData.State}
                                    onChange={handleChange}
                                    required={true}
                                    autoComplete="off"
                                >
                                    <option value="">Select State/UT</option>

                                    <optgroup label="States">
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                        <option value="Assam">Assam</option>
                                        <option value="Bihar">Bihar</option>
                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                        <option value="Goa">Goa</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Haryana">Haryana</option>
                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                        <option value="Jharkhand">Jharkhand</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Manipur">Manipur</option>
                                        <option value="Meghalaya">Meghalaya</option>
                                        <option value="Mizoram">Mizoram</option>
                                        <option value="Nagaland">Nagaland</option>
                                        <option value="Odisha">Odisha</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Sikkim">Sikkim</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tripura">Tripura</option>
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Uttarakhand">Uttarakhand</option>
                                        <option value="West Bengal">West Bengal</option>
                                    </optgroup>

                                    <optgroup label="Union Territories">
                                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                        <option value="Chandigarh">Chandigarh</option>
                                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                        <option value="Ladakh">Ladakh</option>
                                        <option value="Lakshadweep">Lakshadweep</option>
                                        <option value="Puducherry">Puducherry</option>
                                    </optgroup>

                                </select>
                            </div>


                            {/* Category Dropdown */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Category<span className="star">*</span></label>
                                <select name="Category" className="form-control" value={formData.Category} onChange={handleChange} required={true}>
                                    <option value="">Select Category</option>
                                    <option value="Printer">Printer</option>
                                    <option value="Provider">Provider</option>
                                    <option value="MachineDealer">MachineDealer</option>
                                    <option value="Publisher">Publisher</option>
                                </select>
                            </div>

                            {/* Printer Category Multi Select */}
                            {formData.Category === 'Printer' && (
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Printer Category</label>
                                    <Select
                                        isMulti
                                        name="PrinterCategory"
                                        options={printerCategoryOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={handlePrinterCategoryChange}
                                        value={printerCategoryOptions.filter(option => formData.PrinterCategory.includes(option.value))}
                                    />
                                </div>
                            )}

                            <div className="col-md-4 mb-3 form-check mt-4">
                                <input type="checkbox" name="IsActive" className="form-check-input" autoComplete="new-password" checked={formData.IsActive} onChange={handleChange} />
                                <label className="form-check-label">Active</label>
                            </div>
                            {/* <div className="col-md-4 mb-3">
                                <label className="form-label">Updated Date</label>
                                <input type="date" name="UpdatedDate" className="form-control" value={formData.UpdatedDate} onChange={handleChange} />
                            </div> */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Owner<span className="star">*</span></label>
                                <input type="text" name="Owner" className="form-control" autoComplete="new-password" value={formData.Owner} onChange={handleChange} required={true} />
                            </div>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-success">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MemberForm;


