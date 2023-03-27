export const getAllUsers = () => {
  const usersStr = localStorage.getItem("MB_USER_ACCOUNTS") || null;
  const usersArr = JSON.parse(usersStr) || [];
  return usersArr;
};

export const getUserByAccountNumber = (accountNumber) => {
  const usersArr = getAllUsers();
  const user = usersArr.find((user) => user.accountNumber === accountNumber);
  return user;
};

const currentUserAccountNumber = JSON.parse(
  localStorage.getItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER")
);

export const getUserCurrentBalance = () => {
  const currentUser = getUserByAccountNumber(currentUserAccountNumber);
  const prevTransaction =
    currentUser.transactions[currentUser.transactions.length - 1];
  const currentBalance = prevTransaction?.balanceAfter || 0;
  return currentBalance;
};

export const getUserIndexByAccountNumber = (accountNumber) => {
  const registeredUsers = getAllUsers();
  const userIndex = registeredUsers.findIndex(
    (user) => user.accountNumber === accountNumber
  );
  return userIndex;
};
export const isLoggedIn = () => {
  const accountNumber = localStorage.getItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER");
  return !!accountNumber;
};
