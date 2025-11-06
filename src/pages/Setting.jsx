import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommodity, enumCall } from "../redux/slice/enums";
import { createCustomer, createUser, fetchUser } from "../redux/slice/user";
import { FaPlus, FaTrash } from "react-icons/fa";
import AllTrades from "../components/AllTrades";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import Snackbar from "../components/Snackbar";

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [formData, setFormData] = useState({
    username: "",
    Ref: "",
    password: "",
    mobile: "",
    altMobile: "",
    whatApp: "",
    role: 3,
    openingBalance: 0,
    currencyFormat: null,
    commoditiesHolding: [{ commoditiesId: null, quantity: null }],
  });

  const [newCommodity, setNewCommodity] = useState("");
  const [showAddCommodity, setShowAddCommodity] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const enumData = useSelector((state) => state.enum?.data);
  const userData = useSelector((state) => state.user?.data);
  useEffect(() => {
    dispatch(enumCall());
    dispatch(fetchUser());
  }, [dispatch]);

  // ========== Form Handlers ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, ":", value);
    if (
      name == "openingBalance" ||
      name == "role" ||
      name == "currencyFormat"
    ) {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHoldingChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.commoditiesHolding];
      updated[index][key] = Number(value);
      return { ...prev, commoditiesHolding: updated };
    });
  };

  const handleAddHolding = () => {
    setFormData((prev) => ({
      ...prev,
      commoditiesHolding: [
        ...prev.commoditiesHolding,
        { commoditiesId: "", quantity: "" },
      ],
    }));
  };

  const handleRemoveHolding = (index) => {
    setFormData((prev) => ({
      ...prev,
      commoditiesHolding: prev.commoditiesHolding.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.role === 3) {
      dispatch(createCustomer(formData))
        .then((res) => {
          console.log("User Submitted:", res?.meta?.requestStatus);
          if (res?.meta?.requestStatus == "fulfilled") {
            setSnackbar({
              visible: true,
              type: "success",
              message: "User Created successfully!",
            });
            dispatch(fetchUser());
          } else {
            setSnackbar({
              visible: true,
              type: "error",
              message: res?.payload?.error,
            });
          }
        })
        .catch((err) => console.log("Error Creating Customer:", err));
    } else {
      dispatch(createUser(formData))
        .then((res) => {
          console.log("Customer Created:", res);
          if (res?.meta?.requestStatus == "fullfilled") {
            dispatch(fetchUser());
          }
        })
        .catch((err) => console.log("Error Creating User:", err));
    }
  };

  // ========== Commodities ==========
  const handleAddCommodity = () => {
    if (!newCommodity.trim()) return;
    dispatch(addCommodity({ name: newCommodity })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSnackbar({
          visible: true,
          type: "success",
          message: "Commodity Added successfully!",
        });
        setShowAddCommodity(false)
        setNewCommodity("")
        dispatch(enumCall());
      } else {
        setSnackbar({
          visible: true,
          type: "error",
          message: "Failed to Add Commodity.",
        });
      }
    });
  };

  return (
    <div className="p-6">
      {/* ===== Navbar ===== */}

      <div className="flex item-center justify-around space-x-6 border-b border-gray-300 mb-6">
        <button onClick={() => navigate("/trade")}>Back</button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "users"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User List
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "commodities"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("commodities")}
        >
          Commodities List
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "userTradeList"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("userTradeList")}
        >
          User Trade List
        </button>
      </div>

      {/* ===== USER LIST TAB ===== */}
      {activeTab === "users" && (
        // <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        //     {/* ==== User Form ==== */}
        //     <form
        //         onSubmit={handleSubmit}
        //         className="p-6 bg-white rounded-2xl shadow"
        //     >
        //         <h2 className="text-lg font-semibold mb-4">Add / Edit User</h2>

        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Username</label> */}
        //             <input
        //                 name="username"
        //                 value={formData.username}
        //                 onChange={handleChange}
        //                 placeholder="Username"
        //                 className="w-full border rounded px-3 py-2"
        //                 required
        //             />
        //         </div>

        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Email</label> */}
        //             <input
        //                 name="email"
        //                 type="email"
        //                 value={formData.email}
        //                 onChange={handleChange}
        //                 className="w-full border rounded px-3 py-2"
        //                 placeholder="Email"
        //                 required
        //             />
        //         </div>

        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Password</label> */}
        //             <input
        //                 name="password"
        //                 type="password"
        //                 value={formData.password}
        //                 onChange={handleChange}
        //                 className="w-full border rounded px-3 py-2"
        //                 placeholder="Temporary Password"
        //                 required
        //             />
        //         </div>

        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Role</label> */}
        //             <select
        //                 name="role"
        //                 value={formData.role}
        //                 onChange={handleChange}
        //                 className="w-full border rounded px-3 py-2"

        //                 required
        //             >
        //                 <option value="">Select Role</option>
        //                 {enumData?.roles?.map((r) => (
        //                     <option key={r.id} value={r.id}>
        //                         {r.name}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Balance</label> */}
        //             <input
        //                 name="balance"
        //                 value={formData.balance}
        //                 onChange={handleChange}
        //                 type="number"
        //                 placeholder="Balance"
        //                 className="w-full border rounded px-3 py-2"
        //             />
        //         </div>
        //         <div className="mb-3">
        //             {/* <label className="block text-sm font-medium">Currency Format</label> */}
        //             <select
        //                 name="currencyFormat"
        //                 value={formData.currencyFormat}
        //                 onChange={handleChange}
        //                 className="w-full border rounded px-3 py-2"
        //                 required
        //             >
        //                 <option value="">Select Currency</option>
        //                 {enumData?.currencies?.map((r) => (
        //                     <option key={r.id} value={r.id}>
        //                         {r.code}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>
        //         {/* ===== Holdings ===== */}
        //         <div className="mb-3">
        //             <div className="flex items-center justify-between mb-2">
        //                 <label className="block text-sm font-medium justify-between">
        //                     Commodities Holding
        //                 </label>
        //                 <button
        //                     type="button"
        //                     onClick={handleAddHolding}
        //                     className="flex items-center text-blue-600 text-sm hover:text-blue-800"
        //                 >
        //                     <FaPlus className="mr-1" /> Add Commodity
        //                 </button>
        //             </div>

        //             {formData.commoditiesHolding.map((item, index) => (
        //                 <div
        //                     key={index}
        //                     className="flex items-center space-x-2 mb-2 border p-2 rounded"
        //                 >
        //                     <select
        //                         value={item.commoditiesId}
        //                         onChange={(e) =>
        //                             handleHoldingChange(index, "commoditiesId", e.target.value)
        //                         }
        //                         className="flex-1 border rounded px-2 py-1"
        //                     >
        //                         <option value="">Select Commodity</option>
        //                         {enumData?.commodities?.map((c) => (
        //                             <option key={c.id} value={c.id}>
        //                                 {c.name}
        //                             </option>
        //                         ))}
        //                     </select>

        //                     <input
        //                         type="number"
        //                         value={item.quantity}
        //                         onChange={(e) =>
        //                             handleHoldingChange(index, "quantity", e.target.value)
        //                         }
        //                         className="w-24 border rounded px-2 py-1"
        //                         placeholder="Qty"
        //                     />

        //                     {formData.commoditiesHolding.length > 1 && (
        //                         <button
        //                             type="button"
        //                             onClick={() => handleRemoveHolding(index)}
        //                             className="text-red-600 hover:text-red-800"
        //                         >
        //                             <FaTrash />
        //                         </button>
        //                     )}
        //                 </div>
        //             ))}
        //         </div>

        //         <button
        //             type="submit"
        //             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        //         >
        //             Save User
        //         </button>
        //     </form>

        //     {/* ==== User Table ==== */}
        //     <div className="overflow-x-auto bg-white rounded-2xl shadow p-6">
        //         <h2 className="text-lg font-semibold mb-4">User List</h2>
        //         <table className="w-full text-sm border-collapse">
        //             <thead>
        //                 <tr className="bg-gray-100 text-left">
        //                     <th className="p-2 border">Username</th>
        //                     <th className="p-2 border">Email</th>
        //                     <th className="p-2 border">Role</th>
        //                     <th className="p-2 border">Balance</th>
        //                     <th className="p-2 border">Holdings</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {userData?.users?.map((user) => (
        //                     <tr key={user.id} className="hover:bg-gray-50">
        //                         <td className="p-2 border">{user.username}</td>
        //                         <td className="p-2 border">{user.email}</td>
        //                         <td className="p-2 border">{user.role}</td>
        //                         <td className="p-2 border">{user.balance}</td>
        //                         <td className="p-2 border">
        //                             {user.holdings?.length
        //                                 ? user.holdings
        //                                     .map(
        //                                         (h) => `${h.commodityName} (${h.quantity})`
        //                                     )
        //                                     .join(", ")
        //                                 : "—"}
        //                         </td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </table>
        //     </div>
        // </div>
        <UserManagement
          handleSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          enumData={enumData}
          handleAddHolding={handleAddHolding}
          handleHoldingChange={handleHoldingChange}
          handleRemoveHolding={handleRemoveHolding}
          userData={userData}
        />
      )}

      {/* ===== COMMODITIES LIST TAB ===== */}
      {activeTab === "commodities" && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Commodities List</h2>
            {/* <button
              onClick={() => setShowAddCommodity((prev) => !prev)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus size={14} />
              <span>Add Commodity</span>
            </button> */}
          </div>

          {showAddCommodity && (
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Enter Commodity Name"
                value={newCommodity}
                onChange={(e) => setNewCommodity(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={handleAddCommodity}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          )}

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
              </tr>
            </thead>
            <tbody>
              {enumData?.commodities?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "userTradeList" && <AllTrades />}
      <div>
        {snackbar.visible && (
          <Snackbar
            type={snackbar.type}
            message={snackbar.message}
            onClose={() =>
              setSnackbar({ visible: false, type: "", message: "" })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Setting;
