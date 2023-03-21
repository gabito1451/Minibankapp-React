import "../css-folder/helper.css";
import "../css-folder/styles.css";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../common/get-all-users";

export const Register = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const registeredUsers = getAllUsers();
  const navigate = useNavigate();

  const schema = yup.object({
    accountName: yup.string().required("Account name required"),
    accountNumber: yup.string().required("Account number required"),
    accountPin: yup
      .string()
      .min(4)
      .max(4)
      .required("Account pin must be atleast four character"),
    confirmPin: yup
      .string()
      .oneOf([yup.ref("accountPin")], "Pins do not match")
      .required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    validationSchema: schema,
  });

  const generateAccountNumber = () => Math.random().toString().slice(2, 12);

  useEffect(() => {
    setAccountNumber(generateAccountNumber());
  }, []);

  const onSubmit = (data) => {
    delete data.confirmPin;
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
            autoComplete="off"
            {...register("accountName")}
          />
          <p className="error">{errors.accountName?.message}</p>
        </div>

        <div className="form-group">
          <label className="form-control-label">Account Number</label>
          <input
            type="number"
            value={accountNumber}
            className="form-control"
            autoComplete="off"
            {...register("accountNumber")}
            readOnly
          />
          <p className="error">{errors.accountNumber?.message}</p>
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={() =>
              setAccountNumber(generateAccountNumber())
            }
          >
            Generate
          </button>
        </div>

        <div className="form-group">
          <label className="form-control-label"> Enter PIN</label>
          <input
            type="password"
            className="form-control"
            maxLength={4}
            {...register("accountPin")}
          />
          <p className="error">{errors.accountPin?.message}</p>
        </div>

        <div className="form-group">
          <label className="form-control-label">
            <b>Confirm PIN</b>
          </label>
          <input
            type="password"
            className="form-control"
            maxLength={4}
            {...register("confirmPin")}
          />
          <p className="error">{errors.confirmPin?.message}</p>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p className="text-center">
        Already have an account? <Link to="/">Sign In</Link>
      </p>
    </div>
  );
};
