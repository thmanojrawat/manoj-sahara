import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/data";
import Navbar from "./Navbar";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const [active, setActive] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const location = useLocation();
  const {
    navigate,
    user,
  } = useAppContext();
  const { openSignIn } = useClerk();

  const BookingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 12h-5" />
      <path d="M15 8h-5" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
    </svg>
  );

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setActive(window.scrollY > 10);
      } else {
        setActive(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpened(false);
  }, [location.pathname]);

  return (
    <header style={{ '--header-height': '64px' }}
      className={`${
        active ? "bg-white py-3 shadow-md" : "py-4"
      } fixed top-0 w-full left-0 right-0 z-50 transition-all duration-200`}
    >
      <div
        className={`max-padd-container transition-all duration-200 ${
          menuOpened ? "lg:pr-80" : ""
        }`}
      >
        {/* Container */}
        <div className="flexBetween">
          {/* Logo */}
          <div className="flex flex-1">
            <Link to={"/"}>
              <img
                src={assets.logoImg}
                alt="LogoImg"
                className="invert h-11"
              />
            </Link>
          </div>
          {/* Navbar */}
          <Navbar
            setMenuOpened={setMenuOpened}
            containerStyles={`hidden lg:flex lg:-translate-x-12 gap-x-5 xl:gap-x-1 medium-15 p-1 ${!active ? "text-white" : ""}`}
          />
          {/* Buttons & Profile */}
          <div className="flex sm:flex-1 items-center sm:justify-end gap-x-4 sm:gap-x-8 xl:gap-x-4">
            {/* User Profile */}
            <div className="group relative top-1">
              <div>
                {user ? (
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: {
                          width: "42px",
                          height: "42px",
                        },
                      },
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="My Bookings"
                        labelIcon={<BookingIcon />}
                        onClick={() => navigate("/my-bookings")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <button
                    onClick={openSignIn}
                    className="btn-secondary flexCenter gap-2 rounded-full"
                  >
                    Login
                    <img src={assets.user} alt="userIcon" />
                  </button>
                )}
              </div>
            </div>
            {/* Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpened(true)}
              aria-label="Open menu"
              aria-expanded={menuOpened}
              className={`${!active && "invert"} shrink-0 cursor-pointer transition-transform duration-200 ${
                menuOpened ? "lg:translate-x-80" : ""
              }`}
            >
              <img src={assets.menu} alt="" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {menuOpened && (
        <aside
          className="fixed inset-y-0 right-0 z-[60] h-screen w-[min(20rem,88vw)] overflow-y-auto bg-white p-6 shadow-2xl"
          aria-label="Site menu"
        >
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Close menu"
            className="absolute top-6 left-6 cursor-pointer"
          >
            <img src={assets.close} alt="" className="h-6 w-6" />
          </button>
          <Navbar
            setMenuOpened={setMenuOpened}
            containerStyles="flex flex-col items-start gap-y-6 pt-20 text-lg font-bold"
            extraLinks={[
              { path: "/faq", title: "FAQ", drawerSelection: true },
              { path: "/feedback", title: "Feedback", drawerSelection: true },
            ]}
          />
        </aside>
      )}
    </header>
  );
};

export default Header;
