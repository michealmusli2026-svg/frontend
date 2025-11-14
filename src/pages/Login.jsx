import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slice/login";
import Snackbar from "../components/Snackbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
   const [snackbar, setSnackbar] = useState({
      visible: false,
      type: "",
      message: "",
    });
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSnackbar({
          visible: true,
          type: "success",
          message: "Login Success",
        });
      } else {
        setSnackbar({
          visible: true,
          type: "error",
          message: "Check Username or Password",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="text-blue-600 mb-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm-1 12H6v-3h3v3zm-3-4V6h3v4H6zm4 4h3v-3h-3v3zm3-4V6h-3v4h3z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-800">TradeMaster</div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Welcome Back to TradeMaster
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Email Input Group */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your registered username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Password Input Group */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Shhh! Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Icon Placeholder */}
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Log In
          </button>
        </form>
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

export default Login;
