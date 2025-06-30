import React, { useState } from 'react';
import axios from 'axios';
import Button from '../UI/Button';
import Input from '../UI/Input';
import "./AddItem.css";
import { toast } from 'react-toastify';

function AddItem() {
    const [imageURL,setimageURL] = useState('')
    const [pcode, setpcode] = useState('');
    const [pname, setpname] = useState('');
    const [quantity, setquantity] = useState(0);
    const [category, setcategory] = useState("");
    const [Pprice, setPprice] = useState('');
    const [Sprice, setSprice] = useState('');
    const [suplier, setsuplier] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!pcode) {
            setError('Product code is required.');
            toast.error('Product code is required.');
            return false;
        }
        if (!pname || !pname.match(/^[A-Za-z\s]+$/)) {
            setError('Product name must contain only letters.');
            toast.error('Product name must contain only letters.');
            return false;
        }
        if (!category) {
            setError('Product category is required.');
            toast.error('Product category is required.');
            return false;
        }
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            setError('Product quantity must be greater than 0.');
            toast.error('Product quantity must be greater than 0.');
            return false;
        }
        if (!Pprice || isNaN(Pprice) || Number(Pprice) <= 0) {
            setError('Purchase price must be greater than 0.');
            toast.error('Purchase price must be greater than 0.');
            return false;
        }
        if (!Sprice || isNaN(Sprice) || Number(Sprice) <= 0) {
            setError('Selling price must be greater than 0.');
            toast.error('Selling price must be greater than 0.');
            return false;
        }
        if (!suplier || !suplier.match(/^[A-Za-z\s]+$/)) {
            setError('Supplier name must contain only letters.');
            toast.error('Supplier name must contain only letters.');
            return false;
        }
        return true;
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/api/products/addProduct", {
                P_Code: pcode,
                P_Name: pname,
                Quantity: quantity,
                P_category: category,
                Purchase_Price: Pprice, 
                Selling_Price: Sprice,
                Suplier_Name: suplier,
                image:imageURL
            });
            toast.success("Product inserted successfully");
            setpcode('');
            setquantity(0);
            setpname('');
            setcategory("");
            setPprice(0);
            setSprice(0);
            setsuplier(0);
            setimageURL('');
        } catch (error) {
            setError('Failed to add product. Please try again.'+ error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="add-item-container">
            <form className="add-item-card" id="itemForm" onSubmit={handlesubmit} autoComplete="off">
                <h2>Add Product</h2>
                <Input
                    label="Product Code"
                    type="text"
                    id="P_Code"
                    name="P_Code"
                    value={pcode}
                    onChange={(e) => setpcode(e.target.value)}
                    required
                    fullWidth
                />
                <Input
                    label="Product Name"
                    type="text"
                    id="P_Name"
                    name="P_Name"
                    value={pname}
                    onChange={(e) => setpname(e.target.value)}
                    required
                    fullWidth
                />
                <Input
                    label="Product image URL: "
                    type="String"
                    value={imageURL}
                    onChange={(e) => { setimageURL(e.target.value) }}
                    required
                    fullWidth
                />
                <div className="add-item-select-group">
                    <label htmlFor="P_category" className="add-item-label">Product Category</label>
                    <select
                        id="P_category"
                        name="P_category"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                        required
                        className="add-item-select"
                    >
                        <option value="" disabled>Select Item Category</option>
                        <option value="Vegitables & Fruits">Vegitables & Fruits</option>
                        <option value="Milk & Juice Items">Milk & Juice Items</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Food Items">Food Items</option>
                        <option value="Chocolate Items">Chocolate Items</option>
                        <option value="Herble Products">Herble Products</option>
                        <option value="School Items">School Items</option>
                    </select>
                </div>
                <Input
                    label="Product Quantity"
                    type="number"
                    id="Quantity"
                    name="Quantity"
                    value={quantity}
                    onChange={(e) => setquantity(e.target.value)}
                    required
                    fullWidth
                />
                <Input
                    label="Product Purchase Price Rs:"
                    type="number"
                    id="Purchase_Price"
                    name="Purchase_Price"
                    value={Pprice}
                    onChange={(e) => { setPprice(e.target.value) }}
                    required
                    fullWidth
                />

                <Input
                    label="Product Selling Price (Per unit) Rs:"
                    type="number"
                    id="Selling_Price"
                    name="Selling_Price"
                    value={Sprice}
                    onChange={(e) => { setSprice(e.target.value) }}
                    required
                    fullWidth
                />

                <Input
                    label="Suplier Name: "
                    type="String"
                    id="Suplier_Name"
                    name="Suplier_Name"
                    value={suplier}
                    onChange={(e) => { setsuplier(e.target.value) }}
                    required
                    fullWidth
                />
                {error && <div className="add-item-error">{error}</div>}
                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                    {loading ? 'Adding...' : 'Submit'}
                </Button>
            </form>
        </div>
    )
}

export default AddItem
