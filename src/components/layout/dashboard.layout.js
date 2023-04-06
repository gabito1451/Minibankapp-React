import React from "react";
import { getUserCurrentBalance } from "../../helpers/user.helper";
import { Link, useNavigate } from "react-router-dom";
import { formatAmount } from "../../helpers/utils.helper";

const DashboardLayout = ({ pageTitle, children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("MB_LOGGEDIN_USER_ACCOUNT_NUMBER");
    navigate("/login", { replace: true });
  };

  return (
    <div className="">
      <header>
        <nav className="top-nav flex justify-between items-center bg-white py-4 px-6">
          <div>
            <Link to="/transactions" className="top-nav__link text-xl mr-6">
              Transactions
            </Link>
            <Link to="/deposit" className="top-nav__link text-xl mr-6">
              Deposit
            </Link>
            <Link to="/withdraw" className="top-nav__link text-xl mr-6">
              Withdraw
            </Link>
            <Link to="/transfer" className="top-nav__link text-xl mr-6">
              Transfer
            </Link>
            <Link to="/profile" className="top-nav__link text-xl mr-6">
              Profile
            </Link>
          </div>
          <div>
            <button
              className="btn btn-primary text-xl mr-6 cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </nav>
        <div className="flex justify-between container-fixed items-center">
          <h1 className="">{pageTitle}</h1>
          <p>Balance: {formatAmount(getUserCurrentBalance())}</p>
        </div>
      </header>
      <section className="container-fixed bg-white rounded flex min-h-screen">
        <div className="py-6">{children}</div>
      </section>
      <footer className="fixed bottom-0 left-0 right-0 text-center p-4 bg-white">
        &copy; MiniBankApp {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default DashboardLayout;
