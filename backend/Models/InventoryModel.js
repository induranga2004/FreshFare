const mongoose =  require("mongoose");

const inventorySchema = new mongoose.Schema({
    P_Code: {
        type: String,
        required: true,
        unique:true
    },
    P_Name: {
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    Quantity: {
        type: Number,
        required: true
    },
    P_category: {
        type: String,
        required: true
    },
    Selling_Price: {
        type: Number,  
        required: true
    },

    Purchase_Price: {
        type: Number,  
        required: true
    },

    Suplier_Name: {
        type: String,  
        required: true
    }
    
});

const inventoryModel = mongoose.model('inventory', inventorySchema);

module.exports =  inventoryModel;
