import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaPlus, FaTrash, FaPlay } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { enumCall } from "../redux/slice/enums";
import {
  fetchUser,
  fetchUserBalance,
  fetchUserTrade,
  fetchUserHoldings,
} from "../redux/slice/user";
import { getAllTrades, saveTrade } from "../redux/slice/trade";
import TradeTable from "../components/TradeTable";
import { useNavigate } from "react-router-dom";
import TradeHeader from "../components/TradeHeader";
import TradeSection from "../components/TradeSection";
import Snackbar from "../components/Snackbar";

const TradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([
    {
      fromId: "",
      toId: "",
      commoditiesId: "",
      fromQuantity: "",
      fromRate: "",
      toRate: "",
      toQuantity: "",
      note :""
    },
  ]);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const fetchEnum = useSelector((state) => state.enum?.data);
  const fetchUserData = useSelector((state) => state.user?.data);
  const getBalance = useSelector((state) => state.user?.balance);
  const getTrade = useSelector((state) => state.trade?.list);
  const getUserTrade = useSelector((state) => state.user?.trade);
  const saveTradeResponse = useSelector((state) => state.trade?.save);
  const getUserHolding = useSelector((state) => state.user?.holdings);
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
    const getCapital = useSelector((state) => state.user?.balance);
  

  // === INITIAL DATA FETCH ===
  useEffect(() => {
    if (!userProfile?.user?.id) return;
    dispatch(enumCall());
    dispatch(fetchUser());
    // dispatch(getAllTrades());
    dispatch(fetchUserBalance(userProfile.user.id));
    dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "DESC" }));
    dispatch(fetchUserHoldings(userProfile.user.id));
  }, [dispatch, userProfile]);

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
      if (field === "fromQuantity" && updated[index]["commoditiesId"] !== "6") {
        updated[index]["toQuantity"] = value;
      }

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
    (index) => {
      const tradeToExecute = trades[index];
      let {
        fromId,
        toId,
        commoditiesId,
        toQuantity,
        toRate,
        fromQuantity,
        fromRate,
        note
      } = tradeToExecute;
      let fromProfit = 0;
      let fromPercentRemoved = 0;
      let fromTotal = 0;
      let toProfit = 0;
      let toPercentRemoved = 0;
      let toTotal = 0;
      let totalProfit = 0
      if (commoditiesId == "4") {
        let fromConvertedRate = fromRate / 1000;
        fromPercentRemoved = (fromQuantity * fromConvertedRate) / 100;
        // fromTotal = fromQuantity - fromPercentRemoved;
        fromProfit = (-fromRate * fromQuantity) / 100000;
        fromTotal = fromQuantity - fromProfit;
        let toConvertedRate = toRate / 1000;
        toPercentRemoved = (toQuantity * toConvertedRate) / 100;
        // toProfit = toQuantity - toPercentRemoved;
        toProfit = (-toRate * toQuantity) / 100000;
        console.log(toProfit)
        toTotal = toQuantity - toProfit;
        /////
        // toQuantity = toTotal

      } else if (commoditiesId == "7") {
        fromTotal = fromQuantity;
        toTotal = toQuantity;
      } else if (commoditiesId == "6") {
        fromTotal = fromQuantity;
        toTotal = toQuantity;
      } else if(commoditiesId == "8"){
        if(fromId == "24"){
          fromTotal = fromQuantity;
          toTotal = toQuantity;
          totalProfit = toTotal - 0;
        }
        if(toId == "25"){
           fromTotal = fromQuantity;
          toTotal = toQuantity;
        }
      }
      else {
        fromTotal =
          fromQuantity && fromRate
            ? Number(fromQuantity) * Number(fromRate)
            : 0;
        toTotal =
          toQuantity && toRate ? Number(toQuantity) * Number(toRate) : 0;
      } 

      // ✅ Simple validation
      // if (!fromId || !toId || !commoditiesId || !toQuantity || !toRate || !fromQuantity || !fromRate) {
      //     alert("Please fill all fields before executing the trade.");
      //     return;
      // }

      // const totalAmount = Number(quantity) * Number(rate);
      const finalTrade = {
        ...tradeToExecute,
        note: note || "No Remark",
        paymentStatus: 2,
        fromRate:parseFloat(fromRate ? fromRate : 0),
        toRate:parseFloat(toRate ? toRate : 0),
        initiatorId: userProfile.user.id,
        fromTotal:parseFloat(fromTotal),
        toTotal:parseFloat(toTotal),
        toQuantity,
        fromQuantity,
        fromId,
        toId,
        profit: totalProfit > 0 ? totalProfit : Number(toTotal) - Number(fromTotal),
      };
        console.log(">",finalTrade)
      dispatch(saveTrade(finalTrade))
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
          setTrades([
            {
              fromId: "",
              toId: "",
              commoditiesId: "",
              fromQuantity: "",
              fromRate: "",
              toRate: "",
              toQuantity: "",
              note:""
            },
          ]);
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
      setTrades([
        {
          fromId: "",
          toId: "",
          commoditiesId: "",
          fromQuantity: "",
          fromRate: "",
          toRate: "",
          toQuantity: "",
          note:""
        },
      ]);
      dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "DESC" }));
    },
    [dispatch, trades, userProfile]
  );

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
      }, [getUserTrade]);
  
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

      const partyUsers = fetchUserData?.users?.filter((u) => u.role === "party") 
   
      const openingBalance = addOpeningBalance(partyUsers, ledger);
      return openingBalance;
    }, [getUserTrade]);

  return (
    <div className="p-1">
      
      <TradeHeader userProfile={userProfile} />

      <TradeSection
        getBalance={getBalance}
        getUserHolding={getUserHolding}
        trades={trades}
        handleChange={handleChange}
        users={users}
        commodities={commodities}
        tradeNatures={tradeNatures}
        executeRow={executeRow}
        deleteRow={deleteRow}
        addRow={addRow}
        balanceSheetDifference= {
                  balances
                  ?.reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  ?.toFixed(2) -
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
                  ).toFixed(2)}
      />

      {/* TRADE HISTORY TABLE */}
      <div className="mt-2">
        <TradeTable tradeList={getUserTrade} handleLedger={handleLedger} />
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

export default React.memo(TradePage);
