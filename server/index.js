const express = require('express');
const cors = require('cors');
const path = require("path");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3001; // usually server is 3001, React runs on 3000

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
app.use('/api/kiosk',kioskRouter);


// const uploadRouter = require('./routes/upload'); //new code
// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Register upload router
// app.use('/api/upload', uploadRouter);
// Log every request so we SEE what's hitting the server
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Serve files from /uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// app.post("/api/upload/image", upload.single("image"), (req, res) => { //changing from /api/upload/image to /api/upload
//   console.log("Hit /api/upload/image, file:", req.file);

//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
//   return res.json({ imageUrl });
// });

app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log("Hit /api/upload. File:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  console.log("Sending imageUrl:", imageUrl); 
  return res.json({ imageUrl });
});



app.get("/", (req, res) => {
  res.send("API is running ✅");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
