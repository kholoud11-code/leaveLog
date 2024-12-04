import React, { useRef, useState } from "react";
import IdleTimer from "react-idle-timer";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { reactLocalStorage } from "reactjs-localstorage";

const englishColumn = ["Your session will expire in twelve seconds"];
const frenchColumn = ["Votre session expirera dans douze secondes"];
const spanishColumn = ["Su sesión caducará en doce segundos"];
let DatagridColumn = [];

switch (sessionStorage.getItem("lang")) {
  case "Fr":
    DatagridColumn = frenchColumn;
    break;

  case "Sp":
    DatagridColumn = spanishColumn;
    break;

  default:
    DatagridColumn = englishColumn;
    break;
}

function IdleTimerContainer() {
  let history = useHistory();
  const idleTimerRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  const logOut = () => {
    clearTimeout(sessionTimeoutRef.current);
    reactLocalStorage.remove(
      "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
    );
    reactLocalStorage.remove(
      "UnpaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
    );
    sessionStorage.clear();
    history.push("/");
  };

  const onIdle = () => {
    Swal.fire({
      title: "Ooops",
      text: DatagridColumn[0],
      icon: "info",
      timer: 10000,
    }).then((result) => {
      if (!result.isConfirmed) {
        sessionTimeoutRef.current = setTimeout(() => logOut(), 2000);
      }
    });
  };
  return (
    <React.Fragment>
      <IdleTimer
        ref={idleTimerRef}
        timeout={1000 * 60 * 60 * 8}
        onIdle={onIdle}
      >
        {" "}
      </IdleTimer>
    </React.Fragment>
  );
}
export default IdleTimerContainer;
