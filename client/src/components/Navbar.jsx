import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = ({ setMenuOpened, containerStyles, extraLinks = [] }) => {
  const location = useLocation();
  const navLinks = [
    { path: "/", title: "Home" },
    { path: "/listing", title: "Discover Stays" },
    { path: "/blog", title: "About Us" },
    { path: "/contact", title: "Contact Us" },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {[...navLinks, ...extraLinks].map((link) => (
        <NavLink
          onClick={() => {
            setMenuOpened(false);
            scrollTo(0,0);
          }}
          key={link.title}
          to={link.path}
          state={link.drawerSelection ? { drawerSelection: link.title } : undefined}
          className={({ isActive }) => {
            const isSelectedDrawerLink =
              link.drawerSelection &&
              location.state?.drawerSelection === link.title;
            const isPrimaryActive =
              isActive && !link.disableActive && !location.state?.drawerSelection;

            return `${isPrimaryActive || isSelectedDrawerLink ? "active-link" : ""} px-3 py-2 rounded-full uppercase text-sm font-bold`;
          }}
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
