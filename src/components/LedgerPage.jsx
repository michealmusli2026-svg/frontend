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

  const party = useSelector((state) => state.user?.party);
  const trades = useSelector((state) => state.user?.trade);

  const [selectedUser, setSelectedUser] = useState(null);
  const [ledgeerType, setLedgerType] = useState("party");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  let partyName = decodeURIComponent(
    window.location.pathname.split("/").at(-1)
  );

  useEffect(() => {
    if (partyName) {
      const user = party?.users?.find((u) => u.username === partyName);
      setSelectedUser(user);
    }
  }, [partyName]);

  const showPartyLedger = (name) => {
    const user = party?.users?.find((u) => u.username === name);
    setSelectedUser(user);
    setLedgerType("party");
  };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchParty({ userId: userProfile.user.id }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(
        fetchUserTrade({
          userId: userProfile.user.id,
          order: "DESC",
          complete: true,
          offset: 0,
        })
      );
    }
  }, [dispatch, selectedUser]);

  const partyUsers = party?.users;

  const ledgerData = useMemo(() => {
    if (!trades || !selectedUser) return [];
    let balance = selectedUser.balance;

    const entries = [
      {
        adate: new Date(selectedUser.createdAt).toLocaleString(),
        edate: new Date(selectedUser.entryDate).toLocaleString(),
        particulars: "Opening Balance",
        rate: 0,
        quantity: 0,
        debit: 0,
        credit: 0,
        balance: selectedUser.balance,
      },
    ];

    trades.forEach((trade) => {
      const adate = new Date(trade.createdAt);
      const edate = new Date(trade.enterDate);
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

      if (!(debit || credit)) return;

      balance += credit - debit;

      entries.push({
        adate: adate.toLocaleString(),
        edate: edate.toLocaleString(),
        particulars,
        rate,
        quantity,
        debit,
        credit,
        balance,
        remark: trade.note,
      });
    });

    return entries.filter((e) => {
      if (!dateRange.from && !dateRange.to) return true;

      const [datePart] = e.edate.split(", ");
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

  const parseEDate = (edate) => {
    if (!edate || edate === "Invalid Date") return null;

    const [datePart, timePart] = edate.split(",").map((s) => s.trim());
    const [day, month, year] = datePart.split("/").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hh, mm, ss);
  };

  // PAGINATED DATA
  const paginatedData = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return ledgerData.slice(start, start + pageSize);
  }, [ledgerData, pageNumber]);

  const totalPages = Math.ceil(ledgerData.length / pageSize);

  const nextPage = () =>
    pageNumber < totalPages && setPageNumber(pageNumber + 1);
  const prevPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);
  const firstPage = () => setPageNumber(1);
  const lastPage = () => setPageNumber(totalPages);

  const handleDownloadPDF = () => {
    if (!ledgerData.length) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const finalBalance = formatNumberIndian(ledgerData.at(-1).balance);

    doc.setFontSize(16);
    doc.text(`Ledger Report - ${selectedUser.username}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Final Balance: ${finalBalance}`, pageWidth - 14, 22, {
      align: "right",
    });

    autoTable(doc, {
      head: [
        ["Date", "Particulars", "Qty", "Rate", "Received", "Paid", "Balance"],
      ],
      // body: ledgerData.map((entry, i) => [
      //   entry.edate.split(",")[0].trim(),
      //   i > 0 ? entry.particulars.match(/\(([^)]+)\)/)?.[1] || "" : entry.particulars,
      //   formatNumberIndian(entry.quantity) || "-",
      //   entry.rate || "-",
      //   formatNumberIndian(entry.debit) || "-",
      //   formatNumberIndian(entry.credit) || "-",
      //   formatNumberIndian(entry.balance),
      // ]),
      body: [...ledgerData]
        .sort((a, b) => {
          const dateA = parseEDate(a.edate);
          const dateB = parseEDate(b.edate);

          // Opening Balance / Invalid Date always first
          if (!dateA && !dateB) return 0;
          if (!dateA) return -1;
          if (!dateB) return 1;

          return dateA - dateB; // ASCENDING
        })
        .map((entry, i) => [
          entry.edate.split(",")[0].trim(),
          i > 0
            ? entry.particulars.match(/\(([^)]+)\)/)?.[1] || ""
            : entry.particulars,
          formatNumberIndian(entry.quantity) || "-",
          entry.rate || "-",
          formatNumberIndian(entry.debit) || "-",
          formatNumberIndian(entry.credit) || "-",
          formatNumberIndian(entry.balance),
        ]),
      theme: "striped",
      startY: 25,
    });

    doc.save(`${selectedUser.username}_ledger.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto  bg-gray-50 min-h-screen">
      <TradeHeader userProfile={userProfile} />

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all"
        >
          <FaArrowLeft className="text-lg" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
          Ledger
        </h1>

        <div className="w-[60px]" />
      </div>

      <div className="flex justify-around gap-6">
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
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <label className="text-gray-700 font-medium">Select Party:</label>
            <select
              className="border border-gray-300 rounded-md p-2 shadow-sm"
              value={selectedUser?.id || ""}
              onChange={(e) => {
                const user = partyUsers.find(
                  (u) => u.id === Number(e.target.value)
                );
                setSelectedUser(user);
                setPageNumber(1); // reset pagination on change
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
                className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
              >
                Download PDF
              </button>
            )}

            <div className="flex items-center gap-2 font-bold">
              <label>Final Balance:</label>
              <span>{formatNumberIndian(ledgerData.at(-1)?.balance)}</span>
            </div>
          </div>

          {ledgerData.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left">ADate</th>
                      <th className="py-3 px-4 text-left">EDate</th>
                      <th className="py-3 px-4 text-left">Particulars</th>
                      <th className="py-3 px-4 text-left">Quantity</th>
                      <th className="py-3 px-4 text-left">Rate</th>
                      <th className="py-3 px-4 text-left">We Received</th>
                      <th className="py-3 px-4 text-left">We Paid</th>
                      <th className="py-3 px-4 text-left">Balance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedData.map((entry, index) => (
                      <>
                        <tr
                          key={index}
                          className={`border-t text-sm transition-all ${
                            index % 2 === 0 ? "bg-red-100" : "bg-blue-100"
                          } ${
                            index % 2 === 0
                              ? "hover:bg-red-200"
                              : "hover:bg-blue-200"
                          }`}
                        >
                          <td className="py-2 px-4">{entry.adate}</td>
                          <td className="py-2 px-4">{entry.edate}</td>
                          <td className="py-2 px-4">{entry.particulars}</td>
                          <td className="py-2 px-4">
                            {formatNumberIndian(entry.quantity) || "-"}
                          </td>
                          <td className="py-2 px-4">{entry.rate || "-"}</td>
                          <td className="py-2 px-4">
                            {entry.debit
                              ? formatNumberIndian(entry.debit)
                              : "-"}
                          </td>
                          <td className="py-2 px-4">
                            {entry.credit
                              ? formatNumberIndian(entry.credit)
                              : "-"}
                          </td>
                          <td className="py-2 px-4 font-bold">
                            {formatNumberIndian(entry.balance)}
                          </td>
                        </tr>

                        <tr className="bg-gray-50 border-b">
                          <td
                            colSpan="12"
                            className="px-2 py-1 text-sm italic text-gray-700"
                          >
                            📝 <b>Remark:</b>{" "}
                            {entry.remark?.trim()
                              ? entry.remark
                              : "No Remark added"}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Buttons */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={firstPage}
                  disabled={pageNumber === 1}
                  className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                >
                  ⏮ First
                </button>

                <button
                  onClick={prevPage}
                  disabled={pageNumber === 1}
                  className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                >
                  ◀ Prev
                </button>

                <span className="font-semibold text-gray-700">
                  Page {pageNumber} / {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={pageNumber === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Next ▶
                </button>

                <button
                  onClick={lastPage}
                  disabled={pageNumber === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
                >
                  Last ⏭
                </button>
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

      {ledgeerType === "all" && <AllLedger showPartyLedger={showPartyLedger} />}
    </div>
  );
};

export default LedgerPage;
