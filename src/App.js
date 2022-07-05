import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Template from './template/Template';
import Login from "./pages/login-register/Login";
import Register from "./pages/login-register/Register";
import Error from "./pages/Error";
import MyAccount from "./pages/myaccount/MyAccount";
import Product from "./pages/product/Product";
import Searchbar from "./template/searchbar";
import Checkout from "./pages/checkout/Checkout";
import Categoriess from "./pages/categories/Categories";
import Catscreen from "./pages/categories/Catscreen";
import Wishlist from "./pages/wishlist/Wishlist";
import Notifications from "./pages/notifications/notifications";

import Testcheckout from "./pages/checkout/testcheckout";

import Cart from "./pages/cart/Cart";
import AboutUs from "./pages/aboutus/AboutUs";
import ContactUs from "./pages/contactus/ContactUs";
import Welcome from "./pages/welcome/Welcome";
import Home from "./pages/home/Home";
import Homepage from './pages/homepage';
import Reset from './pages/login-register/reset';
import Search from "./pages/search/Search";
import PMHome from './components/product_manager/PMHome';
import ManageProducts from './components/product_manager/ManageProducts';
import ManageDeliveries from './components/product_manager/ManageDeliveries';
import Screen from "./pages/screen/screen";

import SMHome from './components/sales_manager/SMHome';
import ManageDiscounts from './components/sales_manager/ManageDiscounts';
import AnalyzePerformance from "./components/sales_manager/AnalyzePerformance";

import MyOrder from "./pages/myorder/MyOrder";
import Categories from "./pages/categories/Categories";
import Email from './pages/checkout/Email';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, lightBlue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: lightBlue[800],
    },
    secondary: {
      main: grey[300],
    },
  }
});

function App() {
  return (
    <>
      <Router>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="login" element={<Login />} />
          <Route path="Screen" element={<Screen />} />
          <Route path="search" element={<Search />} />
          <Route path="register" element={<Register />} />
          <Route path="error" element={<Error />} />
          <Route path="myaccount" element={<MyAccount />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="category/:name" element={<Catscreen />} />
          <Route path="searchbar/:query" element={<Searchbar />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path ="/Homepage" element={<Homepage/>} />
          <Route path ="/Reset" element={<Reset/>} />
          <Route path ="/pmHome" element={<PMHome/>} />
          <Route path="/pmManageProducts" element={ <ManageProducts /> } />
          <Route path="/pmManageDeliveries" element={ <ManageDeliveries /> } />
          <Route path="/smHome" element={<SMHome />} /> 
          <Route path="/smManageDiscounts" element={<ManageDiscounts />} />
          <Route path="/smAnalyzePerformance" element={<AnalyzePerformance />} />
          <Route path="myorder" element={<MyOrder />} />
          <Route path="/contactUs" element={<Email />} />
          <Route path='/testCheckout' element={<Testcheckout />} />
        </Routes>
      </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
