import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Components/Supplier/SupplierForm/SupplierForm.css";

function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    companyName: "",
    phoneNum: "",
    email: "",
    paid: false,
    unitPrice: "",
    quantity: "",
    totAmount: "",
    pName: "",
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/suppliers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch supplier data');
        }
        const data = await response.json();
        
        setFormData({
          supplierName: data.supplierName || "",
          companyName: data.companyName || "",
          phoneNum: data.phoneNum || "",
          email: data.email || "",
          paid: data.paid || false,
          unitPrice: data.unitPrice || "",
          quantity: data.quantity || "",
          totAmount: data.totAmount || "",
          pName: data.pName || "",
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching supplier:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const formValidation = () => {
    const nameStructure = /^[A-Za-z\s]+$/;
    const phoneStructure = /^0\d{9}$/;
    const emailStructure = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameStructure.test(formData.supplierName.trim()) || formData.supplierName.trim().length < 3) {
      return "Supplier name is invalid, Please enter again";
    }

    if (!nameStructure.test(formData.companyName.trim()) || formData.companyName.trim().length < 3) {
      return "Company name is invalid, please enter again";
    }

    if (!phoneStructure.test(formData.phoneNum)) {
      return "Enter a valid phone number";
    }

    if (!emailStructure.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (isNaN(formData.unitPrice) || Number(formData.unitPrice) < 0) {
      return "Unit Price should be a positive number";
    }

    if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      return "Quantity should be a positive number";
    }

    if (!nameStructure.test(formData.pName.trim()) || formData.pName.trim().length < 3) {
      return "Product name is invalid, Please enter again";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
      totAmount: name === 'unitPrice' || name === 'quantity' 
        ? (Number(name === 'unitPrice' ? value : prev.unitPrice) * Number(name === 'quantity' ? value : prev.quantity)).toString()
        : prev.totAmount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = formValidation();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/suppliers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      alert("Supplier updated successfully!");
      navigate("/supplier");
    } catch (err) {
      setError(err.message);
      console.error("Error updating supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="supplier-form">
        <div className="supplier-form__container">
          <div className="supplier-form__loading">Loading supplier data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-form">
      <div className="supplier-form__container">
        <h1 className="supplier-form__header">Edit Supplier</h1>
        <form onSubmit={handleSubmit}>
          <div className="supplier-form__section">
            <h2 className="supplier-form__section-title">Basic Information</h2>
            <div className="supplier-form__group">
              <label className="supplier-form__label">Supplier's Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Company Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Phone Number:</label>
              <input
                className="supplier-form__input"
                type="tel"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Email Address:</label>
              <input
                className="supplier-form__input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="supplier-form__section">
            <h2 className="supplier-form__section-title">Payment Details</h2>
            <div className="supplier-form__group">
              <label className="supplier-form__label">Payment Status:</label>
              <select 
                className="supplier-form__select"
                name="paid"
                value={formData.paid}
                onChange={handleInputChange}
              >
                <option value={false}>Not Paid</option>
                <option value={true}>Paid</option>
              </select>
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Unit Price (LKR):</label>
              <input
                className="supplier-form__input"
                type="number"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Quantity (kg / packets):</label>
              <input
                className="supplier-form__input"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="supplier-form__total">
              <span className="supplier-form__total-label">Total Amount (LKR):</span>
              <span className="supplier-form__total-value">{formData.totAmount || 0}</span>
            </div>

            <div className="supplier-form__group">
              <label className="supplier-form__label">Product Name:</label>
              <input
                className="supplier-form__input"
                type="text"
                name="pName"
                value={formData.pName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {error && <div className="supplier-form__error">{error}</div>}
          
          <div className="supplier-form__actions">
            <button 
              type="submit"
              className="supplier-form__submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Supplier"}
            </button>
            <button 
              type="button"
              className="supplier-form__button supplier-form__button--cancel"
              onClick={() => navigate("/supplier")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSupplier; 