import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrades } from "../redux/slice/trade";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { formatNumberIndian } from "../utils/numberForamt";
import { fetchUserTrade } from "../redux/slice/user";
import TradeHeader from "../components/TradeHeader";
import PartyPLSheet from "./PartyPLSheet";

const PLSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPartyView , setIsPartyView] = useState(false)
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
      })
    );
  }, [dispatch]);

  const groupedData = useMemo(() => {
    const dailyPL = {};
    let PLprofit = 0;
    let PLexpense = 0;
    getUserTrade?.forEach((trade) => {
      const date = new Date(trade.createdAt).toLocaleDateString("en-GB"); // DD/MM/YYYY

      // if (!dailyPL[date]) {
      //   dailyPL[date] = {};
      // }
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

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white min-h-screen shadow-lg rounded-2xl">
      {/* <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-wide">
        Daily Profit & Loss Sheet
      </h1> */}
      <TradeHeader userProfile={userProfile} />

      {/* <div className="flex  justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
        >
          <FaArrowLeft className="text-lg" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
                  Daily Profit & Loss Sheet
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
                  Party Profit & Loss Sheet

        </h1>

        <div className="w-[60px]" />
      </div> */}
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

        {/* Spacer for layout balance */}
        <div className="w-[60px]" />
      </div>
      {!isPartyView ? 
<>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <tr>
              <th
                colSpan="3"
                className="px-6 py-3 text-center text-lg font-semibold border-r border-white/30"
              >
                Profit
              </th>
              <th
                colSpan="4"
                className="px-6 py-3 text-center text-lg font-semibold"
              >
                Expense
              </th>
            </tr>
            <tr className="bg-gray-100 text-gray-800">
              <th className="px-4 py-2 font-semibold border-r border-gray-200">
                Date
              </th>
              <th className="px-4 py-2 font-semibold border-r border-gray-200">
                Particular
              </th>
              <th className="px-4 py-2 font-semibold border-r border-gray-200">
                Amount
              </th>
              <th className="px-4 py-2 font-semibold border-r border-gray-200">
                Date
              </th>
              <th className="px-4 py-2 font-semibold border-r border-gray-200">
                Particular
              </th>
              <th className="px-4 py-2 font-semibold">Amount</th>
              <th className="px-4 py-2 font-semibold">Closing Balance</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {Object.entries(groupedData).map(([date, values]) => (
              <tr key={date} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-gray-700">{date}</td>
                <td className="px-4 py-3 text-gray-700">Total Profit</td>
                <td className="px-4 py-3 text-green-600 font-medium">
                  ₹ {formatNumberIndian(values["Total Profit"]?.toFixed(2))}
                </td>
                <td className="px-4 py-3 text-gray-700">{date}</td>

                <td>
                  <tr className="px-4 py-3 text-gray-700">Total Service</tr>
                  <tr className="px-4 py-3 text-gray-700">Total Expense</tr>
                  <tr className="px-4 py-3 text-gray-700">Total Loss</tr>
                </td>

                {/* <td className="px-4 py-3 text-gray-700">
                  Total Service
                  </td> */}
                <td className="px-4 py-3 text-red-600 font-medium">
                  <tr className="px-4 py-3 text-gray-700">
                    ₹{" "}
                    {/* {values["Total Services"]?.toFixed(2) > 0
                    ? values["Total Services"]?.toFixed(2)
                    : 0} */}
                    {formatNumberIndian(values["Total Services"]?.toFixed(2))}
                  </tr>

                  <tr className="px-4 py-3 text-gray-700">
                    ₹{" "}
                    {/* {values["Total Expense"]?.toFixed(2) > 0
                    ? values["Total Expense"]?.toFixed(2)
                    : 0} */}
                    {values["Total Expense"]?.toFixed(2)}
                  </tr>
                  <tr className="px-4 py-3 text-gray-700">
                    ₹{" "}
                    {/* {values["Total Expense"]?.toFixed(2) > 0
                    ? values["Total Expense"]?.toFixed(2)
                    : 0} */}
                    {formatNumberIndian(values["Total Loss"]?.toFixed(2))}
                  </tr>
                </td>
                <td className="px-4 py-3 text-green-600 font-medium">
                  ₹{" "}
                  {/* {values["Total Profit"]?.toFixed(2) -
                    values["Total Services"]?.toFixed(2) >
                  0
                    ? values["Total Profit"]?.toFixed(2) -
                      values["Total Services"]?.toFixed(2)
                    : 0} */}
                  {/* {values["Total Services"] > 0 || values["Total Expense"] > 0
                    ? (values["Total Services"]) - (values["Total Expense"] +
                      values["Total Services"]).toFixed(2)
                    : values["Total Services"]?.toFixed(2)} */}
                  {formatNumberIndian(
                    values["Total Profit"] -
                      (values["Total Services"] +
                        values["Total Expense"] +
                        values["Total Loss"])
                  )}
                </td>
              </tr>
            ))}

            <tr className="bg-gray-50 font-semibold text-gray-800">
              <td
                colSpan="2"
                className="px-4 py-3 text-right border-t border-gray-200"
              >
                Total Profit
              </td>
              {Object.values(groupedData).length > 0 && (
                <td className="px-4 py-3 text-green-600 border-t border-gray-200">
                  ₹{" "}
                  {formatNumberIndian(
                    Object.values(groupedData)
                      .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
                      .toFixed(2)
                  )}
                </td>
              )}
              {/* <td className="px-4 py-3 text-green-600 border-t border-gray-200">
                ₹ 19,300.00
              </td> */}

              <td
                colSpan="2"
                className="px-4 py-3 text-right border-t border-gray-200"
              >
                Total Expense
              </td>
              {Object.values(groupedData).length > 0 && (
                <td className="px-4 py-3 text-red-600 border-t border-gray-200">
                  ₹{" "}
                  {formatNumberIndian(
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
                  )}
                </td>
              )}
              {/* <td className="px-4 py-3 text-red-600 border-t border-gray-200">
                ₹ 4,150.00
              </td> */}
            </tr>
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
                      .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
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
</>

       :
       <PartyPLSheet />
       }



    </div>
  );
};

export default PLSheet;
