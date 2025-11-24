const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploads folder
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
app.use('/auth', authRoutes);
app.use('/api/translate', translateRouter);
app.use('/api/kiosk', kioskRouter);

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.json({ imageUrl });
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Log all requests (optional)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
