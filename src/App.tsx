import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./Views/Home";
import ViewCoupon from "./Views/ViewCoupon";
import CreateCoupon from "./Views/CreateCoupon";
import UpdateCoupon from "./Views/UpdateCoupon";
import Page404 from "./Views/Page404";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApplyCoupon from "./Views/ApplyCoupon";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/coupon" element={<Home />} />
      <Route path="/404" element={<Page404 />} />
      <Route path="/coupon/create" element={<CreateCoupon />} />
      <Route path="/user/apply_coupon" element={<ApplyCoupon />} />
      <Route path="/coupon/update/:code" element={<UpdateCoupon />} />
      <Route path="/coupon/:code" element={<ViewCoupon />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
}

export default App;
