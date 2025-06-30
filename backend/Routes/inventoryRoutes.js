const express  = require('express');
const { addProduct, deleteProduct, getAllProducts, getById, updateProduct }  = require('../Controllers/inventoryController');

const inventoryRouter = express.Router();

inventoryRouter.get('/getAllProducts', getAllProducts);
inventoryRouter.post('/addProduct', addProduct);
inventoryRouter.get('/getById/:P_Code', getById);
inventoryRouter.put('/updateProduct/:P_Code', updateProduct);
inventoryRouter.delete('/deleteProduct/:P_Code', deleteProduct);

module.exports =  inventoryRouter;