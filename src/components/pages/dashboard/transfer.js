import React,{useState,useEffect} from "react";
import DashboardLayout from "../../layout/dashboard.layout";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
    getAllUsers, 
  getUserByAccountNumber,
  getUserCurrentBalance,
  getUserIndexByAccountNumber,
  getLoggedInUserAccountNumber,
} from "../../../helpers/user.helper";
import api from "../../../api/mb-users-account"


export const Transfer = () => {
    const navigate = useNavigate();
    const currentUserAccountNumber = getLoggedInUserAccountNumber();
    const [userData, setUserData] = useState([]);
    const [users, setUsers] = useState([]);

  const getAllRegisteredUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };
  useEffect(() => {
    getAllRegisteredUsers();
  }, []);

  useEffect(()=>{
    const getRegisteredUser = async () => {
        const user = await getUserByAccountNumber(currentUserAccountNumber);
        setUserData(user);
      };
      
        getRegisteredUser();
      }, [currentUserAccountNumber]);
      const schema = yup.object({
        selectAccount: yup.string().required("Please provide an account"),
        amount: yup.string().required("Transfer amount required"),
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
    const registeredUsers = await getAllUsers();
    const currentBalance =await getUserCurrentBalance();
    


      const currentUserIndex =await getUserIndexByAccountNumber(
        currentUserAccountNumber
      );
      const currentUser = registeredUsers[currentUserIndex];
      

    if (data.accountPin !== userData.accountPin) {
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
      beneficiary: data.selectAccount,
    };
   

    currentUser.transactions.push(transactionDetails);

    const updatedUserData = await api.put(
        `/MB_USER_ACCOUNTS/${currentUser.id}`,
        currentUser
      );
      console.log("User data updated:", updatedUserData);
      navigate("/transactions")
  };

  return (
    <DashboardLayout pageTitle="Transfer">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <select className="form-control" {...register("selectAccount")}>
            <option value=""> Select Account</option>
            {users
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
