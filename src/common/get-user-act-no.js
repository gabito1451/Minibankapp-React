import getAllUsers from "./get-all-users";
export const getUserByAccountNumber = (accountNumber) => {
  const usersArr = getAllUsers();
  const user = usersArr.find((user) => user.accountNumber === accountNumber);
  return user;
};
export default getUserByAccountNumber;
