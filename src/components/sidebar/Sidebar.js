import React, { useState, useEffect } from "react";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { IconContext } from "react-icons";
import { ImHome } from "react-icons/im";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFillTelephoneFill, BsInfoCircleFill } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import firebase from "firebase";
import { db, storage } from '../../firebase';
// import { AiOutlineMenu } from "react-icons/ai";

function Sidebar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const [loggedIn,setLoggedIn] = useState(false);

  useEffect(() => {
    //console.log("AUTH STATUS", firebase.auth().currentUser);
    if (firebase.auth().currentUser != null) {
      setLoggedIn(true);
    }
  }, [firebase.auth().currentUser])

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <AiIcons.AiOutlineMenu
              style={{ color: "#f77d0b", margin: "0 20px 0 10px" }}
              size={40}
              onClick={showSidebar}
            />
          </Link>
        </div>
        <div className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {loggedIn && 
              <li className="nav-text">
                <Link to="/home">
                  <ImHome />
                  <span className="mg-16">Home</span>
                </Link>
              </li>
            }
            {loggedIn && 
              <li className="nav-text">
                <Link to="/categories">
                  <BiCategory />
                  <span className="mg-16">Categories</span>
                </Link>
              </li>
            
            }
            {loggedIn && 
              <li className="nav-text">
                <Link to="/search">
                  <BiSearchAlt2 />
                  <span className="mg-16">Search</span>
                </Link>
              </li>
            }
            <li className="nav-text">
              <Link to="/aboutus">
                <BsInfoCircleFill />
                <span className="mg-16">About Us</span>
              </Link>
            </li>
            <li className="nav-text">
              <Link to="/contactus">
                <BsFillTelephoneFill />
                <span className="mg-16">Contact Us</span>
              </Link>
            </li>
            {/*loggedIn && 
              <li className="nav-text">
                <Link to="/login">
                  <FaUserCircle />
                  <span className="myaccount">My Account</span>
                </Link>
              </li>
          */}
            {loggedIn && 
              <li className="nav-text">
                <Link to="/myorder">
                  <BsFillTelephoneFill />
                  <span className="mg-16">My Orders</span>
                </Link>
              </li>
            }
            {!loggedIn && 
              <li className="nav-text">
                <Link to="/login">
                  <FaUserPlus />
                  <span className="mg-16">Login/Register</span>
                </Link>
              </li>
            }
          </ul>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Sidebar;
