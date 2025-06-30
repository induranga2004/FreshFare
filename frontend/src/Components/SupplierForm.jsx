import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Supplier/SupplierForm/SupplierForm.css";

function SupplierForm() {
  const [sname, setSname] = useState("");
  const [cname, setCname] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [email, setEmail] = useState("");
  const [paid, setPaid] = useState(false);
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totamount, setTotamount] = useState("");
  const [pnme, setPnme] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formValidation = () => {
    const nameStructure = /^[A-Za-z\s]+$/;
    const phoneStructure = /^0\d{9}$/;
    const emailStructure = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameStructure.test(sname.trim()) || sname.trim().length < 3) {
      return "Your name is invalid, Please enter again";
    }

    if (!nameStructure.test(cname.trim()) || cname.trim().length < 3) {
      return "Your company name is invalid, please enter again";
    }

    if (!phoneStructure.test(phonenum)) {
      return "Enter a valid phone number";
    }

    if (!emailStructure.test(email)) {
      return "Please enter a valid email address";
    }

    if (isNaN(unitPrice) || Number(unitPrice) < 0) {
      return "Unit Price should be a positive number";
    }

    if (isNaN(quantity) || Number(quantity) < 0) {
      return "Quantity should be a positive number";
    }

    if (!nameStructure.test(pnme.trim()) || pnme.trim().length < 3) {
      return "Product name is invalid, Please enter again";
    }
  };

  useEffect(() => {
    if (unitPrice && quantity) {
      setTotamount(unitPrice * quantity);
    }
  }, [unitPrice, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValidationError = formValidation();
    if (formValidationError) {
      setError(formValidationError);
      return;
    }

    const supplier = {
      supplierName: sname,
      companyName: cname,
      phoneNum: phonenum,
      email,
      paid,
      totAmount: Number(totamount),
      unitPrice,
      quantity,
      pName: pnme,
    };

    const response = await fetch("http://localhost:5000/api/suppliers/", {
      method: "POST",
      body: JSON.stringify(supplier),
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setError(null);
      setSname("");
      setCname("");
      setPhonenum("");
      setEmail("");
      setPaid(false);
      setUnitPrice("");
      setQuantity("");
      setTotamount("");
      setPnme("");
      console.log("New supplier added:", json);

      alert("Supplier Added successfully!");

      setTimeout(() => {
        navigate("/supplier");
      }, 450);
    }
  };

  return (
    <div className="supplier-form">
      <div className="supplier-form__container">
        <h1 className="supplier-form__header">Add a new supplier</h1>
        <form onSubmit={handleSubmit}>
          <div className="supplier-form__section">
            <h2 className="supplier-form__section-title">Basic Information</h2>
            <div className="supplier-form__group">
              <label className="supplier-form__label">Supplier's Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                onChange={(e) => setSname(e.target.value)}
                value={sname}
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Company Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                onChange={(e) => setCname(e.target.value)}
                value={cname}
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Phone Number:</label>
              <input
                className="supplier-form__input"
                type="tel"
                onChange={(e) => setPhonenum(e.target.value)}
                value={phonenum}
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Email Address:</label>
              <input
                className="supplier-form__input"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="supplier-form__section">
            <h2 className="supplier-form__section-title">Payment Details</h2>
            <div className="supplier-form__group">
              <label className="supplier-form__label">Payment Status:</label>
              <select 
                className="supplier-form__select"
                onChange={(e) => setPaid(e.target.value === "true")} 
                value={paid}
              >
                <option value="false">Not Paid</option>
                <option value="true">Paid</option>
              </select>
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Unit Price (LKR):</label>
              <input
                className="supplier-form__input"
                type="number"
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                value={unitPrice}
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Quantity (kg / packets):</label>
              <input
                className="supplier-form__input"
                type="number"
                onChange={(e) => setQuantity(Number(e.target.value))}
                value={quantity}
              />
            </div>

            <div className="supplier-form__total">
              <span className="supplier-form__total-label">Total Amount (LKR):</span>
              <span className="supplier-form__total-value">{totamount || 0}</span>
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Product Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                onChange={(e) => setPnme(e.target.value)}
                value={pnme}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="supplier-form__submit"
          >
            Add Supplier
          </button>
          {error && <div className="supplier-form__error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default SupplierForm;