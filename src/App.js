import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./components/register";
import { Login } from "./components/login";
import { Transaction } from "./components/transaction";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" Component={Register} />
        <Route path="/" Component={Login} />
        <Route path="/transaction" Component={Transaction} />
      </Routes>
    </Router>
  );
}

export default App;
