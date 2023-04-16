import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAllUsers,
  getUserIndexByAccountNumber,
  getUserAccountName,
  getLoggedInUserAccountNumber,
} from "../../../helpers/user.helper";
import { useNavigate } from "react-router-dom";
import { Button, Popconfirm } from "antd";
import DashboardLayout from "../../layout/dashboard.layout";

export const Profile = () => {
  const currentUserAccountNumber = getLoggedInUserAccountNumber();

  const registeredUsers = getAllUsers();

  const navigate = useNavigate();

  const [accountName, setAccountName] = useState(getUserAccountName());
  const [currentPinCode, SetCurrentPinCode] = useState();
  const [newPinCode, setNewPinCode] = useState();
  const [confirmNewPinCode, setConfirmNewPinCode] = useState();

  const [checked, setchecked] = useState(false);

  const handleToggleChange = () => {
    setchecked(!checked);
  };

  const handleAccountNameChange = (event) => {
    setAccountName(event.target.value);
  };
  const handleCurrentPinChange = (event) => {
    SetCurrentPinCode(event.target.value);
  };
  const handleNewPinChange = (event) => {
    setNewPinCode(event.target.value);
  };
  const handleConfirmNewPineChange = (event) => {
    setConfirmNewPinCode(event.target.value);
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
    if (checked === true && data.currentPin === "") {
      alert("Insert Pin");
      return;
    }
    if (
      checked === true &&
      data.currentPin !== registeredUsers[currentUserIndex].accountPin
    ) {
      alert("Pin Incorrect");
      return;
    }

    if (checked === true && data.newPin !== data.confirmNewPin) {
      alert("Pins do not match");
      return;
    }
    if (
      checked === true &&
      data.confirmNewPin === registeredUsers[currentUserIndex].accountPin
    ) {
      alert("use a different password for update");
    }
    if (checked === true && data.newPin === " ") {
      data.newPin = registeredUsers[currentUserIndex].accountPin;
    }
    if (checked === true && data.newPin === data.confirmNewPin) {
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
              placeholder={accountName}
              className="form-control"
              onChange={handleAccountNameChange}
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
              onClick={handleToggleChange}
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
                  onChange={handleCurrentPinChange}
                  {...register("currentPin")}
                />
                {currentPinCode}
                <p className="form-error">{errors.currentPin?.message}</p>
              </div>
              <div className="form-group">
                <label className="form-control-label">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-control"
                  onChange={handleNewPinChange}
                  {...register("newPin")}
                />
                {newPinCode}
                <p className="form-error">{errors.newPin?.message}</p>
              </div>
              <div className="form-group">
                <label className="form-control-label">Confirm New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  className="form-control"
                  onChange={handleConfirmNewPineChange}
                  {...register("confirmNewPin")}
                />
                {confirmNewPinCode}
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
