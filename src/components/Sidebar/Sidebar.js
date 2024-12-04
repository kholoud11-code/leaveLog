import React, { Component, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Nav,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  NavDropdown,
} from "react-bootstrap";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import {
  IoIosPeople,
  IoIosPersonAdd,
  IoIosHome,
  IoIosPaper,
} from "react-icons/io";
import { IoCalendar, IoList } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FaHourglassEnd } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";

function Sidebar({
  color,
  image,
  routes,
  path,
  path2,
  path3,
  path4,
  path5,
  path6,
  path7,
  path8,
}) {
  const userDetaile =
    JSON.parse(sessionStorage.getItem("firstname")) +
    " " +
    JSON.parse(sessionStorage.getItem("lastname"));
  const location = useLocation();
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  const [isHovered, setIsHovered] = useState(false);
  function hide() {
    let x = document.getElementById(".x1");
    if (x) {
      if (x.style.display === "none") {
        x.style.display === "block";
      } else {
        x.style.display === "none";
      }
    }
  }
  function getZoomLevel() {
    const ratio = Math.round((window.devicePixelRatio || 1) * 100);
    return ratio;
  }
  function icon(a) {
    if (a === "IoIosPeople") {
      return (
        <IoList
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "IoIosPersonAdd") {
      return (
        <IoIosPersonAdd
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "IoIosHome") {
      return (
        <IoIosHome
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "BarChart") {
      return (
        <FaChartBar
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "FaHourglassEnd") {
      return (
        <FaHourglassEnd
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "IoCalendar") {
      return (
        <IoCalendar
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "unit") {
      return (
        <IoIosPeople
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "MdAccountBalanceWallet") {
      return (
        <MdAccountBalanceWallet
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "FiSend") {
      return (
        <FiSend
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    } else if (a === "IoIosPaper") {
      return (
        <IoIosPaper
          className="icon"
          style={{ fontSize: "30px", marginRight: "11px" }}
        />
      );
    }
  }
  return (
    <div
      className="sidebar"
      style={{ overflow: "hidden" }}
      onMouseEnter={() =>
        getZoomLevel() > 75 ? setIsHovered(true) : setIsHovered(false)
      }
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-background" />
      <div
        className="sidebar-wrapper"
        style={{
          overflowY: isHovered ? "auto" : "hidden",
          backgroundImage:
            "linear-gradient(to right,rgb(33, 55, 128) 1%, rgb(88, 118, 170) 100%)",
        }}
      >
        <div className="logo d-flex align-items-center justify-content-start">
          <a className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img
                src={require("assets/img/bg/horide2.png").default}
                style={{
                  maxWidth: "80%",
                  maxHeight: "50%",
                  margin: "18px 10px",
                  opacity: 0.8,
                }}
              />
              <p
                style={{
                  width: "100%",
                  margin: "16px 0px 0px 14px",
                  textAlign: "initial",
                }}
              >
                {" "}
                {userDetaile}{" "}
              </p>
            </div>
          </a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (
              prop.layout === path ||
              prop.layout === path2 ||
              prop.layout === path3 ||
              prop.layout === path4 ||
              prop.layout == path6 ||
              prop.layout == path7 ||
              prop.layout == path8
            ) {
              if (prop.path != path5 && prop.class != undefined) {
                return (
                  <li
                    className={
                      prop.upgrade
                        ? "active active-pro"
                        : activeRoute(prop.layout + prop.path)
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      {icon(prop.class)}
                      <p style={{ fontSize: "11px" }}>{translate(prop.name)}</p>
                    </NavLink>
                  </li>
                );
              } else if (prop.path != path5) {
                return (
                  <li
                    className={
                      prop.upgrade
                        ? "active active-pro"
                        : activeRoute(prop.layout + prop.path)
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.layout + prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />

                      <p style={{ fontSize: "11px" }}>{translate(prop.name)}</p>
                    </NavLink>
                  </li>
                );
              }
            }
            return null;
          })}
        </Nav>

        <center>
          <img
            src={require("assets/img/logo-nttdata.png").default}
            style={{
              width: "45%",
              marginTop: "10%",
              marginBottom: "30%",
              opacity: 0.5,
              position: "absolute",
              //bottom: "6%",
              left: "25%",
            }}
          />
        </center>
      </div>
    </div>
  );
}

export default Sidebar;
