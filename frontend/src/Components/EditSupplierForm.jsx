import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './Supplier/SupplierForm/SupplierForm.css';

function EditSupplierForm(){

    const {id} = useParams();                      // Get the ID of supplier from URL
    const navigate = useNavigate();                // Hook to navigate after edit submission

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
    
    // Fetch existing supplier data
    useEffect(()=>{
        const fetchSupplier = async() =>{
            const response = await fetch(`http://localhost:5000/api/suppliers/${id}/`) 

            if(response.ok){
                const json = await response.json()
                setSname(json.supplierName)
                setCname(json.companyName);
                setPhonenum(json.phoneNum);
                setEmail(json.email);
                setPaid(json.paid);
                setUnitPrice(json.unitPrice)
                setQuantity(json.quantity)
                setTotamount(json.totAmount);
                setPnme(json.pName);
            }
            else{
                setError("Supplier data loading failed !")
            }
        }

        fetchSupplier()
    }, [id])

    // Form validation
    const formValidation = () =>{

        const nameStructure = /^[A-Za-z\s]+$/;
        const phoneStructure = /^0\d{9}$/;
        const emailStructure = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!nameStructure.test(sname.trim()) || sname.trim().length < 3){
            return "Your name is invalid, Please enter again";
        }

        if(!nameStructure.test(cname.trim()) || cname.trim().length < 2){
            return "Your company name is invalid, please enter again";
        }

        if(!phoneStructure.test(phonenum)){
            return "Enter a valid phone number"
        }

        if(!emailStructure.test(email)){
            return "Please enter a valid email address";
        }

        if(isNaN(unitPrice) || Number(unitPrice) < 0){
            return "Unit Price should be a positive number";
        }

        if(isNaN(quantity) || Number(quantity) < 0){
            return "Quantity should be a positive number";
        }

        if(!nameStructure.test(pnme.trim()) || pnme.trim().length < 3){
            return "Your name is invalid, Please enter again";
        }
    }


    // Recalculate totalAmount when unitPrice or quantity changes

    useEffect(() => {
        if (unitPrice && quantity) {
            setTotamount(unitPrice * quantity);
        }
    }, [unitPrice, quantity]);


    const handleSubmit = async (e)=>{
        e.preventDefault()

        const formValidationError = formValidation();
        if(formValidationError){
            setError(formValidationError);
            return;
        }

        const updatedSupplier = {supplierName: sname, companyName: cname, phoneNum: phonenum, email, paid, totAmount: Number(totamount),unitPrice, quantity, pName: pnme }

        const response = await fetch(`http://localhost:5000/api/suppliers/${id}/` , {
            method: 'PUT',
            body: JSON.stringify(updatedSupplier),
            headers: {'Content-Type': 'application/json'}
          });

          const json = await response.json()

            if (!response.ok) {
                setError(json.error)
            }
            if (response.ok) {

                setError(null)
                console.log('Supplier Updated:', json)

                alert("Supplier Edited succesfully !");

                
                setTimeout(() =>{

                    navigate('/supplier')

                }, 450)

                
            }
        
    }


    return(
        <div className="supplier-form">
            <div className="supplier-form__container">
                <h1 className="supplier-form__header">Edit Supplier</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="supplier-form__section">
                        <h2 className="supplier-form__section-title">Basic Information</h2>
                        
                        <div className="supplier-form__group">
                            <label className="supplier-form__label">Supplier's Name: </label>
                            <input
                                className="supplier-form__input"
                                type="text"
                                onChange={(e) => setSname(e.target.value)}
                                value={sname}
                                placeholder="Enter supplier name"
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label">Company Name: </label>
                            <input
                                className="supplier-form__input"
                                type="text"
                                onChange={(e) => setCname(e.target.value)}
                                value={cname}
                                placeholder="Enter company name"
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label">Phone Number:</label>
                            <input
                                className="supplier-form__input"
                                type="tel"
                                onChange={(e) => setPhonenum(e.target.value)}
                                value={phonenum}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label">Email Address:</label>
                            <input
                                className="supplier-form__input"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                placeholder="Enter email address"
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
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="supplier-form__group">
                            <label className="supplier-form__label">Quantity (kg / packets):</label>
                            <input
                                className="supplier-form__input"
                                type="number"
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                value={quantity}
                                placeholder="0"
                                min="1"
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
                                placeholder="Enter product name"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="supplier-form__submit"
                    >
                        Save Changes
                    </button>
                    {error && <div className="supplier-form__error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default EditSupplierForm