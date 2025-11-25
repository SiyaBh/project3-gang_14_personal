const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require("multer");
// ✅ ADD CLOUDINARY IMPORTS HERE
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://project3-gang-14-personal-3.onrender.com"
  ],
  credentials: true,
}));
app.use(express.json());

// Log all requests FIRST (moved up)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ✅ CONFIGURE CLOUDINARY HERE
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Serve uploads folder (keep this for backward compatibility with old images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
const employeeRouter = require('./routes/employee');
const ingredientRouter = require('./routes/ingredients');
const drinkRouter = require('./routes/drink');
const kioskRouter = require('./routes/kiosk');
const orderRouter = require('./routes/order');
const trendsRouter = require('./routes/trends');
const authRoutes = require('./routes/auth');
const translateRouter = require('./routes/translate');

app.use('/api/employee', employeeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/drinks', drinkRouter);
app.use('/api/order', orderRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/translate', translateRouter);
app.use('/api/kiosk', kioskRouter);

// ✅ REPLACE MULTER SETUP WITH CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'boba-shop-images', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: resize images
  }
});

const upload = multer({ storage });

// ✅ UPDATE UPLOAD ROUTE - CLOUDINARY RETURNS URL AUTOMATICALLY
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  // Cloudinary automatically provides the full URL in req.file.path
  const imageUrl = req.file.path;
  
  console.log("Image uploaded to Cloudinary:", imageUrl);
  return res.json({ imageUrl });
});

// Serve React frontend - MOVED TO THE VERY END
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all route - MUST BE LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});