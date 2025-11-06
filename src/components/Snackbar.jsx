import React, { useEffect } from "react";

const Snackbar = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 100000); // auto-close after 2.5s
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div
        className={`p-6 rounded-2xl shadow-lg text-center w-80 transition-all transform 
          ${isSuccess ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}
        `}
      >
        <div
          className={`text-5xl mb-2 ${
            isSuccess ? "text-green-500" : "text-red-500"
          }`}
        >
          {isSuccess ? "✅" : "❌"}
        </div>
        <h2
          className={`text-lg font-semibold ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}
        >
          {isSuccess ? "Success!" : "Failed!"}
        </h2>
        <p className="text-gray-700 mt-1">{message}</p>

        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-lg font-medium ${
            isSuccess
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
