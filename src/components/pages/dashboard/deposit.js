import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  getUserByAccountNumber,
  getAllUsers,
  getUserCurrentBalance,
  getUserIndexByAccountNumber,
  getLoggedInUserAccountNumber,
} from "../../../helpers/user.helper";
import DashboardLayout from "../../layout/dashboard.layout";

export const Deposit = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState();
  const currentUserAccountNumber = getLoggedInUserAccountNumber();
  const currentUser = getUserByAccountNumber(currentUserAccountNumber);

  const schema = yup.object({
    amount: yup.string().required("Deposit amount required"),
    accountPin: yup
      .string()
      .required("Account PIN required")
      .length(4, "Account PIN must be exactly 4 digits"),
  });

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    const registeredUsers = getAllUsers();
    const currentBalance = getUserCurrentBalance();

    if (data.accountPin !== currentUser.accountPin) {
      alert("Incorrect PIN.");
      return;
    }
    const transactionDetails = {
      timestamp: new Date(),
      transactionReference: `TR${Date.now()}`,
      type: "Deposit",
      amount: parseInt(data.amount),
      balanceBefore: currentBalance,
      balanceAfter: currentBalance + parseInt(data.amount),
    };

    const currentUserIndex = getUserIndexByAccountNumber(
      currentUserAccountNumber
    );

    registeredUsers[currentUserIndex].transactions.push(transactionDetails);

    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(registeredUsers));
    navigate("/transactions");
  };

  return (
    <DashboardLayout pageTitle="Deposit">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-control-label"> Amount</label>
          <input
            type="number"
            className="form-control"
            {...register("amount")}
          />
          <p className="form-error">{errors.amount?.message}</p>
        </div>
        <div className="form-group">
          <label className="form-control-label">PIN</label>
          <input
            type="password"
            maxLength={4}
            className="form-control"
            onChange={handleInputChange}
            {...register("accountPin")}
          />
          {inputValue}
          <p className="form-error">{errors.accountPin?.message}</p>
        </div>
        <button type="submit" className="btn btn-secondary">
          Deposit
        </button>
      </form>
    </DashboardLayout>
  );
};
