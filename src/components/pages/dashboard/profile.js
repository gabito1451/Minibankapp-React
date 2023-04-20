import React, { useState } from "react";
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

export const Profile = () => {
  const currentUserAccountNumber = getLoggedInUserAccountNumber();

  const registeredUsers = getAllUsers();

  const navigate = useNavigate();

  const [checked, setchecked] = useState(false);

  const handleChangePinToggle = () => {
    setchecked(!checked);
  };

  const closeUserAccount = () => {
    const userIndex = getUserIndexByAccountNumber(currentUserAccountNumber);
    registeredUsers.splice(userIndex, 1);
    const registeredUsersLeft = JSON.stringify(registeredUsers);
    localStorage.setItem("MB_USER_ACCOUNTS", registeredUsersLeft);
    navigate("/");
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
  const onSubmit = (data) => {
    const currentUserIndex = getUserIndexByAccountNumber(
      currentUserAccountNumber
    );
    registeredUsers[currentUserIndex].accountName = data.accountName;
    if (checked) {
      const savedUserPin = registeredUsers[currentUserIndex].accountPin;
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
      registeredUsers[currentUserIndex].accountPin = data.newPin;
    }
    localStorage.setItem("MB_USER_ACCOUNTS", JSON.stringify(registeredUsers));
    navigate("/transactions");
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
