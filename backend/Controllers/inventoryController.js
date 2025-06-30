const  inventoryModel  = require("../Models/InventoryModel");

// Add a product
const addProduct = async (req, res) => {
    const { P_Code, P_Name, Quantity, P_category, Purchase_Price, Selling_Price, Suplier_Name,image } = req.body;

    let product;

    try {
        product = new inventoryModel({ P_Code, P_Name, Quantity, P_category, Purchase_Price, Selling_Price, Suplier_Name,image});
        await product.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error adding product" });
    }

    if (!product) {
        return res.status(400).json({ message: "Unable to add product" });
    }

    return res.status(201).json({ product });
};

// Get all products
const getAllProducts = async (req, res) => {
    let product;
    try {
        product = await inventoryModel.find();
        return res.status(200).json({ product })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Product not found"});
    }
    
};

// Get product by P_Code
const getById = async (req, res) => {
    const code = req.params.P_Code;

    let product;
    try {
        product = await inventoryModel.findOne({ P_Code: code });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error retrieving product" });
    }

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
};

// Update a product

const updateProduct = async(req, res)=>{

    const code = req.params.P_Code;

    const { P_Code, P_Name, Quantity, P_category, Purchase_Price, Selling_Price, Suplier_Name,image} = req.body;

    let product;

    try {
        product = await inventoryModel.findOneAndUpdate( {P_Code: code }, 
            { P_Code: P_Code, P_Name: P_Name, Quantity: Quantity, P_category:P_category, Purchase_Price:Purchase_Price, Selling_Price:Selling_Price, Suplier_Name:Suplier_Name,image:image});
            await product.save();

    } catch (error) {
        console.log(error);
    }

    if (!product) {
        return res.status(404).json({ message: "Unable to update Product Details" });
    }

    return res.status(200).json({ product });

};


// Delete a product

const deleteProduct = async(req, res)=>{
    
    const code = req.params.P_Code;
    let product;

    try {
        product = await inventoryModel.findOneAndDelete({P_Code: code })
    } catch (error) {
        console.log(error);
    }

    if (!product) {
        return res.status(404).json({ message: "Unable to delete Product Details" });
    }

    return res.status(200).json({ product });
}
module.exports = {addProduct,getAllProducts,getById,updateProduct,deleteProduct}