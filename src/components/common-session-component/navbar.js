import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <Link to="/transaction" className="link">
          Transactions
        </Link>
        <Link to="/deposit" className="link">
          Deposit
        </Link>
        <Link to="/withdrawal" className="link">
          Withdraw
        </Link>
        <Link to="/transfer" className="link">
          Transfer
        </Link>
        <Link to="/account-profile" className="link">
          Account Profile
        </Link>
        <Link to="/logout" className="link">
          Log out
        </Link>
      </nav>
    </div>
  );
};
