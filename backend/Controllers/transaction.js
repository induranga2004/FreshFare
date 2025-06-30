const service = require("../services/transaction")

const createtransaction = async(req,res) =>{
            const body = req.body;
            try{
                await service.createtransaction(body);
                return res.status(201).json({message:"Transaction created successfully"}); 
            }catch(error)
            {
                return res.status(404).json({message:error.message});
            }
}

const getDailyTransactions = async(req, res) => {
    try {
        const transactions = await service.getDailyTransactions();
        return res.status(200).json(transactions);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = {createtransaction, getDailyTransactions}