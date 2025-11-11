///////NEw
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParty, fetchUser, fetchUserTrade } from "../redux/slice/user";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AllLedger from "./AllLeadger";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatNumberIndian } from "../utils/numberForamt";
import TradeHeader from "../components/TradeHeader";

const LedgerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  const users = useSelector((state) => state.user?.data);
  const party = useSelector((state) => state.user?.party);
  const trades = useSelector((state) => state.user?.trade);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ledgeerType, setLedgerType] = useState("party");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const partyName = window.location.pathname.split("/").at(-1);

  useEffect(() => {
    if (partyName) {
      const user = party?.users?.find((u) => u.username === partyName);
      setSelectedUser(user);
    }
  }, [partyName]);
  // Fetch users on mount
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchParty( {userId: userProfile.user.id}));
    // dispatch(fetchParty({ userId: 1 }));
  }, [dispatch]);

  // Fetch trades when user changes
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchUserTrade({ userId: userProfile.user.id, order: "ASC" }));
      // dispatch(fetchUserTrade({ userId: 1, order: "ASC" }));
    }
  }, [dispatch, selectedUser]);

  // Filter users by role = party
  // const partyUsers = useMemo(
  //   () => users?.users?.filter((u) => u.role === "party") || [],
  //   [users]
  // );
  const partyUsers = party?.users

  // Build ledger entries
  // const ledgerData = useMemo(() => {
  //   if (!trades || !selectedUser) return [];

  //   let balance = selectedUser.balance;
  //   const entries = [
  //     {
  //       date: new Date(selectedUser.createdAt).toLocaleString(),
  //       particulars: "Opening Balance",
  //       rate: 0,
  //       quantity: 0,
  //       debit: 0,
  //       credit: 0,
  //       balance: selectedUser.balance,
  //     },
  //   ];
  //   trades.forEach((trade) => {
  //     const date = new Date(trade.createdAt);
  //     const commodity = trade.commodity.value;

  //     let debit = 0,
  //       credit = 0,
  //       particulars = "",
  //       rate = 0,
  //       quantity = 0;

  //     if (trade.fromId.value === selectedUser.username ) {
  //       rate = trade.fromRate.value;
  //       quantity = trade.fromQuantity.value;
  //       debit = trade.fromTotal.value || quantity * rate;
  //       particulars = `${trade.toId.value} (${commodity})`;
  //     } else if (trade.toId.value === selectedUser.username) {
  //       rate = trade.toRate.value;
  //       quantity = trade.toQuantity.value;
  //       credit = trade.toTotal.value || quantity * rate;
  //       particulars = `${trade.fromId.value} (${commodity})`;
  //     }

  //     // Skip empty trades
  //     if (!(debit || credit || quantity || rate)) return;

  //     balance += credit - debit;
  //     // balance += debit - credit;
  //     entries.push({
  //       date: date.toLocaleString(),
  //       particulars,
  //       rate,
  //       quantity,
  //       debit,
  //       credit,
  //       balance,
  //     });
  //   });

  //   // Apply date filter
  //   return entries.filter((e) => {
  //     if (!dateRange.from && !dateRange.to) return true;

  //     // Parse "DD/MM/YYYY, HH:mm:ss"
  //     const [datePart] = e.date.split(", ");
  //     const [day, month, year] = datePart.split("/").map(Number);
  //     const entryDate = new Date(year, month - 1, day);

  //     const from = dateRange.from ? new Date(dateRange.from) : new Date(0);
  //     const to = dateRange.to ? new Date(dateRange.to) : new Date();

  //     // Normalize all to midnight (ignore time)
  //     entryDate.setHours(0, 0, 0, 0);
  //     from.setHours(0, 0, 0, 0);
  //     to.setHours(0, 0, 0, 0);

  //     return entryDate >= from && entryDate <= to;
  //   });
  // }, [trades, selectedUser, dateRange]);

  const ledgerData = useMemo(() => {
    if (!trades || !selectedUser) return [];

    let balance = selectedUser.balance;

    const entries = [
      {
        date: new Date(selectedUser.createdAt).toLocaleString(),
        particulars: "Opening Balance",
        rate: 0,
        quantity: 0,
        debit: 0,
        credit: 0,
        balance: selectedUser.balance,
      },
    ];

    // ✅ Filter trades when selected user = MICHEAL
   

    trades.forEach((trade) => {
      const date = new Date(trade.createdAt);
      const commodity = trade.commodity.value;

      let debit = 0,
        credit = 0,
        particulars = "",
        rate = 0,
        quantity = 0;

      
        if (trade.fromId.value === selectedUser.username) {
          rate = Number(trade.fromRate.value);
          quantity = Number(trade.fromQuantity.value);
          debit = Number(trade.fromTotal.value);
          particulars = `${trade.toId.value} (${commodity})`;
        }

        if (trade.toId.value === selectedUser.username) {
          rate = Number(trade.toRate.value);
          quantity = Number(trade.toQuantity.value);
          credit = Number(trade.toTotal.value);
          particulars = `${trade.fromId.value} (${commodity})`;
        }

      // Skip empty
      if (!(debit || credit)) return;

      // ✅ Update running balance correctly
      balance += credit - debit;

      entries.push({
        date: date.toLocaleString(),
        particulars,
        rate,
        quantity,
        debit,
        credit,
        balance,
      });
    });

    // ✅ Date filter (unchanged)
    return entries.filter((e) => {
      if (!dateRange.from && !dateRange.to) return true;

      const [datePart] = e.date.split(", ");
      const [day, month, year] = datePart.split("/").map(Number);
      const entryDate = new Date(year, month - 1, day);

      const from = dateRange.from ? new Date(dateRange.from) : new Date(0);
      const to = dateRange.to ? new Date(dateRange.to) : new Date();

      entryDate.setHours(0, 0, 0, 0);
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);

      return entryDate >= from && entryDate <= to;
    });
  }, [trades, selectedUser, dateRange]);
     

  // PDF Download
  const handleDownloadPDF = () => {
    if (!ledgerData.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Ledger Report - ${selectedUser.username}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    autoTable(doc, {
      head: [
        ["Date", "Particulars", "Qty", "Rate", "Received", "Paid", "Balance"],
      ],
      body: ledgerData.map((entry, i) => [
        entry.date,
        // entry.i > 0
        //   ? particulars.match(/\(([^)]+)\)/)?.[1] || ""
        //   : entry.particulars,
        i > 0 ? entry.particulars.match(/\(([^)]+)\)/)?.[1] || "" : entry.particulars,
        entry.quantity || "-",
        entry.rate || "-",
        entry.debit || "-",
        entry.credit || "-",
        entry.balance,
      ]),
      theme: "striped",
      startY: 25,
      // styles: { fontSize: 10 },
      headStyles: {
        fillColor: [230, 240, 255],
        textColor: 20,
        halign: "center",
      },
      bodyStyles: {
        halign: "right",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 30 }, // Date
        1: { halign: "left", cellWidth: 40 }, // Particulars
        5: { textColor: [0, 0, 0] }, // Credit = Green
        4: { textColor: [0, 0, 0] }, // Debit = Red
        6: { fontStyle: "bold" }, // Balance bold
      },
      didParseCell: function (data) {
        // Apply color for Balance column dynamically
        if (data.section === "body" && data.column.index === 6) {
          const value = parseFloat(data.cell.raw.toString().replace(/,/g, ""));
          if (!isNaN(value)) {
            if (value > 0) data.cell.styles.textColor = [0, 0, 0]; // Green
            else if (value < 0) data.cell.styles.textColor = [0, 0, 0]; // Red
          }
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
    const finalBalance = ledgerData.at(-1).balance;
    const closingColor = finalBalance >= 0 ? [0, 0, 0] : [0, 0, 0];
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Final Balance:", 14, finalY);
    doc.setTextColor(...closingColor);
    doc.text(finalBalance.toLocaleString(), 60, finalY);

    doc.save(`${selectedUser.username}_ledger.pdf`);
    // doc.save(`${selectedUser.username}_ledger.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
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
          Ledger
        </h1>

        {/* Spacer to balance layout */}
        <div className="w-[60px]" />
      </div>
      <div className="flex justify-around gap-6">
        {/* Left Side - Ledger Tabs */}
        <div className="flex gap-7 justify-around m-10">
          <button
            onClick={() => setLedgerType("party")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Party Ledger
          </button>
          <button
            onClick={() => setLedgerType("all")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            All Ledger
          </button>
        </div>
      </div>

      {ledgeerType === "party" && (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <label className="text-gray-700 font-medium">Select Party:</label>
            <select
              className="border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
              value={selectedUser?.id || ""}
              onChange={(e) => {
                const user = partyUsers.find(
                  (u) => u.id === Number(e.target.value)
                );
                setSelectedUser(user);
              }}
            >
              <option value="">-- Select Party --</option>
              {partyUsers?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <label>From:</label>
              <input
                type="date"
                className="border p-2 rounded-md"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <label>To:</label>
              <input
                type="date"
                className="border p-2 rounded-md"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>

            {ledgerData.length > 0 && (
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
              >
                Download PDF
              </button>
            )}
          </div>

          {/* Ledger Table */}
          {ledgerData.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Particulars</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                      <th className="py-3 px-4 text-right">Rate</th>
                      <th className="py-3 px-4 text-right">We Received</th>
                      <th className="py-3 px-4 text-right">We Paid</th>
                      <th className="py-3 px-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  {/* <tbody>
                    {ledgerData.map((entry, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{entry.date}</td>
                        <td className="py-2 px-4">{entry.particulars}</td>
                        <td className="py-2 px-4 text-right">
                          {entry.quantity || "-"}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {entry.rate || "-"}
                        </td>
                        {selectedUser?.id == 24 ? (
                          <td className="py-2 px-4 text-right text-green-600">
                            {entry.debit || "-"}
                          </td>
                        ) : (
                        <td className="py-2 px-4 text-right text-green-600">
                          {entry.debit || "-"}
                        </td>
                        )}

                        {selectedUser?.id == 25 ? (
                          <td className="py-2 px-4 text-right text-red-600">
                            {entry.credit || "-"}
                          </td>
                        ) : (
                        <td className="py-2 px-4 text-right text-red-600">
                          {entry.credit || "-"}
                        </td>
                        )}  

                        {selectedUser?.id == 24 && (
                          <td
                            className={`py-2 px-4 text-right font-semibold 
                        ${
                          entry.balance >= 0 ? "text-red-700" : "text-green-700"
                        }
                        `}
                          >
                            {Math.abs(entry.balance)}
                          </td>
                        )}
                        {selectedUser?.id == 25 && (
                          <td
                            className={`py-2 px-4 text-right font-semibold 
                        ${
                          entry.balance >= 0 ? "text-red-700" : "text-green-700"
                        }
                        `}
                          >
                            {- entry.balance}
                          </td>
                        )}
                        {selectedUser?.id != 24 && selectedUser?.id != 25 && (
                          <td
                            className={`py-2 px-4 text-right font-semibold 
                        ${
                          entry.balance >= 0 ? "text-red-700" : "text-green-700"
                        }
                        `}
                          >
                            {entry.balance}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody> */}
                  <tbody>
                    {ledgerData.map((entry, index) => {
                      const isOpening = entry.particulars === "Opening Balance";

                      return (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-4">{entry.date}</td>
                          <td className="py-2 px-4">{entry.particulars}</td>
                          <td className="py-2 px-4 text-right">
                            {entry.quantity || "-"}
                          </td>
                          <td className="py-2 px-4 text-right">
                            {entry.rate || "-"}
                          </td>

                          {/* We Paid (Debit → Red) */}
                          <td
                            className={`py-2 px-4 text-right font-medium ${
                              entry.debit ? "text-grey-600" : "text-gray-600"
                            }`}
                          >
                            {entry.debit
                              ? formatNumberIndian(entry.debit)
                              : "-"}
                            {/* We Received (Credit → Green) */}
                          </td>
                          <td
                            className={`py-2 px-4 text-right font-medium ${
                              entry.credit ? "text-grey-600" : "text-gray-600"
                            }`}
                          >
                            {entry.credit
                              ? formatNumberIndian(entry.credit)
                              : "-"}
                          </td>

                          {/* Balance (Dynamic color + Opening balance always red) */}
                          <td
                            className={`py-2 px-4 text-right font-semibold ${
                              isOpening
                                ? "text-grey-700"
                                : entry.balance >= 0
                                ? "text-grey-700"
                                : "text-grey-700"
                            }`}
                          >
                            {formatNumberIndian(entry.balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Final Balance */}
              <div className="text-right mt-4 font-semibold text-gray-700">
                Final Balance:{" "}
                {/* {selectedUser?.id == 24 && ( */}
                {selectedUser?.username == "Profit" && (
                  <span
                    className={`${
                      ledgerData.at(-1).balance >= 0
                        ? "text-grey-700"
                        : "text-grey-700"
                    }`}
                  >
                    {formatNumberIndian(Math.abs(ledgerData.at(-1).balance))}
                  </span>
                )}
                {/* {selectedUser?.id == 25 && ( */}
                {selectedUser?.username == "Loss" && (
                  <span
                    className={`${
                      ledgerData.at(-1).balance >= 0
                        ? "text-grey-700"
                        : "text-grey-700"
                    }`}
                  >
                    -{formatNumberIndian(ledgerData.at(-1).balance)}
                  </span>
                )}
                {selectedUser?.username !== "Loss" && selectedUser?.username !== "Profit" && (
                  <span
                    className={`${
                      ledgerData.at(-1).balance >= 0
                        ? "text-grey-700"
                        : "text-grey-700"
                    }`}
                  >
                    {formatNumberIndian(ledgerData.at(-1).balance)}
                  </span>
                )}
                {/* <span
                  className={`${
                    ledgerData.at(-1).balance >= 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {ledgerData.at(-1).balance.toLocaleString()}
                </span> */}
              </div>
            </>
          ) : (
            selectedUser && (
              <p className="text-gray-500 italic mt-8 text-center">
                No trades found for {selectedUser.username} in selected date
                range.
              </p>
            )
          )}
        </>
      )}
      {ledgeerType === "all" && <AllLedger />}
    </div>
  );
};

export default LedgerPage;
