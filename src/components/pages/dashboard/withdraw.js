import React, { useEffect, useState } from "react";
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
import api from "../../../api/mb-users-account";

export const Withdraw = () => {
  const navigate = useNavigate();
  const currentUserAccountNumber = getLoggedInUserAccountNumber();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByAccountNumber(currentUserAccountNumber);
        setUserData(user);
        
      } catch (error) {
        console.log("Error in useEffect:", error);
      }
    };

    fetchUserData();
  }, [currentUserAccountNumber]);

  const schema = yup.object({
    amount: yup.string().required("Deposit amount required"),
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
    if (data.accountPin !== userData.accountPin) {
      alert("Incorrect PIN.");
      return;
    }

    try {
      // Fetch the current user's data
      const registeredUsers = await getAllUsers();
      const currentUserIndex = await getUserIndexByAccountNumber(
        currentUserAccountNumber
      );
      const currentUser = registeredUsers[currentUserIndex];

      // Calculate the transaction details
      const currentBalance = await getUserCurrentBalance();
      const transactionDetails = {
        timestamp: new Date(),
        transactionReference: `TR${Date.now()}`,
        type: "Withdraw",
        amount: parseInt(data.amount),
        balanceBefore: currentBalance,
        balanceAfter: currentBalance - parseInt(data.amount),
      };

      currentUser.transactions.push(transactionDetails);

      const updatedUserData = await api.put(
        `/MB_USER_ACCOUNTS/${currentUser.id}`,
        currentUser
      );
      console.log("User data updated:", updatedUserData);

      navigate("/transactions");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <DashboardLayout pageTitle="Withdraw">
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
            {...register("accountPin")}
          />

          <p className="form-error">{errors.accountPin?.message}</p>
        </div>
        <button type="submit" className="btn btn-secondary">
          Deposit
        </button>
      </form>
    </DashboardLayout>
  );
};
