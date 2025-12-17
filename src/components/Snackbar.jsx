// import React, { useEffect } from "react";

// const Snackbar = ({ type, message, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, 100000); // auto-close after 2.5s
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const isSuccess = type === "success";

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-100">
//       <div
//         className={`p-6 rounded-2xl shadow-lg text-center w-80 transition-all transform 
//           ${isSuccess ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}
//         `}
//       >
//         <div
//           className={`text-5xl mb-2 ${
//             isSuccess ? "text-green-500" : "text-red-500"
//           }`}
//         >
//           {isSuccess ? "✅" : "❌"}
//         </div>
//         <h2
//           className={`text-lg font-semibold ${
//             isSuccess ? "text-green-700" : "text-red-700"
//           }`}
//         >
//           {isSuccess ? "Success!" : "Failed!"}
//         </h2>
//         <p className="text-gray-700 mt-1">{message}</p>

//         <button
//           onClick={onClose}
//           className={`mt-4 px-4 py-2 rounded-lg font-medium ${
//             isSuccess
//               ? "bg-green-500 text-white hover:bg-green-600"
//               : "bg-red-500 text-white hover:bg-red-600"
//           }`}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Snackbar;


// import React, { useEffect, useRef } from "react";

// const Snackbar = ({ type, message, onClose , checkBox}) => {
//   const closeBtnRef = useRef(null);

//   useEffect(() => {
//     // Focus the close button when Snackbar opens
//     closeBtnRef.current?.focus();

//     const timer = setTimeout(() => {
//       onClose();
//     }, 2500); // auto close after 2.5s

//     return () => clearTimeout(timer);
//   }, [onClose]);

//   const isSuccess = type === "success";

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-100">
//       <div
//         className={`p-6 rounded-2xl shadow-lg text-center w-80 transition-all transform 
//         ${isSuccess ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}`}
//       >
//         <div className={`text-5xl mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
//           {isSuccess ? "✅" : "❌"}
//         </div>

//         <h2 className={`text-lg font-semibold ${isSuccess ? "text-green-700" : "text-red-700"}`}>
//           {isSuccess ? "Success!" : "Failed!"}
//         </h2>

//         <p className="text-gray-700 mt-1">{message}</p>

//         <button
//           ref={closeBtnRef}
//           onClick={onClose}
//           className={`mt-4 px-4 py-2 rounded-lg font-medium ${
//             isSuccess ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"
//           }`}
//         >
//           {checkBox ? "Confirm" : "Close"}
//         </button>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useRef, useState } from "react";

// const Snackbar = ({ type, message, onClose, checkBox }) => {
//   const closeBtnRef = useRef(null);
//   const [isChecked, setIsChecked] = useState(false);

//  useEffect(() => {
//   closeBtnRef.current?.focus();

//   if (checkBox) return;

//   const timer = setTimeout(() => {
//     onClose();
//   }, 2500);

//   return () => clearTimeout(timer);
// }, [onClose, checkBox]);
//   const isSuccess = type === "success";

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-100">
//       <div
//         className={`p-6 rounded-2xl shadow-lg text-center w-80 transition-all transform 
//         ${isSuccess ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}`}
//       >
//         <div className={`text-5xl mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
//           {isSuccess ? "✅" : "❌"}
//         </div>

//         <h2 className={`text-lg font-semibold ${isSuccess ? "text-green-700" : "text-red-700"}`}>
//           {isSuccess ? "Success!" : "Failed!"}
//         </h2>

//         <p className="text-gray-700 mt-1">{message}</p>

//         {/* Checkbox section */}
//         {checkBox && (
//           <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer select-none">
//             <input
//               type="checkbox"
//               checked={isChecked}
//               onChange={(e) => setIsChecked(e.target.checked)}
//               className="w-4 h-4"
//             />
//             <span className="text-sm text-gray-700">I understand</span>
//           </label>
//         )}

//         <div className="mt-4 flex justify-center gap-3">
//           {/* Cancel button only if checkbox is required */}
//           {checkBox && (
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg font-medium bg-gray-400 text-white hover:bg-gray-500"
//             >
//               Cancel
//             </button>
//           )}

//           <button
//             ref={closeBtnRef}
//             onClick={onClose}
//             disabled={checkBox && !isChecked}
//             className={`px-4 py-2 rounded-lg font-medium 
//               ${isSuccess ? "bg-green-500" : "bg-red-500"} text-white
//               ${checkBox && !isChecked ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 hover:bg-red-600"}`}
//           >
//             {checkBox ? "Confirm" : "Close"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const Snackbar = ({ type, message, onClose, checkBox, onConfirm,index }) => {
  const closeBtnRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    closeBtnRef.current?.focus();

    if (checkBox) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose, checkBox]);

  const handleConfirm = () => {
    if (checkBox && !isChecked) return;
    onClose();      // close popup
    onConfirm?.(index);  // call parent callback
  };

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-100">
      <div
        className={`p-6 rounded-2xl shadow-lg text-center w-80 transition-all transform 
        ${isSuccess ? "bg-green-50 border border-green-400" : "bg-red-50 border border-red-400"}`}
      >
        <div className={`text-5xl mb-2 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {isSuccess ? "✅" : "❌"}
        </div>

        <h2 className={`text-lg font-semibold ${isSuccess ? "text-green-700" : "text-red-700"}`}>
          {isSuccess ? "Success!" : "Failed!"}
        </h2>

        <p className="text-gray-700 mt-1">{message}</p>

        {checkBox && (
          <label className="flex items-center justify-center gap-2 mt-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">I understand</span>
          </label>
        )}

        <div className="mt-4 flex justify-center gap-3">
          {checkBox && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          )}

          <button
            ref={closeBtnRef}
            onClick={handleConfirm}
            disabled={checkBox && !isChecked}
            className={`px-4 py-2 rounded-lg font-medium 
              ${isSuccess ? "bg-green-500" : "bg-red-500"} text-white
              ${checkBox && !isChecked ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 hover:bg-red-600"}`}
          >
            {checkBox ? "Confirm" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Snackbar;


