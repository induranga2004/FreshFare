const PDFDocument = require("pdfkit");

const generateReportBuffer = (suppliers) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.font('Helvetica-Bold')         
            .fontSize(20)                 
            .fillColor('#000')             
            .text('Suppliers Report', { align: 'center',underline: true, });          // Underline for emphasis (optional)

        doc.moveDown();

        // Report details
        suppliers.forEach((s, i) => {
            doc.fontSize(12)
               .font('Helvetica')
               .fillColor('#000')
               .text(`Supplier ${i + 1}`, { underline: true });
                doc.moveDown(0.5);

            doc.font('Helvetica-Bold').text('Supplier Name: ', { continued: true });
            doc.font('Helvetica').text(s.supplierName);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Company Name: ', { continued: true });
            doc.font('Helvetica').text(s.companyName);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Phone Number: ', { continued: true });
            doc.font('Helvetica').text(s.phoneNum);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Email: ', { continued: true });
            doc.font('Helvetica').text(s.email);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Product Name: ', { continued: true });
            doc.font('Helvetica').text(s.pName);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Quantity: ', { continued: true });
            doc.font('Helvetica').text(`${s.quantity} kg/packets`);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Unit Price: ', { continued: true });
            doc.font('Helvetica').text(`LKR ${s.unitPrice}`);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Total Amount: ', { continued: true });
            doc.font('Helvetica').text(`LKR ${s.totAmount}`);
            doc.moveDown(0.2);

            doc.font('Helvetica-Bold').text('Paid: ', { continued: true });
            doc.font('Helvetica').text(s.paid ? 'Paid' : 'Not Paid');

            doc.moveDown(1); // Add space before next supplier
        });

        doc.end();
    });
};

module.exports = { generateReportBuffer };
