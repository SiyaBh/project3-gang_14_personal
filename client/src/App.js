const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const employeeRouter = require('./routes/employee.js');
const ingredientRouter = require('./routes/ingredient');
const drinkRouter = require('./routes/drink');

app.use('/api/employee', employeeRouter);
app.use('/api/ingredient', ingredientRouter);
app.use('/api/drinks', drinkRouter);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CashierDashboard from "./pages/cashier/CashierDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/cashier"
            element={
              <ProtectedRoute role="cashier">
                <CashierDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
