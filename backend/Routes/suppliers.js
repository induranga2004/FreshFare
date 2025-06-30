const express = require('express');
const Supplier = require('../Models/SupplierModel');
const { generateReportBuffer } = require('../utils/report'); 



const {createSupplier, 
       getAllSuppliers, 
       getSingleSupplier,
       deleteSupplier,
       updateSupplier} = require('../Controllers/supplierController');

const router = express.Router();


// POST: generate supplier report
router.post('/generate-report', async (req, res) => {

  try {

    const filter = req.body.filter || "";
    const query = filter
      ? { supplierName: { $regex: filter, $options: "i" } }
      : {};
    const suppliers = await Supplier.find(query);

    const pdfBuffer = await generateReportBuffer(suppliers);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="suppliersReport.pdf"',
    });
    res.send(pdfBuffer);

  } catch (err) {
       
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});


//GET all suppliers
router.get('/', getAllSuppliers)


//GET a single supplier
router.get('/:id', getSingleSupplier)


//CREATE a new supplier
router.post('/', createSupplier);


//DELETE a single supplier
router.delete('/:id', deleteSupplier)


//UPDATE a single supplier
router.put('/:id', updateSupplier)




module.exports = router