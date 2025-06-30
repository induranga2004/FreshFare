import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import './UpdateItem.css'
import { toast } from 'react-toastify';
import { FaBox, FaTag, FaLayerGroup, FaBoxes, FaDollarSign, FaUser, FaExclamationTriangle } from 'react-icons/fa';

function UpdateItem() {
    const { P_Code } = useParams();
    const navigate = useNavigate();
    const [imageURL,setimageURL] = useState('');
    const [pcode, setpcode] = useState('');
    const [pname, setpname] = useState('');
    const [category, setcategory] = useState('');
    const [quantity, setquantity] = useState('');
    const [Pprice, setPprice] = useState('');
    const [Sprice, setSprice] = useState('');
    const [suplier, setsuplier] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/getById/${P_Code}`);
                const product = response.data.product;
                setimageURL(product.image)
                setpcode(product.P_Code);
                setpname(product.P_Name);
                setcategory(product.P_category);
                setquantity(product.Quantity);
                setPprice(product.Purchase_Price);
                setSprice(product.Selling_Price);
                setsuplier(product.Suplier_Name);
                
            } catch (error) {
                setError('Error fetching product.'+error);
            }
        };
        fetchProduct();
    }, [P_Code]);

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
            await axios.put(`http://localhost:5000/api/products/updateProduct/${P_Code}`, {
                P_Code: pcode,
                P_Name: pname,
                P_category: category,
                Quantity: quantity,
                Purchase_Price: Pprice, 
                Selling_Price: Sprice,
                Suplier_Name: suplier,
                image:imageURL
            });
            toast.success("Product updated successfully!");
            navigate("/displayitem");
        } catch (error) {
            setError('Failed to update product.'+error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-item-container">
            <form className="update-item-card" id="itemForm" onSubmit={handlesubmit} autoComplete="off">
                <div className="title-icon">
                    <FaBox size={40} color="#667eea" />
                </div>
                <h2>Update Product</h2>
                <div className="input-group">
                    <div className="input-icon">
                        <FaTag className="icon" />
                    </div>
                    <Input
                        label="Product image URL"
                        type="text"
                        value={imageURL}
                        onChange={(e) => { setimageURL(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>
                <div className="input-group">
                    <div className="input-icon">
                        <FaTag className="icon" />
                    </div>
                    <Input
                        label="Product Code"
                        type="text"
                        id="P_Code"
                        name="P_Code"
                        value={pcode}
                        onChange={(e) => { setpcode(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <FaBox className="icon" />
                    </div>
                    <Input
                        label="Product Name"
                        type="text"
                        id="P_Name"
                        name="P_Name"
                        value={pname}
                        onChange={(e) => { setpname(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                <div className="update-item-select-group">
                    <div className="input-icon">
                        <FaLayerGroup className="icon" />
                    </div>
                    <label htmlFor="P_category" className="update-item-label">Product Category</label>
                    <select
                        id="P_category"
                        name="P_category"
                        value={category}
                        onChange={(e) => { setcategory(e.target.value) }}
                        required
                        className="update-item-select"
                    >
                        <option value="" disabled>Select Item Category</option>
                        <option value="Vegitables & Fruits">Vegetables & Fruits</option>
                        <option value="Milk & Juice Items">Milk & Juice Items</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Food Items">Food Items</option>
                        <option value="Chocolate Items">Chocolate Items</option>
                        <option value="Herble Products">Herbal Products</option>
                        <option value="School Items">School Items</option>
                    </select>
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <FaBoxes className="icon" />
                    </div>
                    <Input
                        label="Product Quantity"
                        type="number"
                        id="Quantity"
                        name="Quantity"
                        value={quantity}
                        onChange={(e) => { setquantity(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <FaDollarSign className="icon" />
                    </div>
                    <Input
                        label="Purchase Price (Rs)"
                        type="number"
                        id="Purchase_Price"
                        name="Purchase_Price"
                        value={Pprice}
                        onChange={(e) => { setPprice(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <FaDollarSign className="icon" />
                    </div>
                    <Input
                        label="Selling Price (Rs)"
                        type="number"
                        id="Selling_Price"
                        name="Selling_Price"
                        value={Sprice}
                        onChange={(e) => { setSprice(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <FaUser className="icon" />
                    </div>
                    <Input
                        label="Supplier Name"
                        type="text"
                        id="Suplier_Name"
                        name="Suplier_Name"
                        value={suplier}
                        onChange={(e) => { setsuplier(e.target.value) }}
                        required
                        fullWidth
                    />
                </div>

                {error && (
                    <div className="update-item-error">
                        <FaExclamationTriangle className="error-icon" />
                        {error}
                    </div>
                )}
                
                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth 
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </div>
    )
}

export default UpdateItem
