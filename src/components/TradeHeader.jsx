import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiSettings, FiBook, FiBookOpen } from "react-icons/fi";
import { HiUserCircle } from "react-icons/hi";

const TradeHeader = ({ userProfile }) => {
  const navigate = useNavigate();
  const pageName = window.location.pathname.split("/").at(-1);
  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-2xl px-6 py-2 mb-6 relative">
      {/* Left: User Icon and Welcome */}
      <div className="flex items-center space-x-3">
        <HiUserCircle className="text-[#6E7191] text-4xl" />
        <h1 className="text-[#6E7191] text-2xl font-semibold">
          Welcome,&nbsp;
          <span className="text-black font-bold">
            {userProfile?.user?.username?.toUpperCase() || "USER"}
          </span>
        </h1>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center space-x-6">
        {/* Trade Page */}
        {pageName == "trade" ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/trade")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
          >
            <FiBookOpen className="text-xl" />
            <span>Trade Page</span>
          </button>
        )}

        {/* Balance Sheet */}
        {pageName == "balancesheet" ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/balancesheet")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
          >
            <FiBookOpen className="text-xl" />
            <span>Balance Sheet</span>
          </button>
        )}
        {/* P & L */}
        {pageName == "pandl" ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/pandl")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
          >
            <FiBookOpen className="text-xl" />
            <span>P & L</span>
          </button>
        )}
        {/* Ledger */}
        {pageName == "ledger" ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/ledger")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
          >
            <FiBook className="text-xl" />
            <span>Ledger</span>
          </button>
        )}
        {/* Settings */}
        {pageName == "setting" ? (
          ""
        ) : (
          <button
            onClick={() => navigate("/setting")}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium transition-all"
          >
            <FiSettings className="text-xl" />
            <span>Settings</span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("userData");
            window.location.reload();
          }}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-all"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TradeHeader;
