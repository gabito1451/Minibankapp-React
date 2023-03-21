import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register } from "./components/register";
import { Login } from "./components/login";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" Component={Register} />
        <Route path="/" Component={Login} />
      </Routes>
    </Router>
  );
}

export default App;
