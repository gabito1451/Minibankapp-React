import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import getAllUsers from "../common/get-all-users";
import getUserByAccountNumber from "../common/get-user-act-no";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [option, setOption] = useState([]);
  const [inputValue, setInputValue] = useState();
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const accountNames = getAllUsers();
    const optionElem = accountNames.map((user, index) => (
      <option key={index} value={user.accountNumber}>
        {user.accountName} ({user.accountPin})
      </option>
    ));

    setOption(optionElem);
  }, []);
  const schema = yup.object({
    accountPin: yup.string().min(4).max(4).required("Account pin required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    const accountNumber = selectRef.current.value;

    console.log(accountNumber);
    const existingUser = getUserByAccountNumber(accountNumber);

    if (existingUser.accountPin !== data.accountPin) {
      alert("Incorrect PIN");
      return;
    }
    if (!existingUser) {
      alert("Account not found");
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
          <select ref={selectRef} className="form-control">
            {option}
          </select>
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control"
            onChange={handleInputChange}
            {...register("accountPin")}
          />
          {inputValue}
          <p className="error">{errors.accountPin?.message}</p>
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
