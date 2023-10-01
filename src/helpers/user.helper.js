import api from "../api/mb-users-account";
export const getAllUsers = async () => {
  try {
    const response = await api.get("/MB_USER_ACCOUNTS");
    const data = await response.data  ;
    return data;
  } catch (error) {
    console.log("error getting users :", error);
  }
};

export const getLoggedInUserAccountNumber = () => {
  return (localStorage.getItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER"));
};

export const isLoggedIn = () => {
  const accountNumber = getLoggedInUserAccountNumber();
  return !!accountNumber;
};

export const getUserByAccountNumber = async (accountNumber) => {
  try {
    const usersArr = await getAllUsers();
    const currentUser =  usersArr.find(
      (user) => user.accountNumber === accountNumber
    );
    return currentUser
   
  } catch (error) {
    console.error("Error getting user:", error);
    return null; 
  }
};

export const currentUserAccountNumber = localStorage.getItem(
  "MB_LOGGEDIN_USER_ACCOUNT_NUMBER"
);

export const getUserIndexByAccountNumber = async (accountNumber) => {
  try {
    const registeredUsers = await getAllUsers();
    const userIndex = registeredUsers.findIndex(
      (user) => user.accountNumber === accountNumber
    );
    return userIndex;
  } catch (error) {
    console.error(error);
  }
};

export const getUserTransactions = async (
  accountNumber = getLoggedInUserAccountNumber()
) => {
  try {
    const user = await getUserByAccountNumber(accountNumber);
    return  user?.transactions || [];
  } catch (error) {
    console.log(error);
  }
};

export const getUserCurrentBalance = async (
  accountNumber = getLoggedInUserAccountNumber()
) => {
  try {
    const transactions = await getUserTransactions(accountNumber);
    const prevTransaction = transactions[transactions.length - 1];
    const currentBalance = prevTransaction?.balanceAfter || 0;
    return currentBalance;
  } catch (error) {
    console.log(error);
  }
};

