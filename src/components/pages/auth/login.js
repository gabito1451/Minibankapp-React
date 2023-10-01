import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getUserByAccountNumber,
  getAllUsers,
  isLoggedIn,
} from "../../../helpers/user.helper";

export const Login = () => {
  const [users, setUsers] = useState([]);

  const getRegisteredUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/transaction");
      navigate("/transactions");
    }
  }, [navigate]);

  const [inputValue, setInputValue] = useState();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const schema = yup.object({
    accountNumber: yup
      .string()
      .required("Account number required")
      .length(10, "Account number must be exactly 10 digits"),
    accountPin: yup
      .string()
      .required("Account PIN required")
      .length(4, "Account PIN must be exactly 4 digits"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { accountNumber, accountPin } = data;

    const user = await getUserByAccountNumber(accountNumber);

    if (!user) {
      alert("Account not found");
      return;
    }
    if (user.accountPin !== accountPin) {
      alert("Incorrect PIN");
      return;
    }

    localStorage.setItem(
      "MB_LOGGEDIN_USER_ACCOUNT_NUMBER",
      JSON.stringify(accountNumber)
    );
    navigate("/transaction");
    localStorage.setItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER", accountNumber);
    navigate("/transactions", { replace: true });
  };

  return (
    <div className="container-fixed">
      <h1 className="text-center text-3xl font-bold">Login</h1>
      <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <select className="form-control" {...register("accountNumber")}>
            {users.map((user) => (
              <option key={user.accountNumber} value={user.accountNumber}>
                {user.accountName}
              </option>
            ))}
          </select>
          <p className="form-error">{errors.accountNumber?.message}</p>
        </div>
        <div className="form-group">
          <label className="form-control-label">Account PIN</label>
          <input
            type="password"
            className="form-control"
            maxLength={4}
            onChange={handleInputChange}
            {...register("accountPin")}
          />
          {inputValue}
          <p className="form-error">{errors.accountPin?.message}</p>
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
