import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaPlus, FaTrash, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { enumCall } from "../redux/slice/enums";
import {
  fetchUser,
  fetchUserBalance,
  fetchUserTrade,
  fetchUserHoldings,
  fetchParty,
} from "../redux/slice/user";
import { getAllTrades, saveTrade } from "../redux/slice/trade";
import TradeTable from "../components/TradeTable";
import { useNavigate } from "react-router-dom";
import TradeHeader from "../components/TradeHeader";
import TradeSection from "../components/TradeSection";
import Snackbar from "../components/Snackbar";
import { formatNumberIndian } from "../utils/numberForamt";

const TradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  const [trades, setTrades] = useState([
    {
      // fromId: "",
      tradeDate: "",
      fromId: { id: "", name: "" },
      // toId: "",
      toId: { id: "", name: "" },
      commoditiesId: "",
      fromQuantity: "",
      fromRate: "",
      toRate: "",
      toQuantity: "",
      note: "",
    },
  ]);
  const [pageNumber , setPageNumber ] = useState(1)
  const [snackbar, setSnackbar] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const fetchEnum = useSelector((state) => state.enum?.data);
  const fetchUserData = useSelector((state) => state.user?.data);
  const fetchPartyData = useSelector((state) => state.user?.party);
  const getBalance = useSelector((state) => state.user?.balance);
  const getTrade = useSelector((state) => state.trade?.list);
  const getUserTrade = useSelector((state) => state.user?.trade);
  const saveTradeResponse = useSelector((state) => state.trade?.save);
  const getUserHolding = useSelector((state) => state.user?.holdings);
  // const userProfile = useMemo(
  //   () => JSON.parse(localStorage.getItem("userData")),
  //   []
  // );
  const getCapital = useSelector((state) => state.user?.balance);
  // === INITIAL DATA FETCH ===
  useEffect(() => {
    if (!userProfile?.user?.id) return;
    dispatch(enumCall());
    dispatch(fetchUser());
    // dispatch(getAllTrades());
    dispatch(fetchParty({ userId: userProfile.user.id }));
    dispatch(fetchUserBalance(userProfile.user.id));
    dispatch(
      fetchUserTrade({
        userId: userProfile.user.id,
        order: "DESC",
        complete: null,
        offset:pageNumber
      })
    );
    dispatch(fetchUserHoldings(userProfile.user.id));
  }, [dispatch, userProfile ,pageNumber]);

  // === HANDLE SAVE RESPONSE ===
  // useEffect(() => {
  //     if (saveTradeResponse?.message) {
  //         alert(saveTradeResponse.message);
  //         dispatch(getAllTrades());
  //     }
  // }, [saveTradeResponse, dispatch]);

  // === HANDLERS ===
  const handleChange = useCallback((index, field, value) => {
    setTrades((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      if (field == "fromId" || field == "toId") {
        updated[index][field] = JSON.parse(value);
      }
      // if(field === "from" || field === "to"){
      //   updated[index][field][id]=value
      //   updated[index][field][value]=field
      // }
      if (field === "fromQuantity" && updated[index]["commoditiesId"] !== "6") {
        updated[index][field] = value;
        updated[index]["toQuantity"] = value;
      }
      if(updated[index]['commoditiesId'] == 6 && field == "fromQuantity"){
              updated[index][field] = value;
              updated[index]["toQuantity"] = value;
      }
      // if (field === "fromQuantity" && updated[index]["commoditiesId"] !== "6" ) {
      //   updated[index]["toQuantity"] = value;
      // }

      // if(updated[index]["commoditiesId"] == '6' &&  updated[index]["toId"] !=='18' ){
      //     updated[index]["toQuantity"] = updated[index]["fromQuantity"];
      // }
      // if(updated[index]["commoditiesId"] =='6' && updated[index]["toId"] =='18'&& field == "toQuantity" ){
      //     updated[index]["toQuantity"] = value
      // }

      return updated;
    });
  }, []);

  const addRow = useCallback(() => {
    setTrades((prev) => [
      ...prev,
      {
        buyerId: "",
        nature: "",
        sellerId: "",
        commoditiesId: "",
        quantity: "",
        rate: "",
      },
    ]);
  }, []);

  const deleteRow = useCallback((index) => {
    setTrades((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );
  }, []);

const executeRow = useCallback(
  async (index) => {
    const trade = trades[index];
    const {
      fromId,
      toId,
      commoditiesId,
      toQuantity,
      toRate,
      fromQuantity,
      fromRate,
      note,
      tradeDate,
    } = trade;

    const requiredCommon =
  !fromId?.id ||
  fromId?.id === "0" ||
  !toId?.id ||
  toId?.id === "0" ||
  !tradeDate;

const requiresRatesAndQuantity = commoditiesId !== "6";

const missingRatesAndQty =
  [toRate, fromRate, toQuantity, fromQuantity].some(
    (v) => v === null || v === undefined || v === ""
  );

const requireRemark =
  commoditiesId === "6" && (!note || note.trim() === "");

if (requiredCommon || (requiresRatesAndQuantity && missingRatesAndQty)) {
  return setSnackbar({
    visible: true,
    type: "error",
    message: "Kindly Fill Data Properly!",
  });
}

if (requireRemark) {
  return setSnackbar({
    visible: true,
    type: "error",
    message: "Note is Compulsory!",
  });
}

    // ---------- CALCULATE TOTALS ----------
    // let fromTotal = 0, toTotal = 0, totalProfit = 0;
      let fromTotal = 0, toTotal = 0, totalProfit = 0 ,
     fromPercentRemoved = 0 , toPercentRemoved = 0,
     fromProfit = 0 , toProfit = 0 ;

    switch (commoditiesId) {
      case "4":
      //    let fromConvertedRate = fromRate / 1000;
      // fromPercentRemoved = (fromQuantity * fromConvertedRate) / 100;
      // fromTotal = (-fromRate * fromQuantity) / 100000;
      // let toConvertedRate = trade.toRate / 1000;  
      // toPercentRemoved = (trade.toQuantity * toConvertedRate) / 100;
      // toTotal = (-trade.toRate * trade.toQuantity) / 100000;
        // fromTotal = fromQuantity - (fromRate * fromQuantity) / 100000;
        // toTotal = toQuantity - (toRate * toQuantity) / 100000;

          fromTotal = 
      toQuantity - (toRate * toQuantity) / 100000;

      toTotal = 
      fromQuantity - (fromRate * fromQuantity) / 100000;

        break;
      case "7":
      case "6":
        fromTotal = fromQuantity;
        toTotal = toQuantity;
        break;
      case "8":
        if (fromId?.name === "Profit") {
          fromTotal = fromQuantity;
          toTotal = toQuantity;
          totalProfit = toTotal;
        } else if (toId?.name === "Loss") {
          fromTotal = fromQuantity;
          toTotal = toQuantity;
        }
        break;
      default:
        fromTotal = Number(fromQuantity) * Number(fromRate || 0);
        toTotal = Number(toQuantity) * Number(toRate || 0);
    }

    // Calculate final profit
    const calculatedProfit =
      // totalProfit > 0 ? totalProfit : Number(toTotal) - Number(fromTotal);
      totalProfit > 0 ? totalProfit : toTotal - fromTotal;
    // ---- SHOW CONFIRMATION POPUP ----
    if (calculatedProfit > 15000 || calculatedProfit < 0) {
      return setSnackbar({
        visible: true,
        type: "warning",
        message:
          calculatedProfit > 15000
            ? `High Profit: ₹${calculatedProfit.toLocaleString()} please confirm.`
            : `Loss Detected: ₹${calculatedProfit.toLocaleString()} please confirm.`,
        checkBox: true,
        index:index,
        onConfirm: () => executeConfirmed(index), // Callback here
      });
    }

    // If no confirmation needed, execute directly
    executeConfirmed(index);
  },
  [dispatch, trades, userProfile]
);

const executeConfirmed = async (index) => {
  const trade = trades[index];
  const {
    fromId,
    toId,
    commoditiesId,
    toQuantity,
    toRate,
    fromQuantity,
    fromRate,
    note,
    tradeDate,
  } = trade;

  let fromTotal = 0, toTotal = 0, totalProfit = 0 ,
     fromPercentRemoved = 0 , toPercentRemoved = 0,
     fromProfit = 0 , toProfit = 0 ;

  switch (commoditiesId) {
    case "4":
      // let fromConvertedRate = fromRate / 1000;
      // fromPercentRemoved = (fromQuantity * fromConvertedRate) / 100;
      // fromTotal = (-fromRate * fromQuantity) / 100000;
      // let toConvertedRate = trade.toRate / 1000;  
      // toPercentRemoved = (trade.toQuantity * toConvertedRate) / 100;
      // toTotal = (-trade.toRate * trade.toQuantity) / 100000;
      
      fromTotal = 
      toQuantity - (toRate * toQuantity) / 100000;

      // fromQuantity - (fromRate * fromQuantity) / 100000;
      toTotal = 
      fromQuantity - (fromRate * fromQuantity) / 100000;
      
      // toQuantity - (toRate * toQuantity) / 100000;
      break;
    case "7":
    case "6":
      fromTotal = fromQuantity;
      toTotal = toQuantity;
      break;
    case "8":
      if (fromId?.name === "Profit") {
        fromTotal = fromQuantity;
        toTotal = toQuantity;
        totalProfit = toTotal;
      } else if (toId?.name === "Loss") {
        fromTotal = fromQuantity;
        toTotal = toQuantity;
      }
      break;
    default:
      fromTotal = Number(fromQuantity) * Number(fromRate || 0);
      toTotal = Number(toQuantity) * Number(toRate || 0);
  }
  const finalTrade = {
    ...trade,
    note: note || "No Remark",
    paymentStatus: 2,
    fromRate: parseFloat(fromRate || 0),
    toRate: parseFloat(toRate || 0),
    initiatorId: userProfile.user.id,
    fromTotal: parseFloat(fromTotal),
    toTotal: parseFloat(toTotal),
    toQuantity,
    fromQuantity,
    fromId: fromId.id,
    toId: toId.id,
    profit: totalProfit > 0 ? totalProfit : toTotal - fromTotal,
    enterDate: tradeDate
  };

  if ([37, 38].includes(userProfile?.user?.id)) {
    finalTrade.created_at = tradeDate;
    finalTrade.createdAt = tradeDate;
  }
  try {
    const res = await dispatch(saveTrade(finalTrade));

    setSnackbar({
      visible: true,
      type: res.meta.requestStatus === "fulfilled" ? "success" : "error",
      message:
        res.meta.requestStatus === "fulfilled"
          ? "Trade executed successfully!"
          : "Failed to execute trade.",
    });

    setTrades([
      {
        fromId: "",
        toId: "",
        commoditiesId: "",
        fromQuantity: "",
        fromRate: "",
        toRate: "",
        toQuantity: "",
        note: "",
        tradeDate:"",
      },
    ]);

    await Promise.all([
      dispatch(
        fetchUserTrade({
          userId: userProfile.user.id,
          order: "DESC",
          complete: null,
          offset:pageNumber
        })
      ),
      dispatch(fetchUserBalance(userProfile.user.id)),
    ]);
  } catch (err) {
    setSnackbar({
      visible: true,
      type: "error",
      message: "An unexpected error occurred.",
    });
  }
};


  const handleLedger = (name) => {
    navigate(`/ledger/${encodeURIComponent(name)}`);
  };

  // === MEMOIZED ENUMS ===
  const tradeNatures = useMemo(
    () => fetchEnum?.tradeNatures || [],
    [fetchEnum]
  );
  const commodities = useMemo(() => fetchEnum?.commodities || [], [fetchEnum]);
  const users = useMemo(() => fetchUserData?.users || [], [fetchUserData]);
  const party = useMemo(() => fetchPartyData?.users || [], [fetchPartyData]);

  ////
  // const partyUsers = useMemo(
  //   () => users?.users?.filter((u) => u.role === "party") || [],
  //   [users]
  // );

  const groupedData = useMemo(() => {
    const dailyPL = {};
    let PLprofit = 0;
    let PLexpense = 0;
    getUserTrade?.forEach((trade) => {
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
      const fromQuantity = trade.fromQuantity.value;
      const to = trade.toId.value;
      const toQuantity = trade.toQuantity.value;
      const profit = trade.profit.value;
      if (from == "Services") {
        dailyPL[date]["Total Services"] =
          (dailyPL[date]["Total Services"] || 0) - fromQuantity;
        // Math.abs((dailyPL[date]["Total Services"] || 0) - fromQuantity);
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

  function addOpeningBalance(users, balances) {
    return users
      ?.map((user) => {
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
    getUserTrade?.forEach((trade) => {
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

    // const partyUsers = fetchUserData?.users?.filter((u) => u.role === "party")
    const partyUsers = fetchPartyData?.users;
    const openingBalance = addOpeningBalance(partyUsers, ledger);
    // return openingBalance == undefined ? [] : openingBalance;
    return openingBalance;
  }, [getUserTrade]);

  const nextPage = () => {
    setPageNumber(pageNumber + 1)
  }

  const lastPage = () => {
    setPageNumber(pageNumber - 1)
  }

  const goToFirstPage = () =>{
    setPageNumber(1)
  } 
  return (
    <div className="" >
      <TradeHeader userProfile={userProfile}/>
      <TradeSection
        getBalance={getBalance}
        getUserHolding={getUserHolding}
        trades={trades}
        handleChange={handleChange}
        users={party}
        commodities={commodities}
        tradeNatures={tradeNatures}
        executeRow={executeRow}
        deleteRow={deleteRow}
        addRow={addRow}
        balanceSheetDifference={formatNumberIndian(
          Number(
            balances?.reduce((sum, entry) => sum + entry.updatedBalance, 0) -
              ((getCapital?.balance || 0) +
                Object.values(groupedData).reduce(
                  (sum, val) => sum + (val["Total Profit"] || 0),
                  0
                ) -
                Object.values(groupedData).reduce(
                  (sum, val) =>
                    sum +
                    (val["Total Services"] || 0) +
                    (val["Total Expense"] || 0) +
                    (val["Total Loss"] || 0),
                  0
                ))
          ).toFixed(2)
        )}
        
      />

      {/* TRADE HISTORY TABLE */}
      <div className="mt-2">
        <TradeTable tradeList={getUserTrade} handleLedger={handleLedger} nextPage={nextPage} pageNumber={pageNumber}
        lastPage={lastPage} goToFirstPage={goToFirstPage}/>
      </div>

      <div>
        {snackbar.visible && (
          <Snackbar
            type={snackbar.type}
            message={snackbar.message}
            onClose={() =>
              setSnackbar({ visible: false, type: "", message: "" , index:"" })
            }
            checkBox={snackbar.checkBox}
            index={snackbar.index}
            onConfirm={(index)=>executeConfirmed(index)}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(TradePage);
