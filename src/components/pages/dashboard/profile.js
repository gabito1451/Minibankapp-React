import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAllUsers,
  getUserIndexByAccountNumber,
  getLoggedInUserAccountNumber,
  getUserByAccountNumber,
} from "../../../helpers/user.helper";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import DashboardLayout from "../../layout/dashboard.layout";
import api from "../../../api/mb-users-account";

export const Profile = () => {
  const currentUserAccountNumber = getLoggedInUserAccountNumber();

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [checked, setchecked] = useState(false);

  const getRegisteredUsers = async () => {
    const allRegisteredUsers = await getAllUsers();
    setUsers(allRegisteredUsers);
  };
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  const handleChangePinToggle = () => {
    setchecked(!checked);
  };

  const closeUserAccount = async () => {
    try {
      const userIndex = await getUserIndexByAccountNumber(
        currentUserAccountNumber
      );
      const currentUser = users[userIndex];
      users.splice(userIndex, 1);
      const registeredUsersLeft = users;
      await api.put(`/MB_USER_ACCOUNTS/${currentUser.id}`, registeredUsersLeft);
      navigate("/");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const schema = yup.object({
    accountName: yup.string().required("Account Name Required"),
    accountNumber: yup.string(),
    currentPin: yup.string(),
    newPin: yup.string().length(4, "Account PIN must be exactly 4 digits"),
    confirmNewPin: yup
      .string()
      .oneOf([yup.ref("newPin"), null], "Pins do not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const users = await getAllUsers();
      console.log(users);
      const currentUserIndex = await getUserIndexByAccountNumber(
        currentUserAccountNumber
      );
      console.log(currentUserIndex);
      const currentUser = users[currentUserIndex];
      console.log(currentUser);
      currentUser.accountName = data.accountName;

      if (checked) {
        const savedUserPin = currentUser.accountPin;
        if (!data.currentPin) {
          alert("Current PIN is required");
          return;
        }
        if (data.currentPin !== savedUserPin) {
          alert("Current PIN is incorrect");
          return;
        }
        if (data.newPin !== data.confirmNewPin) {
          alert("PINs do not match");
          return;
        }
        if (data.newPin === savedUserPin) {
          alert("You entered your current PIN. Choose a different PIN");
          return;
        }

        // all is good
        
        currentUser.accountPin = data.newPin;
      }
      await api.put(`/MB_USER_ACCOUNTS/${currentUser.id}`, currentUser);
      navigate("/transactions");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <DashboardLayout pageTitle="Profile">
      <div className="container-fixed">
        <form className="account-profile" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-control-label">Account Name</label>
            <input
              type="text"
              placeholder={
                getUserByAccountNumber(currentUserAccountNumber).accountName
              }
              className="form-control"
              {...register("accountName")}
            />

            <p className="form-error">{errors.accountName?.message}</p>
          </div>
          <div className="form-group">
            <label className="form-control-label">Account Number</label>
            <input
              type="number"
              id="account-number"
              className="form-control"
              value={getLoggedInUserAccountNumber()}
              readOnly
            />
          </div>
          <label className="form-control-label">
            <input
              type="checkbox"
              className="changePin"
              onClick={handleChangePinToggle}
            />
            Change Pin
          </label>
          {checked && (
            <div>
              <div className="form-group">
                <label className="form-control-label">Current PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-control"
                  {...register("currentPin")}
                />

                <p className="form-error">{errors.currentPin?.message}</p>
              </div>
              <div className="form-group">
                <label className="form-control-label">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-control"
                  {...register("newPin")}
                />

                <p className="form-error">{errors.newPin?.message}</p>
              </div>
              <div className="form-group">
                <label className="form-control-label">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-control"
                  {...register("confirmNewPin")}
                />

                <p className="form-error">{errors.confirmNewPin?.message}</p>
              </div>
            </div>
          )}
          <div className="form-group">
            <button className="bg-gray-800 text-white p-2 rounded-md">
              Update
            </button>
          </div>
        </form>
        <Popconfirm
          placement="right"
          title="Close Account"
          description="Sure to close account?"
          onConfirm={closeUserAccount}
          okText="Yes"
          cancelText="No"
          overlayStyle={{ minWidth: "200px" }}
        >
          <Button danger>Close</Button>
        </Popconfirm>
      </div>
    </DashboardLayout>
  );
};
