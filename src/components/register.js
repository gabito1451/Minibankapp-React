import "../css-folder/helper.css";
import "../css-folder/styles.css";
import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../common.js/get-all-users";

export const Register = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const registeredUsers = getAllUsers();
  const navigate = useNavigate();
  const schema = yup.object({
    AccountName: yup.string().required("Account name required"),
    AccountNumber: yup.number().required("Account number required"),
    AccountPin: yup
      .string()
      .min(4)
      .max(4)
      .required("Account pin must be atleast four character"),
    ConfirmPin: yup
      .string()
      .oneOf([yup.ref("AccountPin")], "Pins do not match")
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setAccountNumber(Math.random().toString().slice(2, 12));
  }, []);

  const onSubmit = (data) => {
    const newUserObject = {
      ...data,
      transactions: [],
    };

    // add the user to our database
    registeredUsers.push(newUserObject);
    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(registeredUsers));
    navigate("/");
  };
  return (
    <div className="container-fixed">
      <h1>Register</h1>
      <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group" type="text">
          <label className="form-control-label">Account Name</label>
          <input
            type="text"
            className="form-control"
            {...register("AccountName")}
          />
          <p className="error">{errors.AccountName?.message}</p>
        </div>

        <div className="form-group">
          <label className="form-control-label">Account Number</label>
          <input
            type="number"
            value={accountNumber}
            className="form-control"
            {...register("AccountNumber")}
            readOnly
          />
          <p className="error">{errors.AccountNumber?.message}</p>
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={() =>
              setAccountNumber(Math.random().toString().slice(2, 12))
            }
          >
            Generate
          </button>
        </div>

        <div className="form-group">
          <label className="form-control-label"> Enter PIN</label>
          <input
            type="number"
            className="form-control"
            {...register("AccountPin")}
          />
          <p className="error">{errors.AccountPin?.message}</p>
        </div>

        <div className="form-group">
          <label className="form-control-label">
            <b>Confirm PIN</b>
          </label>
          <input
            type="number"
            className="form-control"
            {...register("ConfirmPin")}
          />
          <p className="error">{errors.ConfirmPin?.message}</p>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p className="text-center">
        Already have an account? <Link to="/">SIGN IN</Link>
      </p>
    </div>
  );
};
