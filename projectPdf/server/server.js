const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
// const PdfModel = require("./models/Pdf.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Import bcrypt
const pdfInfoSchema = require("./models/Pdf.model");
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"], // Add this line
};

app.options("*", cors(corsOptions)); // Enable preflight requests for all routes
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/api/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword, // Save the hashed password
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.json({
      status: "error",
      error: "Duplicate email or other registration issue",
    });
  }
});



app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ status: "error", user: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          name: user.userName,
          email: user.email,
        },
        process.env.JWT_SECRET
      );
      return res.json({ status: "ok", user: true, token });
    } else {
      return res.json({ status: "error", user: false });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return res.json({ status: "error", user: false });
  }
});




// ... (other imports and configurations)

app.post("/api/upload-pdf-info", authenticateToken, async (req, res) => {
  try {
    const { emailId, numPages } = req.body; // Add numPages to the destructuring

    // Create a new PdfInfo instance and save it to the database
    const pdfInfo = await pdfInfoSchema.create({
      emailId,
      numPages,
    });

    res.json({ status: "ok", pdfInfo });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", error: "Failed to save PDF info" });
  }
});






function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "secret123", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ... (rest of the server.js code)
app.post("/api/get-pdf-info", authenticateToken, async (req, res) => {
  try {
    const { numPages } = req.body;

    // Here, you can save the numPages information to the database if needed

    res.json({ status: "ok", numPages });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", error: "Failed to fetch PDF info" });
  }
});


app.listen(1337, () => {
  console.log("server running on 1337");
});
