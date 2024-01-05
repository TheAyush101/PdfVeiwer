const mongoose = require("mongoose");

const pdfInfoSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
    },
    numPages: {
      type: Number,
      required: true,
    },
  },
  { collection: "pdf-data" } // Set the collection name to 'pdf-data'
);

const PdfInfo = mongoose.model("PdfInfodata", pdfInfoSchema);

module.exports = PdfInfo;
