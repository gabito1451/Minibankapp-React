import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  getLoggedInUserAccountNumber,
  getUserIndexByAccountNumber,
  getUserTransactions,
} from "../../../helpers/user.helper";
import DashboardLayout from "../../layout/dashboard.layout";
import { Button, Popconfirm } from "antd";
import api from "../../../api/mb-users-account";

export const Transactions = () => {
  const currentUserAccountNumber = getLoggedInUserAccountNumber();
  const [userTransactions, setUserTransactions] = useState([]);

  
  useEffect(() => {
    const fetchCurrentUserTransaction = async () => {
      try {
        const data = await getUserTransactions(currentUserAccountNumber);
        setUserTransactions(data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchCurrentUserTransaction();
  }, [currentUserAccountNumber]);

  const clearTransactionHistory = async () => {
    try {
      const allUsers = await getAllUsers();

      const currentUserIndex = await getUserIndexByAccountNumber(
        currentUserAccountNumber
      );
      console.log(currentUserIndex);
      const currentUser = allUsers[currentUserIndex];

      if (currentUserIndex !== -1) {
        currentUser.transactions = [];
      } else {
        throw new Error("User not found");
      }

      
        await api.put(`/MB_USER_ACCOUNTS/${currentUser.id}`, currentUser);
      

      setUserTransactions([]);
      
    } catch (error) {
      console.error("Error clearing transaction history:", error);
    }
  };

  return (
    <DashboardLayout pageTitle="Transactions">
      <div className="flex justify-end">
        <Popconfirm
          placement="top"
          title="Clear transactions"
          description="Sure to clear transactions?"
          onConfirm={clearTransactionHistory}
          okText="Yes"
          cancelText="No"
          overlayStyle={{ minWidth: "250px" }}
        >
          <Button danger>Clear transactions</Button>
        </Popconfirm>
      </div>
      <div className="mt-3">
        <table className="w-full"> 
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Transaction Reference</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance Before</th>
              <th>Balance After</th>
              <th>Beneficiary</th>
            </tr>
          </thead>
          <tbody>
            {userTransactions.map((transaction) => (
              <tr key={transaction.transactionReference}>
                <td>{transaction.timestamp}</td>
                <td>{transaction.transactionReference}</td>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.balanceBefore}</td>
                <td>{transaction.balanceAfter}</td>
                <td>{transaction.beneficiary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};
