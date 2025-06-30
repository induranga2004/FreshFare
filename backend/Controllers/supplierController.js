const Supplier = require('../Models/SupplierModel');
const mongoose = require('mongoose');


//GET all suppliers
const getAllSuppliers = async(req,res) =>{
    const readAllSup = await Supplier.find({}).sort({createdAt: -1});  //created newest ones first

    res.status(200).json(readAllSup);
}



//GET a single supplier
const getSingleSupplier = async(req,res) =>{
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such a supplier !'});
    }

    const getSingleSup = await Supplier.findById(id);


    if(!getSingleSup){
        return res.status(400).json({error : 'No such a supplier !'});
    }

    res.status(200).json(getSingleSup);
}



//CREATE a new supplier
const createSupplier = async(req,res) =>{

    const{ supplierName,companyName,phoneNum,email,paid,unitPrice,quantity,pName} = req.body; 

    const totAmount = unitPrice * quantity;

    //add document to db
    try{
        const AddSupplier = await Supplier.create({supplierName,companyName,phoneNum,email,paid,unitPrice,quantity,pName, totAmount});
        res.status(200).json(AddSupplier);
    }
    catch(err){
        res.status(400).json({error: err.message});
    }
}



//DELETE a single supplier
const deleteSupplier = async(req,res) =>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such a supplier !'});
    }

    const delSupplier = await Supplier.findOneAndDelete({_id: id});

    if(!delSupplier){
        return res.status(400).json({error: 'No such a supplier !'});
    }

    res.status(200).json({message:'Supplier Deleted !', delSupplier});
}



//UPDATE a single supplier
const updateSupplier = async(req,res) =>{

    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such a supplier !'});
    }

    const { supplierName, companyName, phoneNum, email, paid, unitPrice, quantity, pName } = req.body;

    const totAmount = unitPrice * quantity; 

    try{

        const updSupplier = await Supplier.findOneAndUpdate({_id: id}, {

            supplierName, companyName, phoneNum, email, paid, unitPrice, quantity, totAmount, pName
            
        }, { new: true } )

        if(!updSupplier){
            return res.status(400).json({error: 'No such a supplier !'});
        }

        res.status(200).json({message: 'Supplier Updated !', updSupplier});

    }catch(err){
        res.status(400).json({error:err.message});
    }
}





module.exports = {createSupplier, getAllSuppliers, getSingleSupplier, deleteSupplier, updateSupplier}