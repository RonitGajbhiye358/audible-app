import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Container from "../container";
import { selectCurrentUserRole, selectIsAuthenticated } from "../../app/authSlice";
import Logo from "../Logo";
import LogoutButton from "../LogoutButton";

function AdminNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const userRole = useSelector(selectCurrentUserRole);
  const authStatus = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = [
    {
      name: "Users",
      slug: "/admin/users",
      active: userRole === "ADMIN",
      icon: "Users.png",
    },
    {
      name: "Books",
      slug: "/admin/books",
      active: userRole === "ADMIN",
      icon: "Books.png",
    },
    {
      name: "Orders",
      slug: "/admin/orders",
      active: userRole === "ADMIN",
      icon: "Orders.png",
    },
    
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full py-2 bg-gray-800 fixed top-0 z-30 ${isScrolled ? "bg-gray-900 bg-opacity-90 shadow-md" : "bg-opacity-85"}`}>
      <Container>
        <nav className="flex items-center">
          <div className="mr-4">
            <NavLink to="/admin/dashboard">
              <Logo width="70px" className="filter invert" />
            </NavLink>
          </div>
          
          <ul className="flex ml-auto gap-4">
            {adminNavItems.map((item) => (
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      console.log("Navigating to:", item.slug); // Fixed to use item.slug
                      navigate(item.slug);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-md transition-colors
                      ${location.pathname.startsWith(item.slug) 
                        ? "bg-gray-700 text-white" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <img 
                      src={`/${item.icon}`} 
                      alt={item.name}
                      className="w-6 h-6 invert"
                    />
                    <span className="hidden md:inline">{item.name}</span>
                  </button>
                </li>
              )
            ))}
            {authStatus && <LogoutButton />}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default AdminNav;