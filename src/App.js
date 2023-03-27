import "./styles/helper.css";
import "./styles/style.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { Transaction } from "./components/transaction";
import { Deposit } from "./components/deposit";
export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" Component={Register} />
        <Route path="/" Component={Login} />
        <Route path="/transaction" Component={Transaction} />
        <Route path="/deposit" Component={Deposit} />
      </Routes>
    </Router>
  );
}

export default App;
