const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateAdmissionLetter = async (user, program, applicationId) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(__dirname, `../../uploads/admission_letters/${applicationId}.pdf`);

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('GHANA UNIVERSITY MANAGEMENT SYSTEM', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text('OFFICIAL ADMISSION LETTER', { align: 'center', underline: true });
        doc.moveDown(2);

        // Date
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Recipient
        doc.text(`To: ${user.firstName} ${user.lastName}`);
        doc.text(`Student ID: (Assigned Upon Registration)`);
        doc.moveDown();

        // Body
        doc.text(`Dear ${user.firstName},`, { continued: true });
        doc.moveDown();
        doc.text(`We are pleased to inform you that you have been offered provisional admission to study ${program.name} at our prestigious institution.`);
        doc.moveDown();
        doc.text(`Your admission is based on the information provided in your application form and is subject to verification of your original documents.`);
        doc.moveDown();
        doc.text(`Please proceed to the student portal to complete your registration and pay your fees.`);
        doc.moveDown(3);

        // Footer/Signature
        doc.text('Yours Faithfully,', { align: 'left' });
        doc.moveDown();
        doc.text('The Registrar', { align: 'left' });
        doc.text('GUMS', { align: 'left' });

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
    });
};

module.exports = { generateAdmissionLetter };
