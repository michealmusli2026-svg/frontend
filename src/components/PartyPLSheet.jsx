import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrades } from "../redux/slice/trade";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { formatNumberIndian } from "../utils/numberForamt";
import { enumCall } from "../redux/slice/enums";
import { fetchParty, fetchUser, fetchUserTrade } from "../redux/slice/user"; // ✅ adjust to your actual user slice
import TradeHeader from "../components/TradeHeader";

const PartyPLSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getUserTrade = useSelector((state) => state.user?.trade);
  const fetchEnum = useSelector((state) => state.enum?.data);
  const fetchPartyData = useSelector((state) => state.user?.party);

  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  useEffect(() => {
    dispatch(enumCall());
    dispatch(fetchUser()); // ✅ FIXED: replaced undefined fetchUser()
    dispatch(
      fetchUserTrade({
        userId: userProfile.user.id,
        order: "DESC",
        complete: true,
        offset:0
      })
    );
    dispatch(fetchParty({ userId: userProfile.user.id }));
  }, [dispatch]);

  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Get unique commodities and parties for dropdowns
//   const commodities = useMemo(() => {
//     const set = new Set(trades.map((t) => t.commodity.value));
//     return Array.from(set);
//   }, [trades]);

//   const parties = useMemo(() => {
//     const set = new Set();
//     trades.forEach((t) => {
//       set.add(t.fromId.value);
//       set.add(t.toId.value);
//     });
//     return Array.from(set);
//   }, [trades]);

  const filteredTrades = useMemo(() => {
  return getUserTrade?.filter((trade) => {
    if (!trade?.createdAt) return false;
    if (!trade?.enterDate) return false;

    // Convert and normalize to date-only (ignore time)
    const tradeDate = new Date(trade.enterDate);
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

    const matchParty = selectedParty
      ? trade.fromId?.id === parseInt(selectedParty) ||  trade.toId?.id === parseInt(selectedParty) 
      : true;

   
    return isAfterStart && isBeforeEnd && matchCommodity && matchParty;
  });
}, [getUserTrade, startDate, endDate, selectedCommodity, selectedParty]);


  const displayedTrades = useMemo(() => {
    return filteredTrades?.map((trade) => {
      let purchase = trade.fromTotal.value;
      let sale = trade.toTotal.value;
      let profit = trade.profit.value;
      // Adjust values based on selected party logic
      if (selectedParty) {
        if (trade.fromId.id === parseInt(selectedParty)) {
          // from = purchase side → show all zero
          purchase = purchase;
          sale = 0;
          profit = 0;
        } else if (trade.toId.id === parseInt(selectedParty)) {
          // to = sale side → show sale & profit only
          purchase = 0;
          sale = sale;
          profit = profit
        }
      }

      return {
        ...trade,
        displayPurchase: parseFloat(purchase),
        displaySale: parseFloat(sale),
        displayProfit: parseFloat(profit),
      };
    });
  }, [filteredTrades, selectedParty]);

    const party = useMemo(() => fetchPartyData?.users || [], [fetchPartyData]);
    const commodities = useMemo(() => fetchEnum?.commodities || [], [fetchEnum]);
  return (
    // <div className="p-4 max-w-6xl mx-auto">
    //   <h2 className="text-xl font-bold mb-4">Trade Filter</h2>

    //   {/* Filters */}
    //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    //     <div>
    //       <label className="block text-sm font-medium mb-1">From Date</label>
    //       <input
    //         type="date"
    //         className="border p-2 rounded w-full"
    //         value={startDate}
    //         onChange={(e) => setStartDate(e.target.value)}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">To Date</label>
    //       <input
    //         type="date"
    //         className="border p-2 rounded w-full"
    //         value={endDate}
    //         onChange={(e) => setEndDate(e.target.value)}
    //       />
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Commodity</label>
    //       <select
    //         className="border p-2 rounded w-full"
    //         value={selectedCommodity}
    //         onChange={(e) => setSelectedCommodity(e.target.value)}
    //       >
    //         <option value="">All</option>
    //         {commodities.map((item) => (
    //           <option key={item.id} value={item.name}>
    //             {item.name}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     <div>
    //       <label className="block text-sm font-medium mb-1">Party</label>
    //       <select
    //         className="border p-2 rounded w-full"
    //         value={selectedParty}
    //         onChange={(e) => setSelectedParty(e.target.value)}
    //       >
    //         <option value="">All</option>
    //         {party
    //           .map((user) => (
    //             <option key={user.id} value={user.id}>
    //               {user.username}
    //             </option>
    //           ))}
    //       </select>
    //     </div>
    //   </div>

    //   {/* Table */}
    //   <table className="w-full border-collapse border text-sm">
    //     <thead>
    //       <tr className="bg-gray-100 text-left">
    //         <th className="border p-2">Date</th>
    //         <th className="border p-2">Commodity</th>
    //         <th className="border p-2">From</th>
    //         <th className="border p-2">To</th>
    //         <th className="border p-2 text-right">Purchase</th>
    //         <th className="border p-2 text-right">Sale</th>
    //         <th className="border p-2 text-right">Profit</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {displayedTrades?.length > 0 ? (
    //         displayedTrades?.map((t) => (
    //           <tr key={t.tradeId} className="hover:bg-gray-50">
    //             <td className="border p-2">
    //               {new Date(t.createdAt).toLocaleDateString()}
    //             </td>
    //             <td className="border p-2">{t.commodity.value}</td>
    //             <td className="border p-2">{t.fromId.value}</td>
    //             <td className="border p-2">{t.toId.value}</td>
    //             <td className="border p-2 text-right">
    //               {t.displayPurchase.toFixed(2)}
    //             </td>
    //             <td className="border p-2 text-right">
    //               {t.displaySale.toFixed(2)}
    //             </td>
    //             <td className="border p-2 text-right">
    //               {t.displayProfit.toFixed(2)}
    //             </td>
    //           </tr>
    //         ))
    //       ) : (
    //         <tr>
    //           <td className="p-4 text-center text-gray-500" colSpan={7}>
    //             No trades found
    //           </td>
    //         </tr>
    //       )}
    //     </tbody>
    //   </table>
    //     <div className="mt-6 flex justify-end">
    //     <div className="px-6 py-3 bg-gray-100 rounded-lg shadow-sm text-right">
    //       <p className="text-gray-700 font-medium">
    //         <span className="text-gray-500">Net Profit:</span>{" "}
    //         {/* <span className="text-green-600 font-bold">₹ 15,150.00</span> */}
    //         <span className="text-green-600 font-bold">
    //           ₹ {displayedTrades?.reduce((acc, trade) => acc + (trade.displayProfit || 0), 0)}
    //         </span>
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* <TradeHeader userProfile={userProfile} /> */}

  <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-slate-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7.5a1 1 0 001 1.5h12a1 1 0 001-1.5L17 13M7 13L5.4 6M17 13l1.6-7" />
      </svg>
      Party Profit
    </h2>

    {/* Filters */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          From Date
        </label>
        <input
          type="date"
          className="border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 rounded-lg px-3 py-2 w-full text-slate-700"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          To Date
        </label>
        <input
          type="date"
          className="border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 rounded-lg px-3 py-2 w-full text-slate-700"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Commodity
        </label>
        <select
          className="border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 rounded-lg px-3 py-2 w-full text-slate-700 bg-white"
          value={selectedCommodity}
          onChange={(e) => setSelectedCommodity(e.target.value)}
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
        <label className="block text-sm font-semibold text-slate-600 mb-2">
          Party
        </label>
        <select
          className="border border-slate-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 rounded-lg px-3 py-2 w-full text-slate-700 bg-white"
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
        >
          <option value="">Kindly Select Party</option>
          {party.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-slate-700">
        <thead className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wide">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Commodity</th>
            {/* <th className="p-3 text-left">From</th> */}
            {/* <th className="p-3 text-left">To</th> */}
            <th className="p-3 text-right">Purchase</th>
            <th className="p-3 text-right">Sale</th>
            <th className="p-3 text-right">Profit</th>
          </tr>
        </thead>
        <tbody>
          {displayedTrades?.length > 0  && selectedParty !== ""? (
            displayedTrades.map((t) => (
              <tr
                key={t.tradeId}
                className="hover:bg-indigo-50 transition-colors duration-150 border-t"
              >
                <td className="p-3">{new Date(t.enterDate).toLocaleDateString()}</td>
                <td className="p-3">{t.commodity.value}</td>
                {/* <td className="p-3">{t.fromId.value}</td> */}
                {/* <td className="p-3">{t.toId.value}</td> */}
                <td className="p-3 text-right font-medium text-slate-600">
                  {formatNumberIndian(t.displayPurchase)}
                </td>
                <td className="p-3 text-right font-medium text-slate-600">
                  {formatNumberIndian(t.displaySale)}
                </td>
                <td
                  className={`p-3 text-right font-semibold ${
                    formatNumberIndian(t.displayProfit) >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {formatNumberIndian(t.displayProfit)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-6 text-center text-slate-400" colSpan={7}>
                Kindly Select Party
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Summary */}
    <div className="mt-6 flex justify-end">
      <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl shadow-sm">
        <p className="text-slate-700 font-semibold text-lg">
          Net Profit:{" "}
          <span className="text-emerald-600 font-bold">
            ₹{" "}
            {selectedParty == "" ? 0 :
            formatNumberIndian(displayedTrades
              ?.reduce((acc, trade) => acc + (trade.displayProfit || 0), 0)
              )
            }
          </span>
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default PartyPLSheet;
