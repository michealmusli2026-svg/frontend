import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TradePage from "./pages/TradePage";
import Login from "./pages/Login";
import "./App.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enumCall } from "./redux/slice/enums";
import Setting from "./pages/Setting";
import LedgerPage from "./components/LedgerPage";
import BalanceSheet from "./components/BalanceSheet";
import AllLedger from "./components/AllLeadger";
import PLSheet from "./components/PLSheets";
import PartyPLSheet from "./components/PartyPLSheet";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  const dispatch = useDispatch()
  const [token, setToken] = useState(null);
  const checkToken = useSelector((state) => state?.login?.auth)
  useEffect(() => {
    if (checkToken && checkToken.token) {
      localStorage.setItem('userData', JSON.stringify(checkToken));
      setToken(checkToken.token)
    }
  }, [checkToken])

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('userData'))) {
      setToken(JSON.parse(localStorage.getItem('userData')).token)
    }
    // dispatch(enumCall())
  }, [])

  return (
    // <Router>
    //   <Routes>
    //     <Route
    //       path="/trade"
    //       element={token ? <TradePage /> : <Navigate to="/" replace />}
    //     />
    //     <Route
    //       path="/"
    //       element={token ? <Navigate to="/trade" replace /> : <Login />}
    //     />
    //     <Route 
    //       path="/setting"
    //       element={<Setting />}
    //       />
    //       <Route 
    //       path="/balancesheet"
    //       element={<BalanceSheet />}
    //       />
    //       <Route 
    //       path="/ledger/:name?"
    //       element={<LedgerPage />}
    //       />
    //       <Route 
    //       path="/pandl"
    //       element={<PLSheet />}
    //       />
    //       {/* <Route 
    //       path="partyPL"
    //       element={<PartyPLSheet />}
    //       /> */}
    //     <Route
    //       path="*"
    //       element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>}
    //     />
    //   </Routes>
    // </Router>
    <Router>
  <Routes>
    {/* Public Route */}
    <Route
      path="/"
      element={<Login />}
    />

    {/* Private Routes */}
    <Route
      path="/trade"
      element={
        <PrivateRoute>
          <TradePage />
        </PrivateRoute>
      }
    />

    <Route
      path="/setting"
      element={
        <PrivateRoute>
          <Setting />
        </PrivateRoute>
      }
    />

    <Route
      path="/balancesheet"
      element={
        <PrivateRoute>
          <BalanceSheet />
        </PrivateRoute>
      }
    />

    <Route
      path="/ledger/:name?"
      element={
        <PrivateRoute>
          <LedgerPage />
        </PrivateRoute>
      }
    />

    <Route
      path="/pandl"
      element={
        <PrivateRoute>
          <PLSheet />
        </PrivateRoute>
      }
    />

    {/* 404 */}
    <Route
      path="*"
      element={<h2 style={{ textAlign: "center" }}>404 - Page Not Found</h2>}
    />
  </Routes>
</Router>

  );
}

export default App;
