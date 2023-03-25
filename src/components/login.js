import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAllUsers, getUserByAccountNumber } from "../helpers/user-helper";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [inputValue, setInputValue] = useState();
  const navigate = useNavigate();

  const users = getAllUsers();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  const schema = yup.object({
    accountNumber: yup
      .string()
      .required("Account number required")
      .length(10, 'Account number must be exactly 10 digits'),
    accountPin: yup
      .string()
      .required("Account PIN required")
      .length(4, 'Account PIN must be exactly 4 digits')
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    const { accountNumber, accountPin } = data;

    console.log(accountNumber);
    const user = getUserByAccountNumber(accountNumber);

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
  };

  return (
    <div className="container-fixed">
      <h1>Login</h1>
      <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <select
            className="form-control"
            {...register("accountNumber")}
          >
            <option value="">Select Account</option>
            {users.map(({ accountNumber, accountName, accountPin }) => (
              <option key={accountNumber} value={accountNumber}>
                {accountName} ({accountPin})
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
