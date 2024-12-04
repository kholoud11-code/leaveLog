import React, { Component, useEffect } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js";
import Addholiday from "com/add/addHoliday";

const Admin = () => {
  const [image, setImage] = React.useState("");
  const [color, setColor] = React.useState("");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (
        sessionStorage.getItem("role") === "RH" ||
        sessionStorage.getItem("role") === "RH grp"
      ) {
        if (
          prop.layout === "/admin" ||
          prop.layout === "/admin/holiday" ||
          prop.layout === "/admin/list" ||
          prop.layout === "/admin/unit" ||
          prop.layout === "/admin/password" ||
          prop.layout === "/admin/units" ||
          prop.layout === "/admin/vacationrequest" ||
          prop.layout === "/admin/validator" ||
          prop.layout === "/admin/type" ||
          prop.layout === "/admin/collaborator" ||
          prop.layout === "/admin/validatorOfTeam" ||
          prop.layout === "/admin/Dashboard"
        ) {
          if (
            ((JSON.parse(sessionStorage.getItem("firstname")) === "Fred" &&
              JSON.parse(sessionStorage.getItem("lastname")) === "Sabbah") ||
              (JSON.parse(sessionStorage.getItem("firstname")) === "Mateo" &&
                JSON.parse(sessionStorage.getItem("lastname")) ===
                  "Garcia Borrero")) &&
            prop.layout === "/admin/collaborator"
          ) {
            return null;
          } else {
            return (
              <Route
                path={prop.layout + prop.path}
                render={(props) => <prop.component {...props} />}
                key={key}
              />
            );
          }
        }
      } else if (sessionStorage.getItem("role") === "Collaborator") {
        if (
          prop.layout === "/admin" ||
          prop.layout === "/admin/holiday" ||
          prop.layout === "/admin/password" ||
          prop.layout === "/admin/vacationrequest" ||
          prop.layout === "/admin/collaborator"
        ) {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          );
        }
      } else if (sessionStorage.getItem("role") === "Directeur") {
        if (
          prop.layout === "/admin" ||
          prop.layout === "/admin/holiday" ||
          prop.layout === "/admin/password" ||
          prop.layout === "/admin/validator"
        ) {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          );
        }
      } else if (sessionStorage.getItem("role") === "validator") {
        if (
          prop.layout === "/admin" ||
          prop.layout === "/admin/holiday" ||
          prop.layout === "/admin/list" ||
          prop.layout === "/admin/unit" ||
          prop.layout === "/admin/password" ||
          prop.layout === "/admin/validator" ||
          prop.layout === "/admin/vacationrequest" ||
          prop.layout === "/admin/collaborator" ||
          prop.layout === "/admin/units"
        ) {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => <prop.component {...props} />}
              key={key}
            />
          );
        } else {
          return null;
        }
      } else {
        if (
          prop.layout === "/admin" ||
          prop.layout === "/admin/holiday" ||
          prop.layout === "/admin/list" ||
          prop.layout === "/admin/unit" ||
          prop.layout === "/admin/password" ||
          prop.layout === "/admin/units" ||
          prop.layout === "/admin/vacationrequest" ||
          prop.layout === "/admin/validator" ||
          prop.layout === "/admin/type" ||
          prop.layout === "/admin/collaborator" ||
          prop.layout === "/admin/validatorOfTeam" ||
          prop.layout === "/admin/Dashboard"
        ) {
          return (
            <Route
              path={prop.layout + prop.path}
              render={(props) => (
                <Redirect
                  to={{ pathname: "/", state: { from: props.location } }}
                />
              )}
            />
          );
        }
      }
    });
  };

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);

  const getSidebar = () => {
    if (
      sessionStorage.getItem("role") === "RH" ||
      sessionStorage.getItem("role") === "RH grp"
    ) {
      if (
        (JSON.parse(sessionStorage.getItem("firstname")) === "Fred" &&
          JSON.parse(sessionStorage.getItem("lastname")) === "Sabbah") ||
        (JSON.parse(sessionStorage.getItem("firstname")) === "Mateo" &&
          JSON.parse(sessionStorage.getItem("lastname")) === "Garcia Borrero")
      ) {
        return (
          <Sidebar
            color={color}
            image={hasImage ? image : ""}
            routes={routes}
            path="/admin"
            path2="/admin/list"
            path3="/admin/units"
            path4="/admin/validator"
            /*path6= "/admin/collaborator"*/ path7="/admin/validatorOfTeam"
            path8="/admin/Dashboard"
          />
        );
      } else {
        return (
          <Sidebar
            color={color}
            image={hasImage ? image : ""}
            routes={routes}
            path="/admin"
            path2="/admin/list"
            path3="/admin/units"
            path4="/admin/validator"
            path6="/admin/collaborator"
            path7="/admin/validatorOfTeam"
            path8="/admin/Dashboard"
          />
        );
      }
    } else if (sessionStorage.getItem("role") === "Directeur") {
      return (
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={routes}
          path="/admin"
          path2="/admin/validator"
          path5="/vacationrequests"
        />
      );
    } else if (sessionStorage.getItem("role") === "Collaborator") {
      return (
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={routes}
          path="/admin"
          path3="/admin/collaborator"
        />
      );
    } else if (sessionStorage.getItem("role") === "validator") {
      return (
        <Sidebar
          color={color}
          image={hasImage ? image : ""}
          routes={routes}
          path="/admin"
          path2="/admin/validator"
          path3="/admin/collaborator"
          path4="/admin/units"
        />
      );
    }
  };
  return (
    <>
      <div className="wrapper">
        {getSidebar()}
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Switch>
              {getRoutes(routes)}
              <Route path="/holiday/add">
                <Addholiday />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
