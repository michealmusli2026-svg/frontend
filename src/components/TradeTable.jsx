import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTrade, executeTrade, updateTrade } from "../redux/slice/trade";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaClock,
  FaTrashAlt,
  FaPlayCircle,
  FaExchangeAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchUserTrade } from "../redux/slice/user";
import Snackbar from "./Snackbar";
import { formatNumberIndian } from "../utils/numberForamt";
const TradeTable = ({ tradeList, handleLedger }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
   const [editingRow, setEditingRow] = useState(null);
  const [noteValue, setNoteValue] = useState("");
  const [snackbar, setSnackbar] = useState({
    visible: false,
    type: "",
    message: "",
  });
  const userProfile = useMemo(
      () => JSON.parse(localStorage.getItem("userData")),
      []
    );

  const sortedData =
    tradeList?.length > 0
      ? [...tradeList].sort((a, b) => {
          if (!sortConfig.key) return 0;
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          if (typeof aValue === "object") return 0;
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        })
      : [];

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const handleExecuteTrade = (trade) => {
    const tradeData = {
      tradeId: trade.tradeId,
      buyerId: trade.buyer.id,
      nature: trade.nature.id,
      sellerId: trade.seller.id,
      commoditiesId: trade.commodity.id,
      rate: trade.rate,
      quantity: trade.quantity,
      totalAmount: trade.totalAmount,
      noteID: null,
      initiatorId: trade.buyer.id,
      paymentStatus: 1,
    };
    dispatch(executeTrade(tradeData))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setSnackbar({
            visible: true,
            type: "success",
            message: "Trade executed successfully!",
          });
        } else {
          setSnackbar({
            visible: true,
            type: "error",
            message: "Failed to execute trade.",
          });
        }
        dispatch(
          fetchUserTrade({ userId: userProfile.user.id, order: "DESC" })
        );
      })
      .catch(() =>
        setSnackbar({
          visible: true,
          type: "error",
          message: "An unexpected error occurred.",
        })
      );
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="inline ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-1 text-blue-500" />
    );
  };

  const handleDeleteTrade = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trade?"
    );
    if (confirmDelete) {
      dispatch(deleteTrade(id))
      .then((res) => {
        console.log(res)
                if (res.meta.requestStatus === "fulfilled") {
                  setSnackbar({
                    visible: true,
                    type: "success",
                    message: "Trade Deleted successfully!",
                  });
                } else {
                  setSnackbar({
                    visible: true,
                    type: "error",
                    message: "Failed to delete trade.",
                  });
                }
                dispatch(
                  fetchUserTrade({ userId: userProfile.user.id, order: "DESC" })
                );
              })
              .catch(() =>
                setSnackbar({
                  visible: true,
                  type: "error",
                  message: "An unexpected error occurred.",
                })
              );
    }
  };

  const handleNoteEdit = (tradeId, currentNote) => {
    setEditingRow(tradeId);
    setNoteValue(currentNote || "");
  };
   const handleNoteSave = async (tradeId) => {
    try {
      // Example: you can integrate this with your backend update API
      dispatch(updateTrade({ id: tradeId, note: noteValue }))
      .then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                  setSnackbar({
                    visible: true,
                    type: "success",
                    message: "Note updated successfully!",
                  });
                } else {
                  setSnackbar({
                    visible: true,
                    type: "error",
                    message: "Failed to execute trade.",
                  });
                }
                dispatch(
                  fetchUserTrade({ userId: userProfile.user.id, order: "DESC" })
                );
              })
              .catch(() =>
                setSnackbar({
                  visible: true,
                  type: "error",
                  message: "An unexpected error occurred.",
                })
              );
      // setSnackbar({ visible: true, type: "success", message: "Note updated successfully!" });
      setEditingRow(null);
      dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "DESC" }));
    } catch (err) {
      setSnackbar({ visible: true, type: "error", message: "Failed to update note." });
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaExchangeAlt className="text-blue-600" />
          Trade Records
        </h2>
        <span className="text-gray-500 text-sm">
          Total: {tradeList?.length || 0} trades
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Created At", key: "createdAt" },
                { label: "Commodity", key: "commodity" },
                { label: "From", key: "fromId" },
                { label: "From Quantity", key: "fromQuantity" },
                { label: "From Rate", key: "fromRate" },
                { label: "From Total", key: "fromTotal" },
                { label: "To", key: "toId" },
                { label: "To Quantity", key: "toQuantity" },
                { label: "To Rate", key: "toRate" },
                { label: "To Total", key: "toTotal" },
                { label: "Profit", key: "profit" },
                // { label: "Payment Status", key: "paymentStatus" },
                { label: "Action", key: null },
              ].map(({ label, key }, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 select-none"
                  onClick={() => key && requestSort(key)}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ////////// */}
            {sortedData.length > 0 ? (
              sortedData.map((item, index) => {
                const isPaid =
                  item.paymentStatus?.value === "paid" ||
                  item.paymentStatus === "paid";
                const isEditing = editingRow === item.tradeId;


                return (
                  <React.Fragment key={index}>
                    <tr
                      className={`border-t text-sm transition-all ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      {/* Created At */}
                      <td className="px-4 py-2 text-gray-700 font-medium">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Commodity */}
                      <td className="px-4 py-2 text-gray-800 font-semibold">
                        {item.commodity.value}
                      </td>

                      {/* From Details */}
                      <td
                        className="px-4 py-2 cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleLedger(item.fromId.value)}
                      >
                        {item.fromId.value}
                      </td>
                      <td className="px-4 py-2">{item.fromQuantity.value}</td>
                      {/* <td className="px-4 py-2">{item.fromRate.value}</td> */}
                      <td className="px-4 py-2">{formatNumberIndian(item.fromRate.value)}</td>
                      {/* <td className="px-4 py-2">{item.fromTotal.value}</td> */}
                      <td className="px-4 py-2">{formatNumberIndian(item.fromTotal.value)}</td>

                      {/* To Details */}
                      <td
                        className="px-4 py-2 cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleLedger(item.toId.value)}
                      >
                        {item.toId.value}
                      </td>
                      <td className="px-4 py-2">{item.toQuantity.value}</td>
                      <td className="px-4 py-2">{item.toRate.value}</td>
                      <td className="px-4 py-2">{formatNumberIndian(item.toTotal.value)}</td>

                      {/* Profit */}
                      <td className="px-4 py-2">{formatNumberIndian(item.profit.value)}</td>

                      {/* Action Buttons */}
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {index === 0 && (
                            <button
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white text-sm font-semibold shadow transition-all ${
                                isPaid
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                              onClick={() => handleDeleteTrade(item.tradeId)}
                              disabled={isPaid}
                            >
                              <FaTrashAlt />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* ✅ Note Row */}
                    {/* <tr className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} border-b`}>
          <td colSpan="12" className="px-4 pb-2 text-sm text-gray-600 italic">
            📝 <span className="font-medium">Remark:</span>{" "}
            {item.note?.trim() ? item.note : "No Remark added"}
            <span className="mr-[2px]">
            <input type="checkbox" />
            <label className="ml-4 font-medium">{item.commodity.value} Delivered  </label>    
            </span>
          </td>
        </tr> */}
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-b`}
                    >
                      <td colSpan="12" className="px-4 py-2 text-sm text-gray-700 italic">
                        📝 <span className="font-medium">Remark:</span>{" "}
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={noteValue}
                              onChange={(e) => setNoteValue(e.target.value)}
                              className="border border-gray-300 rounded-md px-2 py-1 ml-2 text-gray-800 w-1/2"
                              placeholder="Enter remark..."
                            />
                            <button
                              onClick={() => handleNoteSave(item.tradeId)}
                              className="ml-3 px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingRow(null)}
                              className="ml-2 px-3 py-1 bg-gray-400 text-white rounded-md text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {item.note?.trim() ? item.note : "No Remark added"}
                            <button
                              onClick={() => handleNoteEdit(item.tradeId, item.note)}
                              className="ml-3 px-2 py-1 text-blue-600 text-xs font-medium underline"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-500">
                  No trades found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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

export default TradeTable;
