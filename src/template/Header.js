import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsBagPlusFill, BsFillBookmarkHeartFill,BsFillChatLeftTextFill } from "react-icons/bs";
import {RiAccountCircleFill} from "react-icons/ri";

import Logo from "../components/logo.jpeg";
import Sidebar from "../components/sidebar/Sidebar";
import firebase from 'firebase';
import { useNavigate } from "react-router-dom";
import './header.css';

import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

import { doc, onSnapshot } from "firebase/firestore";
import { db, storage } from '../firebase'
import Searchbar from "./searchbar";




function Header() {

  let navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [cartNum, setCartNum] = useState(0);
  const [favNum, setFavNum] = useState(0);
  const [NotNum, setNotNum] = useState(0);
  const [query, setquery] = useState("");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    
  };

  const handleClose = () => {
    setAnchorEl(null);
    
  };

  const signout = () =>{
    setAnchorEl(null);
      firebase.auth().signOut().then(()=>{
          if(firebase.auth().currentUser == null){
              let path = '/'; 
                    navigate(path);
        
        }
      });
  }
  
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    if (firebase.auth().currentUser != null) {
      db.collection('users').doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
        //console.log("CURRENT DATA", snapshot.data());
        var values = snapshot.data();
        var cart = values.cart;
        var favourite = values.favourite;
        var notifications = values.notifications;
        setCartNum(cart.length);
        setFavNum(favourite.length);
        setNotNum(notifications.length);
      })
    }
    //setInitials(firebase.auth().currentUser().displayName());
  }, []);

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav(event) {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  function navigateLogin() {
    let path = '/login';
    setAnchorEl(null);
    navigate(path);
  }

  function navigateAccount() {
    //let path = '/myaccount';
    setAnchorEl(null);
    //navigate(path);
    
  }

  async function endAnonSession() {
    await db.collection('users').doc(`${firebase.auth().currentUser.uid}`).delete().then(async () => {
      await firebase.auth().currentUser.delete();
    }).then(() => {
      let path = '/'
      navigate(path);
    })
  }


  if(firebase.auth().currentUser == null){
    return (
      <header>
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white border-bottom">
          <Sidebar />
          <div className="container-fluid">
            <Link className="navbar-brand" to="/" onClick={changeNav}>
              <img src={Logo} alt="" style={{ height: "70px" }} />
            </Link>
            <div
              className={
                "navbar-collapse offcanvas-collapse " +
                (openedDrawer ? "open" : "")
              }
            >
               <ul className="nav navbar-nav navbar-logo mx-auto">
              <form className="d-flex">
                
                
              </form>
            </ul>
              <ul className="navbar-nav me-auto mb-lg-0"></ul>
              
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={navigateLogin}
                color="inherit"
              >
               <AccountCircle fontSize="35" sx={{ color: "#f77d0b" }}/>
              </IconButton>
            </div>
  
            <div className="d-inline-block d-lg-none">
              <button type="button" class=" position-relative">
                <BsBagPlusFill style={{ color: "#f77d0b" }} size={25}  />
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                  1<span class="visually-hidden">unread</span>
                </span>
              </button>
              <button
                className="navbar-toggler p-0 border-0 ms-3"
                type="button"
                onClick={toggleDrawer}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white border-bottom">
        <Sidebar />
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={changeNav}>
            <img src={Logo} alt="" style={{ height: "70px" }} />
          </Link>
          <div
            className={
              "navbar-collapse offcanvas-collapse " +
              (openedDrawer ? "open" : "")
            }
          >
            <ul className="nav navbar-nav navbar-logo mx-auto">
              <form className="d-flex">
                <input
                  className="form-control me-2"
                  value={query}
                  onChange={(event) => setquery(event.target.value)}
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                  style={{ width: "450px", marginLeft: "100px" }}
                />
                <Link
                  className="btn search-btn"
                  to={"/searchbar/" + query}
                  key={query}
                  state={{ query: query }}
                >
                  Search
                </Link>
              </form>
            </ul>

            <ul className="navbar-nav me-auto mb-lg-0"></ul>

            
            <button type="button" class=" position-relative">
              <BsFillBookmarkHeartFill
                style={{ color: "#f77d0b" }}
                size={25}
                onClick={() => navigate("/wishlist")}
              />
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                {favNum}
                <span class="visually-hidden"></span>
              </span>
            </button>
            <button type="button" class=" position-relative">
              <BsFillChatLeftTextFill
                style={{ color: "#f77d0b", marginLeft: '10px' }}
                size={25}
                onClick={() => navigate("/notifications")}
              />
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                {NotNum}
                <span class="visually-hidden"></span>
              </span>
            </button>
            
            <button type="button" class=" position-relative">
              <BsBagPlusFill
                style={{ color: "#f77d0b", marginLeft: '10px' }}
                size={25}
                onClick={() => navigate("/cart")}
              />
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">
                {cartNum}
                <span class="visually-hidden"></span>
              </span>
            </button>
            {firebase.auth().currentUser.isAnonymous == false && (
              <button type="button" class=" position-relative">
                <RiAccountCircleFill
                  style={{ color: "#f77d0b", margin: "0 10px 0 10px" }}
                  size={25}
                  onClick={() => navigate("/myaccount")}
                />
              </button>
            )}
            {firebase.auth().currentUser.isAnonymous == false && (
              <button
                className="btn logout-btn"
                style={{ margin: "0 0 0 20px" }}
                onClick={signout}
              >
                Sign Out
              </button>
            )}
            {firebase.auth().currentUser.isAnonymous == true && (
              <button
                className="btn logout-btn"
                style={{ margin: "0 0 0 20px" }}
                onClick={endAnonSession}
              >
                End Session
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
