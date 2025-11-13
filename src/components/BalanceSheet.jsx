import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  fetchUserTrade,
  fetchUserBalance,
  fetchParty
} from "../redux/slice/user";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { formatNumberIndian } from "../utils/numberForamt";
import TradeHeader from "../components/TradeHeader";

const BalanceSheet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const users = useSelector((state) => state.user?.data);
  const party = useSelector((state) => state.user?.party);
  const trades = useSelector((state) => state.user?.trade || []);
  const getCapital = useSelector((state) => state.user?.balance);
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  // const pageName = window.location.pathname.split("/").at(-1);
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchParty({ userId: userProfile.user.id }));
    dispatch(fetchUserBalance(userProfile.user.id));
    dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "ASC" ,complete:true}));
  }, []);

  // const partyUsers = useMemo(
  //   () => users?.users?.filter((u) => u.role === "party") || [],
  //   [users]
  // );
  const partyUsers = party?.users
  const groupedData = useMemo(() => {
      const dailyPL = {};
      let PLprofit = 0;
      let PLexpense = 0;
      trades.forEach((trade) => {
        const date = new Date(trade.createdAt).toLocaleDateString("en-GB"); // DD/MM/YYYY
  
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
        if (from == "Services")  {
        dailyPL[date]["Total Services"] =
          (dailyPL[date]["Total Services"] || 0) - fromQuantity;
          // Math.abs((dailyPL[date]["Total Services"] || 0) - fromQuantity);
      }
      if (to == "Services")  {
        dailyPL[date]["Total Services"] =
          (dailyPL[date]["Total Services"] || 0) + toQuantity;
      }
        if (from == "Expense") {
          dailyPL[date]["Total Expense"] = (dailyPL[date]["Total Expense"] || 0) + fromQuantity;
        } 
        if (to == "Expense") {
        dailyPL[date]["Total Expense"] = (dailyPL[date]["Total Expense"] || 0) + toQuantity;
      } 
       if(to == "Loss"){
        dailyPL[date]["Total Loss"] =
          (dailyPL[date]["Total Loss"] || 0) + toQuantity;
      }
        dailyPL[date]["Total Profit"] =
          (dailyPL[date]["Total Profit"] || 0) + profit;
      });
      return dailyPL;
    }, [trades]);

  function addOpeningBalance(users, balances) {
    return users?.map((user) => {
      const name = user.username;
      const balanceData = balances[name];

      if (balanceData) {
        const { received, paid } = balanceData;

        // Compute opening balance
        //   const openingBalance = received - paid;

        return {
          name,
          // received,
          // paid,
          // openingBalance,
          updatedBalance: received - paid + user.balance,
        };
      }

      // If no matching balance entry found
      return {
        name,
        //   received: 0,
        //   paid: 0,
        //   openingBalance: 0,
        updatedBalance: user.balance || 0,
      };
      
    })
    .filter((user) => user.updatedBalance !== 0);
  }
  const balances = useMemo(() => {
    const ledger = {};
    trades?.forEach((trade) => {
      const from = trade.fromId.value;
      const to = trade.toId.value;
      const fromTotal = Number(trade.fromTotal.value);
      const toTotal = Number(trade.toTotal.value);
      // if(from !=="Expense" && from !=="Services" && to !=="Expense" && to !=="Services"){
      // Initialize accounts if missing
      if (!ledger[from]) ledger[from] = { received: 0, paid: 0 };
      if (!ledger[to]) ledger[to] = { received: 0, paid: 0 };

      // Update totals
      ledger[from].paid += fromTotal;
      ledger[to].received += toTotal;
      // }
    });
    delete ledger["Expense"];
    delete ledger["Services"];
    delete ledger["Profit"];
    delete ledger["Loss"];
    const openingBalance = addOpeningBalance(partyUsers, ledger);
    return openingBalance;
  }, [trades]);

  return (
    <div>
      {/* <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800 tracking-wide">
        Balance Sheet
      </h1> */}
      <TradeHeader userProfile={userProfile} />
      
      <div className="flex items-center justify-between mb-6">
              {/* Back Button */}
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
              >
                <FaArrowLeft className="text-lg" />
                Back
              </button>
      
              {/* Centered Title */}
              <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
                Balance Sheet
              </h1>
      
              {/* Spacer to balance layout */}
              <div className="w-[60px]" />
            </div>
      <div>
        {/* Capital */}
        <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead class="bg-gray-100">
            <tr>
              <th
                colspan="3"
                class="text-center py-3 border border-gray-300 text-gray-700 font-semibold"
              >
                Asset (TO Receive){" "}
                <span  className={`py-2 px-4 text-right font-bold ${
                balances?.reduce(
                  (sum, entry) => sum + entry.updatedBalance,
                  0
                ) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {formatNumberIndian( balances
                  ?.reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  .toFixed(2))}
                {/* All Leadger Total */}
                  </span>
              </th>
              <th
                colspan="3"
                class="text-center py-3 border border-gray-300 text-gray-700 font-semibold"
              >
                Libaties (TO Pay)
                <span  className={`py-2 px-4 text-right font-bold ${
                (
                  (getCapital?.balance || 0) +
                  (Object.values(groupedData).reduce(
                    (sum, val) => sum + (val["Total Profit"] || 0),
                    0
                  ) -
                    Object.values(groupedData).reduce(
                      (sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]) +  + (val["Total Loss"] || 0),
                      0
                    ))
                ) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {formatNumberIndian((
                  (getCapital?.balance || 0) +
                  (Object.values(groupedData).reduce(
                    (sum, val) => sum + (val["Total Profit"] || 0),
                    0
                  ) -
                    Object.values(groupedData).reduce(
                      (sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]) +  + (val["Total Loss"] || 0),
                      0
                    ))
                ).toFixed(2))}
                {/* All Leadger Total */}
                  </span>
                {/* P&L net profit  */}
              </th>
            </tr>
            <tr class="bg-gray-200">
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Sr No.
              </th>
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Particulars
              </th>
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Amount
              </th>
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Sr No.
              </th>
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Particulars
              </th>
              <th class="py-2 px-3 border border-gray-300 text-gray-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-50">
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {balances?.map((entry,i) => (
            <tr
              key={entry.name}
              className=" hover:bg-gray-50 transition duration-150"
            >
              <td className="py-2 px-4 font-medium text-gray-800">
                {i + 1}
              </td>
              
            </tr>
          ))}
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {/* All Ledger */}
                 {balances?.map((entry) => (
            <tr
              key={entry.name}
              className=" hover:bg-gray-50 transition duration-150"
            >
              <td className="py-2 px-4 font-medium text-gray-800">
                {entry.name}
              </td>
              <td
                className={`py-2 px-4 text-right font-semibold ${
                  entry.updatedBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {/* {entry.updatedBalance} */}
              </td>
            </tr>
          ))}
              </td>

              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {/* ₹5,000 */}
                {balances?.map((entry) => (
            <tr
              key={entry.name}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td
                className={`py-2 px-4 text-right font-semibold ${
                  entry.updatedBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatNumberIndian(entry.updatedBalance)}
              </td>
            </tr>
          ))}
                {/* {balances
                  .reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  .toFixed(2)} */}
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                1
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                Capital
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {/* 3673048 */}
                {formatNumberIndian(getCapital?.balance)}
              </td>
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                -
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                -
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                -
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                2
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                P & L Net
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {
              //   Object.values(groupedData)
              //   .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
              //   .toFixed(2) -
              //   Object.values(groupedData)
              //     .reduce((sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]), 0)
              //     .toFixed(2) >
              // 0
              //   ?
              formatNumberIndian(
                (
                    Object.values(groupedData)
                      .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
                      .toFixed(2) -
                    Object.values(groupedData)
                      .reduce(
                        (sum, val) => sum + (val["Total Services"] || 0)+ (val["Total Expense"]) + (val["Total Loss"] || 0),
                        0
                      )
                      .toFixed(2)
                  ).toFixed(2))
                // : 0
                }
              </td>
            </tr>

            <tr class="hover:bg-gray-50">
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                -
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                Total
              </td>

              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {/* ₹5,000 */}
                {formatNumberIndian(balances
                  ?.reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  .toFixed(2))}
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                -
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                Total
              </td>
              {/* <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {3673048 + 961821.35}
              </td> */}
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {formatNumberIndian((
                  (getCapital?.balance || 0) +
                  (Object.values(groupedData).reduce(
                    (sum, val) => sum + (val["Total Profit"] || 0),
                    0
                  ) -
                    Object.values(groupedData).reduce(
                      (sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]) +  + (val["Total Loss"] || 0),
                      0
                    ))
                ).toFixed(2))}
              </td>
              {/* <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                {Object.values(groupedData)
                  .reduce((sum, val) => sum + (val["Total Profit"] || 0), 0)
                  .toFixed(2) -
                  Object.values(groupedData)
                    .reduce((sum, val) => sum + (val["Total Services"] || 0), 0)
                    .toFixed(2) >
                0
                  ? (
                      Object.values(groupedData)
                        .reduce(
                          (sum, val) => sum + (val["Total Profit"] || 0),
                          0
                        )
                        .toFixed(2) -
                      Object.values(groupedData)
                        .reduce(
                          (sum, val) => sum + (val["Total Services"] || 0),
                          0
                        )
                        .toFixed(2)
                    ).toFixed(2)
                  : 0}
              </td> */}
            </tr>
            {/* <tr class="hover:bg-gray-50">
              <td class="py-2 px-3 border border-gray-300 text-center text-green-600 font-semibold">
                ₹8,200
              </td>
              <td class="py-2 px-3 border border-gray-300 text-center text-red-600 font-semibold">
                ₹2,700
              </td>
            </tr> */}
          </tbody>
        </table>
        <div className="mt-6 flex justify-center">
          <div className="px-6 py-3 bg-gray-100 rounded-lg shadow-sm text-right">
            <p className="text-gray-700 font-medium">
              <span className="text-gray-500">Difference:</span>{" "}
              {/* <span className="text-green-600 font-bold">₹ 15,150.00</span> */}
              <span className="text-green-600 font-bold">
                ₹
                {formatNumberIndian(Math.abs(balances
                  ?.reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  .toFixed(2)) -
                  (
                    (getCapital?.balance || 0) +
                    (Object.values(groupedData).reduce(
                      (sum, val) => sum + (val["Total Profit"] || 0),
                      0
                    ) -
                      Object.values(groupedData).reduce(
                        (sum, val) => sum + (val["Total Services"] || 0) + (val["Total Expense"]) +  + (val["Total Loss"] || 0),
                        0
                      ))
                  ).toFixed(2))}
              </span>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default BalanceSheet;
