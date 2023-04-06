import React, { useState } from "react";
import {
  getAllUsers,
  getLoggedInUserAccountNumber,
  getUserIndexByAccountNumber,
  getUserTransactions,
} from "../../../helpers/user.helper";
import DashboardLayout from "../../layout/dashboard.layout";
import { Button, Popconfirm } from "antd";

export const Transactions = () => {
  const currentUserAccountNumber = getLoggedInUserAccountNumber();
  const currentUserTransactions = getUserTransactions();

  const [userTransactionArr, setUserTransactionArr] = useState(
    currentUserTransactions
  );

  const clearTransactionHistory = () => {
    const allUsers = getAllUsers();
    const currentUserIndex = getUserIndexByAccountNumber(
      currentUserAccountNumber
    );
    allUsers[currentUserIndex].transactions = [];
    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(allUsers));
    setUserTransactionArr([]);
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
            {userTransactionArr.map((transaction) => (
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
