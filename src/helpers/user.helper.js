export const getAllUsers = () => {
  const usersStr = localStorage.getItem("MB_USER_ACCOUNTS") || null;
  const usersArr = JSON.parse(usersStr) || [];
  return usersArr;
};

export const getLoggedInUserAccountNumber = () => {
  return localStorage.getItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER");
};

export const isLoggedIn = () => {
  const accountNumber = getLoggedInUserAccountNumber();
  const user = getUserByAccountNumber(accountNumber);
  return !!user;
};

export const getUserByAccountNumber = (accountNumber) => {
  const usersArr = getAllUsers();
  const user = usersArr.find((user) => user.accountNumber === accountNumber);
  return user;
};

export const getUserIndexByAccountNumber = (accountNumber) => {
  const registeredUsers = getAllUsers();
  const userIndex = registeredUsers.findIndex(
    (user) => user.accountNumber === accountNumber
  );
  return userIndex;
};

export const getUserTransactions = (
  accountNumber = getLoggedInUserAccountNumber()
) => {
  const user = getUserByAccountNumber(accountNumber);
  return user?.transactions || [];
};
export const getUserAccountName = (
  accountNumber = getLoggedInUserAccountNumber()
) => {
  const user = getUserByAccountNumber(accountNumber);
  return user?.accountName;
};

export const getUserCurrentBalance = (
  accountNumber = getLoggedInUserAccountNumber()
) => {
  const transactions = getUserTransactions(accountNumber);
  const prevTransaction = transactions[transactions.length - 1];
  const currentBalance = prevTransaction?.balanceAfter || 0;
  return currentBalance;
};
