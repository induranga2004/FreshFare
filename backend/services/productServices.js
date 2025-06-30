const product = require("../Models/InventoryModel")
const productSearch  = async(details)=>{
    const {Barcode} = details;
    if(!Barcode)
    {
        throw new Error("you must include barcode");
    }
    const products = await product.findOne({P_Code:Barcode})
    return products
}
const updateproductbycashier = async(item) =>{
        const {items}=item
        if(!items)
        {
            throw new Error("No products");
        }
        else{
            for(let i=0;i<items.length;i++)
            {
                const productname = items[i].productname;
                const quantity = items[i].quantity;
                const existproduct = await product.findOne({P_Name:productname})
                if(!existproduct)
                {
                    throw new Error("The product is not in the inventory");
                }
                else
                {
                    existproduct.Quantity=existproduct.Quantity- parseInt(quantity);
                    await existproduct.save()
                } 
            }
        }
}
module.exports = {productSearch,updateproductbycashier}