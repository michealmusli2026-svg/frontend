import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchParty, fetchUser, fetchUserTrade } from "../redux/slice/user";
import { formatNumberIndian } from "../utils/numberForamt";

const AllLedger = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const users = useSelector((state) => state.user?.data);
  const party = useSelector((state) => state.user?.party);
  const trades = useSelector((state) => state.user?.trade);
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchParty({ userId: userProfile.user.id }));
    dispatch(
      fetchUserTrade({
        userId: userProfile.user.id,
        order: "ASC",
        complete: true,
      })
    );
  }, []);
  // const partyUsers = useMemo(
  //   () => users?.users?.filter((u) => u.role === "party") || [],
  //   [users]
  // );
  const partyUsers = party?.users;
  // useEffect(() => {
  //   if (selectedUser) {
  //     dispatch(fetchUserTrade({userId:userProfile.user.id,order:"ASC"}));
  //   }
  // }, [dispatch, selectedUser]);

  function addOpeningBalance(users, balances) {
    return users.map((user) => {
      const name = user.username;
      const balanceData = balances[name];
      if (balanceData) {
        const { received, paid } = balanceData;
        return {
          name,
          updatedBalance: received - paid + user.balance,
        };
      }
      return {
        name,
        updatedBalance: user.balance || 0,
      };
    });
  }

  const balances = useMemo(() => {
    const ledger = {};
    trades?.forEach((trade) => {
      const from = trade.fromId.value;
      const to = trade.toId.value;
      const fromTotal = Number(trade.fromTotal.value);
      const toTotal = Number(trade.toTotal.value);
      // if(from !== "Expense" && from !== "Services"){
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
    const bottomItems = ["Services", "Expense", "Profit", "Loss"];
    const reordered = [
      ...openingBalance.filter((item) => !bottomItems.includes(item.name)),
      ...openingBalance.filter((item) => bottomItems.includes(item.name)),
    ];
    //     const reordered = [
    //   ...openingBalance.filter((item) => item.name !== "Services" && item.name !== "Expense"),
    //   ...openingBalance.filter((item) => item.name === "Services" || item.name === "Expense"),
    // ];
    return reordered;
  }, [trades]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h2 className="text-2xl font-bold mb-4 text-gray-700">Balance Sheet</h2> */}
      {/* <div className="mb-6 flex flex-wrap items-center gap-3">
                <label className="text-gray-700 font-medium">Select Party:</label>
                <select
                    className="border border-gray-300 rounded-md p-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                    value={selectedUser?.id || ""}
                    onChange={(e) => {
                        const user = partyUsers.find((u) => u.id === Number(e.target.value));
                        setSelectedUser(user);
                    }}
                >
                    <option value="">-- Select Party --</option>
                    {partyUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div> */}
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">Party</th>
            {/* <th className="py-2 px-4 text-right">Received</th> */}
            {/* <th className="py-2 px-4 text-right">Paid</th> */}
            <th className="py-2 px-4 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((entry) => (
            <tr
              key={entry.name}
              className="border-t hover:bg-gray-50 transition duration-150"
            >
              <td className="py-2 px-4 font-medium text-gray-800">
                {entry.name}
              </td>
              {/* <td className="py-2 px-4 text-right">
                                {entry.received.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 text-right">
                                {entry.paid.toLocaleString()}
                            </td> */}
              <td
                className={`py-2 px-4 text-right font-semibold ${
                  entry.updatedBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatNumberIndian(entry.updatedBalance)}
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-2 px-4 font-bold text-gray-900">Total</td>
            <td
              className={`py-2 px-4 text-right font-bold ${
                balances.reduce(
                  (sum, entry) => sum + entry.updatedBalance,
                  0
                ) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatNumberIndian(
                balances
                  .reduce((sum, entry) => sum + entry.updatedBalance, 0)
                  .toFixed(2)
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AllLedger;
