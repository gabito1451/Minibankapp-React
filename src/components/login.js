import React from "react";
import { Link } from "react-router-dom";
export const Login = () => {
  return (
    <div className="container-fixed">
      <h1>Login</h1>
      <form className="account-form">
        <div className="form-group">
          <select className="form-control">
            <option value="">Select Username</option>
          </select>
        </div>
        <div className="form-group">
          <input type="password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      <p className="text-center">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};
