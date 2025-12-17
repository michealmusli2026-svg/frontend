import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrades } from "../redux/slice/trade";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { formatNumberIndian } from "../utils/numberForamt";
import { fetchUserTrade } from "../redux/slice/user";
import TradeHeader from "../components/TradeHeader";
import PartyPLSheet from "./PartyPLSheet";
const ITEMS_PER_PAGE = 10;

const PLSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPartyView, setIsPartyView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const trades = useSelector((state) => state.trade?.list || []);
  const getUserTrade = useSelector((state) => state.user?.trade);
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  useEffect(() => {
    dispatch(getAllTrades());
    dispatch(
      fetchUserTrade({
        userId: userProfile.user.id,
        order: "DESC",
        complete: true,
        offset: 0,
      })
    );
  }, [dispatch]);

  const groupedData = useMemo(() => {
    const dailyPL = {};
    getUserTrade?.forEach((trade) => {
      const date = new Date(trade.enterDate).toLocaleDateString("en-GB"); // DD/MM/YYYY

    
      if (!dailyPL[date]) {
        dailyPL[date] = {
          "Total Profit": 0,
          "Total Expense": 0,
          "Total Services": 0,
          "Total Loss": 0,
        };
      }
      const from = trade.fromId.value;
      const fromQuantity = Number(trade.fromQuantity.value);
      const to = trade.toId.value;
      const toQuantity = Number(trade.toQuantity.value);
      const profit = trade.profit.value;
      if (from == "Services") {
        dailyPL[date]["Total Services"] =
          (dailyPL[date]["Total Services"] || 0) - fromQuantity;
      }
      if (to == "Services") {
        dailyPL[date]["Total Services"] =
          (dailyPL[date]["Total Services"] || 0) + toQuantity;
      }
      if (from == "Expense") {
        dailyPL[date]["Total Expense"] =
          (dailyPL[date]["Total Expense"] || 0) + fromQuantity;
      }
      if (to == "Expense") {
        dailyPL[date]["Total Expense"] =
          (dailyPL[date]["Total Expense"] || 0) + toQuantity;
      }
      if (to == "Loss") {
        dailyPL[date]["Total Loss"] =
          (dailyPL[date]["Total Loss"] || 0) + toQuantity;
      }

      dailyPL[date]["Total Profit"] =
        (dailyPL[date]["Total Profit"] || 0) + profit;
    });
    return dailyPL;
  }, [getUserTrade]);
 const sortedEntries = useMemo(() => {
    return Object.entries(groupedData).sort(
      ([a], [b]) =>
        new Date(b.split("/").reverse().join("-")) -
        new Date(a.split("/").reverse().join("-"))
    );
  }, [groupedData]);

  const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedEntries, currentPage]);

  /* ---------------- NET PROFIT ---------------- */
  const netProfit = useMemo(() => {
    const profit = Object.values(groupedData).reduce(
      (sum, val) => sum + (val["Total Profit"] || 0),
      0
    );

    const expense = Object.values(groupedData).reduce(
      (sum, val) =>
        sum +
        (val["Total Services"] || 0) +
        (val["Total Expense"] || 0) +
        (val["Total Loss"] || 0),
      0
    );

    return profit - expense;
  }, [groupedData]);
  return (
    <div className=" mx-auto  bg-white min-h-screen shadow-lg rounded-2xl">
      <TradeHeader userProfile={userProfile} />

      <div className="flex justify-between items-center mb-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
        >
          <FaArrowLeft className="text-lg" />
          Back
        </button>

        {/* Centered Dual Headers */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-7">
          <button
            onClick={() => setIsPartyView(false)}
            className={`text-xl font-bold transition-all ${
              !isPartyView
                ? "text-blue-600 underline underline-offset-4"
                : "text-gray-800 hover:text-blue-600"
            }`}
          >
            Daily Profit & Loss Sheet
          </button>

          <button
            onClick={() => setIsPartyView(true)}
            className={`text-xl font-bold transition-all ${
              isPartyView
                ? "text-blue-600 underline underline-offset-4"
                : "text-gray-800 hover:text-blue-600"
            }`}
          >
            Party Profit & Loss Sheet
          </button>
        </div>

        <div className="w-[60px]" />
      </div>
      {!isPartyView ? (
        <>
          <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 shadow-sm">
                <tr className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white">
                  <th
                    colSpan="3"
                    className="px-4 py-4 text-center text-xl font-bold tracking-wide border-r border-white/30"
                  >
                    Profit
                  </th>
                  <th
                    colSpan="4"
                    className="px-4 py-4 text-center text-xl font-bold tracking-wide"
                  >
                    Expense
                  </th>
                </tr>

                <tr className="bg-white/90 text-gray-700 uppercase font-semibold text-xs tracking-wide">
                  <th className="px-3 py-2 border border-gray-200">Date</th>
                  <th className="px-3 py-2 border border-gray-200">
                    Particular
                  </th>
                  <th className="px-3 py-2 border border-gray-200 text-center">
                    Amount
                  </th>
                  <th className="px-3 py-2 border border-gray-200">Date</th>
                  <th className="px-3 py-2 border border-gray-200">
                    Particular
                  </th>
                  <th className="px-3 py-2 border border-gray-200 text-center">
                    Amount
                  </th>
                  <th className="px-3 py-2 border border-gray-200 text-center">
                    Closing Balance
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map(([date, values]) => (
                // {Object.entries(groupedData).map(([date, values], index) => (
                  <tr
                    key={date}
                    className="even:bg-gray-50 hover:bg-blue-50 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 border-b border-gray-200"
                  >
                    <td className="px-3 py-2 font-medium text-gray-800 border">
                      {date}
                    </td>
                    <td className="px-3 py-2 text-gray-700 border">
                      Total Profit
                    </td>

                    <td className="px-3 py-2 text-center border">
                      <span className="px-2 py-1 rounded-lg bg-green-100 text-green-700 font-bold shadow-sm">
                        ₹{" "}
                        {formatNumberIndian(values["Total Profit"]?.toFixed(2))}
                      </span>
                    </td>

                    <td className="px-3 py-2 text-gray-700 border">{date}</td>

                    <td className="px-3 py-2 border text-gray-700 font-semibold space-y-1">
                      <div>Total Service</div>
                      <div>Total Expense</div>
                      <div>Total Loss</div>
                    </td>

                    <td className="px-3 py-2 border text-center space-y-1">
                      <div className="px-2 py-1 rounded-md bg-red-100 text-red-600 font-bold shadow-sm">
                        ₹{" "}
                        {formatNumberIndian(
                          values["Total Services"]?.toFixed(2)
                        )}
                      </div>
                      <div className="px-2 py-1 rounded-md bg-amber-100 text-amber-600 font-bold shadow-sm">
                        ₹{" "}
                        {formatNumberIndian(
                          values["Total Expense"]?.toFixed(2)
                        )}
                      </div>
                      <div className="px-2 py-1 rounded-md bg-red-200 text-red-700 font-bold shadow-sm">
                        ₹ {formatNumberIndian(values["Total Loss"]?.toFixed(2))}
                      </div>
                    </td>

                    <td className="px-3 py-2 text-center border">
                      <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-600 font-bold shadow-sm">
                        ₹
                        {formatNumberIndian(
                          (
                            values["Total Profit"] -
                            (values["Total Services"] +
                              values["Total Expense"] +
                              values["Total Loss"])
                          ).toFixed(2)
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="px-6 py-3 bg-gray-100 rounded-lg shadow-sm text-right">
              <p className="text-gray-700 font-medium">
                <span className="text-gray-500">Net Profit:</span>{" "}
                {/* <span className="text-green-600 font-bold">₹ 15,150.00</span> */}
                <span className="text-green-600 font-bold">
                  ₹
                  {
                    // Object.values(groupedData)
                    //   .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
                    //   .toFixed(2) -
                    //   Object.values(groupedData)
                    //     .reduce((sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]), 0)
                    //     .toFixed(2) >
                    // 0
                    formatNumberIndian(
                      (
                        Object.values(groupedData)
                          .reduce(
                            (sum, val) => sum + (val["Total Profit"] || 0),
                            0
                          )
                          .toFixed(2) -
                        Object.values(groupedData)
                          .reduce(
                            (sum, val) =>
                              sum +
                              (val["Total Services"] || 0) +
                              val["Total Expense"] +
                              val["Total Loss"],
                            0
                          )
                          .toFixed(2)
                      ).toFixed(2)
                    )
                    // : 0
                  }
                </span>
              </p>
            </div>
          </div>

<div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ⏮ First
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ◀ Previous
            </button>

            <span className="px-4 py-1 bg-blue-100 rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ▶
            </button>
          </div>

        </>
      ) : (
        <PartyPLSheet />
      )}
    </div>
  );
};

export default PLSheet;