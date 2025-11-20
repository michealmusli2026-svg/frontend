import React from "react";
import {
  FaPlus,
  FaTrash,
  FaPlay,
  FaCoins,
  FaBalanceScale,
} from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { formatNumberIndian } from "../utils/numberForamt";

const TradeSection = ({
  getBalance,
  getUserHolding,
  trades,
  handleChange,
  users,
  commodities,
  tradeNatures,
  executeRow,
  deleteRow,
  addRow,
  balanceSheetDifference,
}) => {
  const balanceColor =
    balanceSheetDifference > 0
      ? "text-red-600"
      : balanceSheetDifference < 0
      ? "text-red-600"
      : "text-gray-500";

  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  return (
    <div className="p-2 bg-white rounded-xl shadow-md space-y-2">
      {/* HEADER */}
      {/* <div className="flex items-center justify-between mb-4 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <GiReceiveMoney className="text-green-600" />
          Make Trade

          {balanceSheetDifference}
        </h1> */}
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        {/* Left side: Title */}
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <GiReceiveMoney className="text-green-600" />
          Make Trade
        </h1>

        {/* Right side: Balance difference */}

        <div className="px-6 py-3 bg-gray-100 rounded-lg shadow-sm text-right">
          <p className="text-gray-700 font-medium">
            <span className="text-gray-500">Difference:</span>{" "}
            {/* <span className="text-green-600 font-bold">₹ 15,150.00</span> */}
            <span className={`text-xl font-semibold ${balanceColor}`}>
              {formatNumberIndian(
                balanceSheetDifference > 0
                  ? `+${balanceSheetDifference}`
                  : balanceSheetDifference
              )}
            </span>
          </p>
        </div>

        {/* <h1 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <FaBalanceScale className="text-blue-600" />
          Capital:
          <span className="font-bold text-red-500">
            {getBalance?.balance ?? 0}
          </span>
        </h1> */}
      </div>

      {/* HOLDINGS */}
      {/* <div className="flex flex-wrap items-center gap-3 text-gray-700">
          <span className="font-semibold text-lg flex items-center gap-1">
            <FaCoins className="text-yellow-500" />
            Holdings:
          </span>
          {getUserHolding?.holdings?.length > 0 ? (
            getUserHolding.holdings.map((holding) => (
              <div
                key={holding.id}
                className="bg-gray-100 px-3 py-1 rounded-lg shadow-sm text-sm font-medium"
              >
                {holding.commodityName.toUpperCase()}: {holding.quantity}
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No holdings available</span>
          )}
      </div> */}

      {/* TRADE INPUT ROWS */}
      <div className="space-y-5">
        {trades.map((trade, index) => {
          let fromProfit = 0;
          let fromPercentRemoved = 0;
          let toProfit = 0;
          let toPercentRemoved = 0;
          if (trade.commoditiesId == 4) {
            let fromConvertedRate = trade.fromRate / 1000;
            fromPercentRemoved = (trade.fromQuantity * fromConvertedRate) / 100;
            // fromTotal = trade.fromQuantity - fromPercentRemoved;
            fromProfit = (-trade.fromRate * trade.fromQuantity) / 100000;

            let toConvertedRate = trade.toRate / 1000;
            toPercentRemoved = (trade.toQuantity * toConvertedRate) / 100;
            // toProfit = trade.toQuantity - toPercentRemoved;
            toProfit = (-trade.toRate * trade.toQuantity) / 100000;
          }
          // else {
          //   total =
          //     trade.quantity && trade.rate
          //       ? Number(trade.quantity) * Number(trade.rate)
          //       : 0;
          // }

          const bgColor =
            trade.nature === "1"
              ? trade.disable
                ? "bg-blue-100"
                : "bg-blue-200"
              : trade.nature === "2"
              ? trade.disable
                ? "bg-red-100"
                : "bg-red-200"
              : "bg-gray-100";

          return (
            <div
              key={index}
              className={`grid grid-cols-8 gap-3 items-center p-4 rounded-xl shadow ${bgColor} transition-all`}
            >
              {/* Date Input */}
              {userProfile.user.id == 39 &&
              <div>
                <label className="block text-sm font-medium mb-1">
                  Trade Date
                </label>
                <input
                  type="date"
                  name="tradeDate"
                  value={trade.tradeDate}
                  onChange={(e) =>
                    handleChange(index, "tradeDate", e.target.value)
                  }                
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            }

              {/* COMMODITY */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Select Commodity
                </label>

                <select
                  className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  value={trade.commoditiesId}
                  onChange={(e) =>
                    handleChange(index, "commoditiesId", e.target.value)
                  }
                  // disabled={trade.sellerId == "" ? true : false}
                >
                  <option value="">Select Commodity</option>
                  {commodities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUY PARTY */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  From (Source)
                </label>
                <select
                  className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  // value={trade.fromId}
                  value={JSON.stringify(trade.fromId)}
                  onChange={(e) =>
                    handleChange(index, "fromId", e.target.value)
                  }
                  disabled={trade.commoditiesId === ""}
                >
                  <option value={JSON.stringify({ id: 0, name: "from" })}>
                    From
                  </option>
                  {users
                    ?.filter((user) => user.role !== "user") // exclude role "user"
                    .map((user) => (
                      <option
                        key={user.id}
                        value={JSON.stringify({
                          id: user.id,
                          name: user.username,
                        })}
                      >
                        {user.username}
                      </option>
                    ))}
                </select>
              </div>

              {trade.commoditiesId == 6 ||
              trade.commoditiesId == 7 ||
              trade.commoditiesId == 8 ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="Amount"
                      value={trade.fromQuantity}
                      onChange={(e) =>
                        handleChange(index, "fromQuantity", e.target.value)
                      }
                      disabled={trade.fromId.id == ""}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* QUANTITY */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      From Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="From Quantity"
                      value={trade.fromQuantity}
                      onChange={(e) =>
                        handleChange(index, "fromQuantity", e.target.value)
                      }
                      disabled={trade.fromId.id == ""}
                    />
                  </div>
                  {/* RATE */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      From Rate
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="From Rate"
                      value={trade.fromRate}
                      onChange={(e) =>
                        handleChange(index, "fromRate", e.target.value)
                      }
                      disabled={trade.fromQuantity == ""}
                      // disabled={trade.quantity == "" ? true : false}
                    />
                  </div>
                </>
              )}
              {/* SELL PARTY */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  To (Destination)
                </label>
                <select
                  className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  // value={trade.toId.name}
                  value={JSON.stringify(trade.toId)}
                  onChange={(e) => handleChange(index, "toId", e.target.value)}
                  // disabled={trade.fromQuantity == "" || trade.fromRate == "" }
                  disabled={
                    (trade.fromQuantity == "" && trade.fromRate == "") ||
                    trade.fromQuantity == ""
                  }
                >
                  <option value={JSON.stringify({ id: 0, name: "to" })}>
                    TO
                  </option>
                  {users
                    .filter(
                      (user) => user.id != trade.fromId
                    )
                    .map((user) => (
                      <option
                        key={user.id}
                        value={JSON.stringify({
                          id: user.id,
                          name: user.username,
                        })}
                      >
                        {user.username}
                      </option>
                    ))}
                </select>
              </div>

              {/* TO COMMODITY */}
              {/* <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  TO Commodity
                </label>

                <select
                  className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  value={trade.toCommoditiesId}
                  onChange={(e) =>
                    handleChange(index, "toCommoditiesId", e.target.value)
                  }
                  disabled={trade.sellerId == "" ? true : false}
                >
                  <option value="">Select Commodity</option>
                  {commodities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div> */}

              {trade.commoditiesId == 6 ||
              trade.commoditiesId == 7 ||
              trade.commoditiesId == 8 ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="Amount"
                      value={trade.toQuantity}
                      // value={trade.fromId !== '18' ? trade.fromQuantity : trade.toQuantity}
                      onChange={(e) =>
                        handleChange(index, "toQuantity", e.target.value)
                      }
                      disabled={trade.toId.id == ""}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* QUANTITY */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      To Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="Quantity"
                      value={trade.toQuantity}
                      // value={trade.fromQuantity}
                      onChange={(e) =>
                        handleChange(index, "toQuantity", e.target.value)
                      }
                      disabled={trade.commoditiesId !== "6"}

                      // disabled={trade.commoditiesId == "" ? true : false}
                    />
                  </div>
                  {/* RATE */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      To Rate
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                      placeholder="To Rate"
                      value={trade.toRate}
                      onChange={(e) =>
                        handleChange(index, "toRate", e.target.value)
                      }
                      disabled={trade.toQuantity == ""}
                      // disabled={trade.quantity == "" ? true : false}
                    />
                  </div>
                </>
              )}

              <div className="font-bold text-lg text-gray-700 flex flex-col space-y-1">
                {trade.commoditiesId == 4 ? (
                  <div>
                    <div>
                      Purchase:
                      {formatNumberIndian(trade.fromQuantity - fromProfit)}
                    </div>
                    <div>
                      Sell:{formatNumberIndian(trade.toQuantity - toProfit)}
                    </div>
                    <div className="text-red-600 text-sm font-medium">
                      Profit:{" "}
                      {formatNumberIndian(
                        Number(trade.toQuantity - toProfit) -
                          Number(trade.fromQuantity - fromProfit)
                      )}
                    </div>
                  </div>
                ) : trade.commoditiesId == 6 ? (
                  <div>
                    <div>
                      Purchase: {formatNumberIndian(Number(trade.fromQuantity))}
                    </div>
                    <div>
                      Sell: {formatNumberIndian(Number(trade.toQuantity))}
                    </div>
                    <div className="text-red-600 text-sm font-medium">
                      Profit:{" "}
                      {formatNumberIndian(
                        Number(trade.toQuantity) - Number(trade.fromQuantity)
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div>
                      Purchase:{" "}
                      {formatNumberIndian(
                        Number(trade.fromQuantity * trade.fromRate)
                      )}
                    </div>
                    <div>
                      Sell:{" "}
                      {formatNumberIndian(
                        Number(trade.toQuantity * trade.toRate)
                      )}
                    </div>
                    <div className="text-red-600 text-sm font-medium">
                      Profit:{" "}
                      {formatNumberIndian(
                        Number(trade.toQuantity * trade.toRate) -
                          Number(trade.fromQuantity * trade.fromRate)
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col col-span-7">
                <input
                  type="text"
                  min="0"
                  className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  placeholder="Remark"
                  value={trade.note}
                  onChange={(e) => handleChange(index, "note", e.target.value)}
                  // disabled={trade.toQuantity == ""}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex space-x-2">
                <button
                  onClick={() => executeRow(index)}
                  disabled={trade.disable}
                  className={`w-[50%] p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center justify-center transition-all ${
                    trade.disable ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaPlay />
                </button>

                {index !== 0 && (
                  <button
                    onClick={() => deleteRow(index)}
                    disabled={trade.disable}
                    className={`w-[50%] p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 flex items-center justify-center transition-all ${
                      trade.disable ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* ADD TRADE BUTTON */}
        {/* <button
          onClick={addRow}
          className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition-all"
        >
          <FaPlus />
          <span className="font-semibold">Add Trade</span>
        </button> */}
      </div>
    </div>
  );
};

export default TradeSection;
