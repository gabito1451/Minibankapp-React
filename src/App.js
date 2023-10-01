import "./styles/App.css";
import "./styles/helper.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./components/pages/auth/register";
import { Login } from "./components/pages/auth/login";

import { Transactions } from "./components/pages/dashboard/transactions";
import { Deposit } from "./components/pages/dashboard/deposit";
import { Withdraw } from "./components/pages/dashboard/withdraw";
import { Transfer } from "./components/pages/dashboard/transfer";
import PrivateRoute from "./components/routes/private-route";
import { Profile } from "./components/pages/dashboard/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {
          <Route element={<PrivateRoute />}>
            <Route path="transactions" element={<Transactions />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        }
      </Routes>
    </Router>
  );
}

export default App;
