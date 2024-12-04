import React, { useEffect, useState } from "react";
import RequestItem from "./RequestItem";
import "./RequestList.css";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { memo } from "react";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const RequestList = (props) => {
  //console.log(props.year);

  const [reque, setReque] = useState([]);
  //const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let requestByDate = [];
    props.requests.forEach((item) => {
      let dateAndTime = moment(item.actionDate + " " + item.dateTime);
      console.log(dateAndTime.format("YYYY"));
      if (dateAndTime.year() == props.year) {
        requestByDate = [
          ...requestByDate,
          { ...item, dateAndTime: dateAndTime.format() },
        ];
      }
    });
    console.log(requestByDate);
    requestByDate.sort((a, b) =>
      moment(b.dateAndTime).diff(moment(a.dateAndTime))
    );
    setReque(requestByDate);
    console.log(props.year);
  }, [props.year]);
  useEffect(() => {
    console.log(reque);
    const requestByDate = props.requests.map((item) => {
      console.log(item);
      let dateAndTime = moment(item.actionDate + " " + item.dateTime);
      console.log({ ...item, dateAndTime: dateAndTime.format() });
      return { ...item, dateAndTime: dateAndTime.format() };
    });
    console.log(requestByDate);
    requestByDate.sort((a, b) =>
      moment(b.dateAndTime).diff(moment(a.dateAndTime))
    );
    setReque(requestByDate);
  }, [props.requests]);
  console.log(reque);
  // if (isLoading) {
  //   return (
  //     <Box sx={{ display: "flex" }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }
  if (reque.length == 0) {
    return (
      <div className="hero">
        <Alert severity="info" fontSize="large">
          <AlertTitle>
            <span className="notfound">There Are No Request Found</span>
          </AlertTitle>
        </Alert>
      </div>
    );
  }
  return (
    <div className="containerr">
      {reque.map((item) => {
        return <RequestItem key={item.id} request={item} />;
      })}
    </div>
  );
};
export default RequestList;
