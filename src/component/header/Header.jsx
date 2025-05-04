import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../app/authSlice";
import LogoutButton from "../LogoutButton";
import Container from "../container";
import Logo from "../Logo";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const authStatus = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: !authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/register",
      active: !authStatus,
    },
    {
      name: "All Audiobooks",
      slug: "/audiobooks",
      active: authStatus,
    },
    {
      name: "Cart",
      slug: "/Cart",
      active: authStatus,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full bg-[rgb(11,20,47)] bg-opacity-85 fixed top-0 z-30 duration-100 ease-out ${
        isScrolled ? "bg-rgb(40,29,69) bg-opacity-80 text-lg text-white" : "bg-transparent text-black"
      }`}
    >
      <Container>
        <nav className="flex flex-col items-center md:flex-row">
          <div className="md:mr-4">
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>
          <ul className="flex md:ml-auto items-center gap-1 sm:gap-2 lg:gap-8">
            {navItems.map((item) =>
              item.active ? (
                <li
                  key={item.name}
                  className={`hover:text-pink-500 ${isScrolled ? "" : "hover:bg-slate-100"} cursor-pointer rounded-xl ${
                    location.pathname === item.slug
                      ? "text-pink-500 bg-pink-500 md:bg-transparent"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => navigate(item.slug)}
                    title={item.name}
                    className={`flex justify-center items-center gap-1 md:gap-4 p-3 md:px-4 md:py-2 duration-200 text-lg`}
                  >
                    <img
                      src={`/${item.name}.png`}
                      alt={item.name}
                      className={`w-7 h-7 ${isScrolled ? "invert" : ""}`}
                    />
                    <div className="collapse md:visible w-0 md:w-auto text-[0px] md:text-lg">
                      {item.name}
                    </div>
                  </button>
                </li>
              ) : null
            )}
            {authStatus && <LogoutButton />}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
