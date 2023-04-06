import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../helpers/user.helper";

export const Register = () => {
  const users = getAllUsers();
  const generateAccountNumber = () => Math.random().toString().slice(2, 12);

  const [accountNumber, setAccountNumber] = useState(generateAccountNumber());
  const navigate = useNavigate();

  const schema = yup.object({
    accountName: yup.string().required("Account name required"),
    accountNumber: yup
      .string()
      .required("Account number required")
      .length(10, 'Account number must be exactly 10 digits'),
    accountPin: yup
      .string()
      .required("Account PIN required")
      .length(4, 'Account PIN must be exactly 4 digits'),
    confirmPin: yup
      .string()
      .required()
      .oneOf([yup.ref("accountPin"), null], "Pins do not match")
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegenerateAccountNumber = () => {
    const newAccountNumber = generateAccountNumber();
    setAccountNumber(newAccountNumber);
    setValue('accountNumber', newAccountNumber);
  };

  const onSubmit = (data) => {
    delete data.confirmPin;
    const newUserObject = {
      ...data,
      transactions: [],
    };

    // add the user to our database
    users.push(newUserObject);
    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(users));
    navigate("/login");
  };

  return (
    <div className="container-fixed">
      <h1 className="text-center text-3xl font-bold">Register</h1>
      <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group" type="text">
          <label className="form-control-label">Account Name</label>
          <input
            type="text"
            className="form-control"
            autoComplete="off"
            {...register("accountName")}
          />
          <p className="form-error">{errors.accountName?.message}</p>
        </div>

        <div className="form-group">
          <label className="form-control-label">Account Number</label>
          <input
            type="number"
            value={accountNumber}
            className="form-control"
            autoComplete="off"
            readOnly
            {...register("accountNumber")}
          />
          <p className="form-error">{errors.accountNumber?.message}</p>
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={handleRegenerateAccountNumber}
          >
            Re-generate
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
          <p className="form-error">{errors.accountPin?.message}</p>
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
          <p className="form-error">{errors.confirmPin?.message}</p>
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
