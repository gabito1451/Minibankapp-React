import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/mb-users-account";

//

export const Register = () => {
  const navigate = useNavigate();
  const generateAccountNumber = () => Math.random().toString().slice(2, 12);
  const [accountNumber, setAccountNumber] = useState(generateAccountNumber());
  const [users, setUsers] = useState([]);

  const schema = yup.object({
    accountName: yup.string().required("Account name required"),
    accountNumber: yup
      .string()
      .required("Account number required")
      .length(10, "Account number must be exactly 10 digits"),
    accountPin: yup
      .string()
      .required("Account PIN required")
      .length(4, "Account PIN must be exactly 4 digits"),
    confirmPin: yup
      .string()
      .required()
      .oneOf([yup.ref("accountPin"), null], "Pins do not match"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    delete data.confirmPin;
    const newUserObject = {
      ...data,
      transactions: [],
    };
    try {
      const response = await api.post("/MB_USER_ACCOUNTS", newUserObject);
      const allRegisteredUsers = [...users, response.data];
      setUsers(allRegisteredUsers);
    } catch (error) {
      console.log(error);
    }

    navigate("/");
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
            onClick={() => setAccountNumber(generateAccountNumber())}
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
