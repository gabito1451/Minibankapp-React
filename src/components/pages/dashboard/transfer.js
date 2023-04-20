import React from "react";
import DashboardLayout from "../../layout/dashboard.layout";
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

export const Transfer = () => {
  const registeredUsers = getAllUsers();
  const navigate = useNavigate();

  const currentUserAccountNumber = getLoggedInUserAccountNumber();
  const currentUser = getUserByAccountNumber(currentUserAccountNumber);

  const schema = yup.object({
    selectedAccount: yup.string().required("Select an account"),
    amount: yup.string().required("Withdrawal amount required"),
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
  const onSubmit = (data) => {
    const currentBalance = getUserCurrentBalance();

    if (data.accountPin !== currentUser.accountPin) {
      alert("Incorrect PIN.");
      return;
    }
    if (data.amount > currentBalance) {
      alert("Insufficient Balance");
      return;
    }
    if (data.amount < 1) {
      alert("Enter a valid amount");
      return;
    }
    const transactionDetails = {
      timestamp: new Date(),
      transactionReference: `TR${Date.now()}`,
      type: "Transfer",
      amount: parseInt(data.amount),
      balanceBefore: currentBalance,
      balanceAfter: currentBalance - parseInt(data.amount),
      beneficiary: data.SelectAccount,
    };

    const currentUserIndex = getUserIndexByAccountNumber(
      currentUserAccountNumber
    );

    registeredUsers[currentUserIndex].transactions.push(transactionDetails);

    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(registeredUsers));
    navigate("/transactions");
    console.log(data);
  };

  return (
    <DashboardLayout pageTitle="Transfer">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <select className="form-control" {...register("SelectAccount")}>
            <option value=""> Select Account</option>
            {registeredUsers
              .filter((user) => user.accountNumber !== currentUserAccountNumber)
              .map(({ accountNumber, accountName }) => (
                <option key={accountNumber} value={accountName}>
                  {accountName}
                </option>
              ))}
          </select>
          <p className="form-error">{errors.selectedAccount?.message}</p>
        </div>

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
            {...register("accountPin")}
          />
          <p className="form-eror">{errors.accountPin?.message}</p>
        </div>
        <button type="submit" className="btn btn-secondary">
          Transfer
        </button>
      </form>
    </DashboardLayout>
  );
};
