import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import {
  initializeAuth,
  selectCurrentUserRole
} from "./app/authSlice";
import Header from "./component/header/Header";
import Footer from "./component/Footer/Footer";
import AdminNav from "./component/header/AdminNav";
// import LoadingSpinner from "./component/ui/LoadingSpinner";

function App() {
  const dispatch = useDispatch();
  const userRole = useSelector(selectCurrentUserRole);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch(initializeAuth());
      } catch(err) {
        console.log("error occured :",err)
      }
    };
    initAuth();
  }, [dispatch]);

  // Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("main-header");
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      {userRole == "ADMIN" ? <AdminNav /> : <Header />}
      
      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;