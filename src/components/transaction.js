import React, { useState } from "react";
import { Navbar } from "./common-session-component/navbar";
import { AccountBalance } from "./common-session-component/acct-balance";
import {
  getAllUsers,
  getUserByAccountNumber,
  getUserIndexByAccountNumber,
} from "../helpers/user-helper";

export const Transaction = () => {
  const currentUserAccountNumber = JSON.parse(
    localStorage.getItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER")
  );

  const currentUser = getUserByAccountNumber(currentUserAccountNumber);
  const userTransactions = currentUser.transactions;
  const [userTransactionArr, setUserTransactionArr] =
    useState(userTransactions);

  const clearTransactionHistory = () => {
    const registeredUsers = getAllUsers();
    const currentUserIndex = getUserIndexByAccountNumber(
      currentUserAccountNumber
    );
    registeredUsers[currentUserIndex].transactions = [];
    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(registeredUsers));
    setUserTransactionArr([]);
  };

  return (
    <div>
      <Navbar />
      <AccountBalance />
      <h1>Transaction History</h1>;
      <button
        className="btn-danger"
        type="button"
        onClick={() => clearTransactionHistory()}
      >
        Clear transaction history
      </button>
      <div>
        <table className=" container-fixed">
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
              <tr>
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
    </div>
  );
};
