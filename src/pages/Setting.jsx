import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommodity, enumCall } from "../redux/slice/enums";
import {
  createCustomer,
  createUser,
  fetchParty,
  fetchUser,
} from "../redux/slice/user";
import { FaPlus, FaTrash } from "react-icons/fa";
import AllTrades from "../components/AllTrades";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import Snackbar from "../components/Snackbar";
import TradeHeader from "../components/TradeHeader";

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const userProfile = useMemo(
    () => JSON.parse(localStorage.getItem("userData")),
    []
  );
  const [formData, setFormData] = useState({
    username: "",
    Ref: "",
    password: "",
    mobile: "",
    altMobile: "",
    whatApp: "",
    role: 3,
    openingBalance: "",
    currencyFormat: null,
    commoditiesHolding: [{ commoditiesId: null, quantity: null }],
  });

  const [newCommodity, setNewCommodity] = useState("");
  const [showAddCommodity, setShowAddCommodity] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const enumData = useSelector((state) => state.enum?.data);
  const userData = useSelector((state) => state.user?.data);
  const partyData = useSelector((state) => state.user?.party);
  useEffect(() => {
    dispatch(enumCall());
    dispatch(fetchUser());
    dispatch(fetchParty({ userId: userProfile.user.id }));
  }, [dispatch]);

  // ========== Form Handlers ==========
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name == "openingBalance" ||
      name == "role" ||
      name == "currencyFormat"
    ) {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleHoldingChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.commoditiesHolding];
      updated[index][key] = Number(value);
      return { ...prev, commoditiesHolding: updated };
    });
  };

  const handleAddHolding = () => {
    setFormData((prev) => ({
      ...prev,
      commoditiesHolding: [
        ...prev.commoditiesHolding,
        { commoditiesId: "", quantity: "" },
      ],
    }));
  };

  const handleRemoveHolding = (index) => {
    setFormData((prev) => ({
      ...prev,
      commoditiesHolding: prev.commoditiesHolding.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.role === 3) {
      formData["underUser"] = userProfile.user.id;
      dispatch(createCustomer(formData))
        .then((res) => {
          if (res?.meta?.requestStatus == "fulfilled") {
            setSnackbar({
              visible: true,
              type: "success",
              message: "User Created successfully!",
            });
            setFormData({
              username: "",
              Ref: "",
              password: "",
              mobile: "",
              altMobile: "",
              whatApp: "",
              role: 3,
              openingBalance: "",
              currencyFormat: null,
              commoditiesHolding: [{ commoditiesId: null, quantity: null }],
            });
            dispatch(fetchUser());
            dispatch(fetchParty({ userId: userProfile.user.id }));
          } else {
            setSnackbar({
              visible: true,
              type: "error",
              message: res?.payload?.error,
            });
          }
        })
        .catch((err) => console.log("Error Creating Customer:", err));
    } else {
      dispatch(createUser(formData))
        .then((res) => {
          if (res?.meta?.requestStatus == "fullfilled") {
            dispatch(fetchUser());
            dispatch(fetchParty({ userId: userProfile.user.id }));
          }
        })
        .catch((err) => console.log("Error Creating User:", err));
    }
  };

  // ========== Commodities ==========
  const handleAddCommodity = () => {
    if (!newCommodity.trim()) return;
    dispatch(addCommodity({ name: newCommodity })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSnackbar({
          visible: true,
          type: "success",
          message: "Commodity Added successfully!",
        });
        setShowAddCommodity(false);
        setNewCommodity("");
        dispatch(enumCall());
      } else {
        setSnackbar({
          visible: true,
          type: "error",
          message: "Failed to Add Commodity.",
        });
      }
    });
  };

  return (
    <div className="">
      {/* ===== Navbar ===== */}
      <TradeHeader userProfile={userProfile} />

      <div className="flex item-center justify-around space-x-6 border-b border-gray-300 mb-6">
        <button onClick={() => navigate("/trade")}>Back</button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "users"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User List
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "commodities"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("commodities")}
        >
          Commodities List
        </button>
        <button
          className={`pb-2 font-semibold ${
            activeTab === "userTradeList"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("userTradeList")}
        >
          User Trade List
        </button>
      </div>

      {/* ===== USER LIST TAB ===== */}
      {activeTab === "users" && (
        <UserManagement
          handleSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          enumData={enumData}
          handleAddHolding={handleAddHolding}
          handleHoldingChange={handleHoldingChange}
          handleRemoveHolding={handleRemoveHolding}
          // userData={userData}
          userData={partyData}
        />
      )}

      {/* ===== COMMODITIES LIST TAB ===== */}
      {activeTab === "commodities" && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Commodities List</h2>
            {/* <button
              onClick={() => setShowAddCommodity((prev) => !prev)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus size={14} />
              <span>Add Commodity</span>
            </button> */}
          </div>

          {showAddCommodity && (
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="Enter Commodity Name"
                value={newCommodity}
                onChange={(e) => setNewCommodity(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={handleAddCommodity}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Save
              </button>
            </div>
          )}

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
              </tr>
            </thead>
            <tbody>
              {enumData?.commodities?.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "userTradeList" && <AllTrades />}
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

export default Setting;
