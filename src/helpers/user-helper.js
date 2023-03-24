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
