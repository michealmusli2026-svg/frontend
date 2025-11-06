import React from "react";
import { FaPlus, FaTrash, FaUserPlus, FaTable } from "react-icons/fa";

const UserManagement = ({
  handleSubmit,
  formData,
  handleChange,
  enumData,
  handleAddHolding,
  handleHoldingChange,
  handleRemoveHolding,
  userData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ==== User Form ==== */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaUserPlus className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Add / Edit User</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input
              name="Ref"
              value={formData.Ref}
              onChange={handleChange}
              placeholder="Enter reference"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\+?\d{0,13}$/.test(value)) handleChange(e);
              }}
              placeholder="Enter mobile number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {formData.mobile &&
              !/^(\+?\d[\d\s]{11,14})$/.test(formData.mobile) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid mobile number.
                </p>
              )}
          </div>

          {/* Alt Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Mobile No.</label>
            <input
              name="altMobile"
              value={formData.altMobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\+?\d{0,13}$/.test(value)) handleChange(e);
              }}
              placeholder="Enter alternate number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formData.altMobile &&
              !/^(\+?\d[\d\s]{11,14})$/.test(formData.altMobile) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid mobile number.
                </p>
              )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp No.</label>
            <input
              name="whatApp"
              value={formData.whatApp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\+?\d{0,13}$/.test(value)) handleChange(e);
              }}
              placeholder="Enter WhatsApp number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {formData.whatApp &&
              !/^(\+?\d[\d\s]{11,14})$/.test(formData.whatApp) && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter a valid mobile number.
                </p>
              )}
          </div>

          {/* Opening Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
            <input
              name="openingBalance"
              type="number"
              value={formData.openingBalance}
              onChange={handleChange}
              placeholder="Enter balance"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              // value={formData.role}
              value={3}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled
            >
              <option value="">Select Role</option>
              {enumData?.roles?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Format (only if role !== 3) */}
          {/* {formData?.role !== 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                name="currencyFormat"
                value={formData.currencyFormat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Currency</option>
                {enumData?.currencies?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          )} */}
        </div>


        {/* ==== Commodities Holding ==== */}
        {/* {formData?.role !== 3 ? (
          <>
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Commodities Holding
                </label>
                <button
                  type="button"
                  onClick={handleAddHolding}
                  className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 font-medium transition"
                >
                  <FaPlus className="text-xs" /> Add Commodity
                </button>
              </div>

              {formData.commoditiesHolding.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 mb-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                >
                  <select
                    value={item.commoditiesId}
                    onChange={(e) =>
                      handleHoldingChange(index, "commoditiesId", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="">Select Commodity</option>
                    {enumData?.commodities?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleHoldingChange(index, "quantity", e.target.value)
                    }
                    className="w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="Qty"
                  />

                  {formData.commoditiesHolding.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHolding(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>) : ""} */}

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Save User
        </button>
      </form>

      {/* ==== User Table ==== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <FaTable className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">User List</h2>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Mobile No.</th>
              <th className="p-2 border">Alt Mobile No.</th>
              <th className="p-2 border">WhatApp No.</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Role</th>
              {/* <th className="p-2 border">Holdings</th> */}
            </tr>
          </thead>
          <tbody>
            {userData?.users?.length ? (
              userData.users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="p-2 border">{user.username}</td>
                  <td className="p-2 border">{user.mobile}</td>
                  <td className="p-2 border">{user.altMobile}</td>
                  <td className="p-2 border">{user.whatApp}</td>
                  <td className="p-2 border">{user.balance}</td>
                  <td className="p-2 border">{user.role}</td>
                  {/* <td className="p-2 border">
                    {user.holdings?.length
                      ? user.holdings
                        .map((h) => `${h.commodityName} (${h.quantity})`)
                        .join(", ")
                      : "—"}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
