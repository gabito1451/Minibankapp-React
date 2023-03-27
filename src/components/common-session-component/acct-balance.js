import React from "react";
import { getUserCurrentBalance } from "../../helpers/user-helper";

export const AccountBalance = () => {
  return (
    <div className="account-balance">
      <p>
        Balance: &#8358;
        <span>{getUserCurrentBalance()}</span>
      </p>
    </div>
  );
};
