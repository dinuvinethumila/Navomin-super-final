// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/Login.jsx";
import MyOrder from "./pages/MyOrder.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import PreOrderBakery from "./pages/PreOrderBakery.jsx";
import CardPayment from "./pages/CardPayment.jsx";
import Signup from "./pages/signup.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import Product from "./pages/Product.jsx";
import Profile from "./pages/Profile.jsx";
import { UserProvider } from "./UserContext.jsx";
import OrderDetails from "./pages/OrderDetails";



function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/myorders" element={<MyOrder />} />
          <Route path="/shoppingcart" element={<ShoppingCart />} />
          <Route path="/preorderbakery" element={<PreOrderBakery />} />
          <Route path="/CardPayment" element={<CardPayment />} />
          <Route path="/OrderConfirmation" element={<OrderConfirmation />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
        <Route path="/orderDetails" element={<OrderDetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
