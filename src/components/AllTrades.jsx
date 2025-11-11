import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrades } from "../redux/slice/trade";
import { enumCall } from "../redux/slice/enums";
import { fetchParty, fetchUser, fetchUserTrade } from "../redux/slice/user"; // ✅ adjust to your actual user slice
import * as XLSX from "xlsx";

const AllTrades = () => {
  const dispatch = useDispatch();

  const trades = useSelector((state) => state.trade?.list || []);
  const fetchEnum = useSelector((state) => state.enum?.data);
  const fetchUserData = useSelector((state) => state.user?.data);
  const fetchPartyData = useSelector((state) => state.user?.party);
  const getUserTrade = useSelector((state) => state.user?.trade);

  const users = useMemo(() => fetchUserData?.users || [], [fetchUserData]);
  const party = useMemo(() => fetchPartyData?.users || [], [fetchPartyData]);
  const commodities = useMemo(() => fetchEnum?.commodities || [], [fetchEnum]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");
  const userProfile = useMemo(() => JSON.parse(localStorage.getItem("userData")), []);

  // --- Fetch data ---
  useEffect(() => {
    dispatch(getAllTrades());
    dispatch(enumCall());
    dispatch(fetchUser()); // ✅ FIXED: replaced undefined fetchUser()
    dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "DESC" }));
      dispatch(fetchParty({ userId: userProfile.user.id }));
  }, [dispatch]);

  // --- Filter logic ---
  // const filteredTrades = useMemo(() => {
  //   return trades?.filter((trade) => {
  //     const tradeDate = new Date(trade.createdAt);
  //     const isAfterStart = startDate ? tradeDate >= new Date(startDate) || tradeDate == new Date(startDate) : true;
  //     const isBeforeEnd = endDate ? tradeDate <= new Date(endDate) ||tradeDate == new Date(endDate): true;
  //     const matchCommodity = selectedCommodity
  //       ? trade.commodity?.value === selectedCommodity
  //       : true;

  //     const matchFrom = selectedFrom
  //       ? trade.fromId?.id === parseInt(selectedFrom)
  //       : true;

  //     const matchTo = selectedTo
  //       ? trade.toId?.id === parseInt(selectedTo)
  //       : true;

  //     return (
  //       isAfterStart && isBeforeEnd && matchCommodity && matchFrom && matchTo
  //     );
  //   });
  // }, [trades, startDate, endDate, selectedCommodity, selectedFrom, selectedTo]);

  const filteredTrades = useMemo(() => {
  return getUserTrade?.filter((trade) => {
    if (!trade?.createdAt) return false;

    // Convert and normalize to date-only (ignore time)
    const tradeDate = new Date(trade.createdAt);
    const tradeDateOnly = new Date(
      tradeDate.getFullYear(),
      tradeDate.getMonth(),
      tradeDate.getDate()
    );

    const start = startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
      : null;
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    const isAfterStart = start ? tradeDateOnly >= start : true;
    const isBeforeEnd = end ? tradeDateOnly <= end : true;

    const matchCommodity = selectedCommodity
      ? trade.commodity?.value === selectedCommodity
      : true;

    const matchFrom = selectedFrom
      ? trade.fromId?.id === parseInt(selectedFrom)
      : true;

    const matchTo = selectedTo
      ? trade.toId?.id === parseInt(selectedTo)
      : true;

    return isAfterStart && isBeforeEnd && matchCommodity && matchFrom && matchTo;
  });
}, [getUserTrade, startDate, endDate, selectedCommodity, selectedFrom, selectedTo]);


  // --- Download Excel ---
  // const handleDownloadExcel = () => {
  //   if (!filteredTrades?.length) {
  //     alert("No trades to export!");
  //     return;
  //   }

  //   const dataToExport = filteredTrades.map((t) => ({
  //     "Trade ID": t.tradeId,
  //     Initiator: t.initiator?.value,
  //     Nature: t.nature?.value,
  //     "From Party": t.fromId?.value,
  //     "To Party": t.toId?.value,
  //     Commodity: t.commodity?.value,
  //     "From Total": t.fromTotal?.value,
  //     "To Total": t.toTotal?.value,
  //     Profit: t.profit?.value,
  //     Date: new Date(t.createdAt).toLocaleString(),
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Trades");
  //   XLSX.writeFile(workbook, "Trade_History.xlsx");
  // };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trade List</h1>
        {/* <button
          onClick={handleDownloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Export Excel
        </button> */}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-3 py-2 w-44"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-3 py-2 w-44"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Commodity
          </label>
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="border rounded-md px-3 py-2 w-44"
          >
            <option value="">All</option>
            {commodities.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            From Party
          </label>
          <select
            value={selectedFrom}
            onChange={(e) => setSelectedFrom(e.target.value)}
            className="border rounded-md px-3 py-2 w-44"
          >
            <option value="">All</option>
            {/* {users
              ?.filter((user) => user.role !== "user")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))} */}
                {party
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            To Party
          </label>
          <select
            value={selectedTo}
            onChange={(e) => setSelectedTo(e.target.value)}
            className="border rounded-md px-3 py-2 w-44"
          >
            <option value="">All</option>
            {/* {users
              ?.filter(
                (user) => user.id != selectedFrom && user.role !== "user"
              )
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))} */}
              {party
              
              ?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-left">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Commodity</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2 text-right">From Total</th>
              <th className="px-4 py-2 text-right">To Total</th>
              <th className="px-4 py-2 text-right">Profit</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades?.length > 0 ? (
              filteredTrades?.map((t) => (
                <>
                  <tr
                    key={t.tradeId}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{t.commodity?.value}</td>
                    <td className="px-4 py-2">{t.fromId?.value}</td>
                    <td className="px-4 py-2">{t.toId?.value}</td>
                    <td className="px-4 py-2 text-right text-red-600">
                      {t.fromTotal?.value}
                    </td>
                    <td className="px-4 py-2 text-right text-green-600">
                      {t.toTotal?.value}
                    </td>
                    <td className="px-4 py-2 text-right text-green-600">
                      {t.profit?.value}
                    </td>
                  </tr>
                </>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No trades found for selected filters
                </td>
              </tr>
            )}
           
          </tbody>
        </table>
          <div className="mt-6 flex justify-end">
        <div className="px-6 py-3 bg-gray-100 rounded-lg shadow-sm text-right">
          <p className="text-gray-700 font-medium">
            <span className="text-gray-500">Net Profit:</span>{" "}
            {/* <span className="text-green-600 font-bold">₹ 15,150.00</span> */}
            <span className="text-green-600 font-bold">
              ₹ {filteredTrades?.reduce((acc, trade) => acc + (trade.profit?.value || 0), 0)}
            </span>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AllTrades;
