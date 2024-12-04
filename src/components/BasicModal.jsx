import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";
import RequestList from "./HistoriqueRequests/RequestList";
import PaidRequestService from "servicees/PaidRequestService";
import UnitService from "servicees/UnitService";
import { FaUser } from "react-icons/fa";
import BalanceActionService from "servicees/BalanceActionService";
import SelectHistorique from "../components/HistoriqueRequests/SelectHistorique";
import { memo } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflowY: "scroll",
  height: "90vh",
  scrollbarWidth: "thin",

  "&::-webkit-scrollbar": {
    width: "12px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#223881",
  },
};

const BasicModal = (props) => {
  //console.log(props.employee);
  const [requestList, setRequestList] = React.useState([]);
  let [year, setYear] = React.useState("");
  React.useEffect(() => {
    BalanceActionService.getBalanceActionOfUser(props.employee.id).then(
      (req) => {
        console.log(req.data);
        const arr = req.data.sort(function (a, b) {
          return new Date(b.actionDate) - new Date(a.actionDate);
        });

        setRequestList(arr);
      }
    );
  }, [props.employee.id]);
  const iconStyle = {
    fontSize: "60px",
    margin: "15px",
    paddingBottom: "3px",
  };

  const selectedRequestDate = (y) => {
    setYear(y);
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            align="center"
            id="modal-modal-title"
            variant="h4"
            component="h2"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "90%",
                margin: "0 auto",
              }}
            >
              <FaUser style={iconStyle} />
              <section>
                <h5 style={{ margin: "0", textAlign: "left" }}>
                  {props.employee && props.employee.cin}{" "}
                </h5>
                <h2 style={{ margin: "0", padding: "0" }}>
                  {props.employee && props.employee.firstname}{" "}
                  {props.employee && props.employee.lastname}
                </h2>
              </section>
              <SelectHistorique selectedRequestDate={selectedRequestDate} />
            </div>
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.employee && props.employee.id}
          </Typography> */}

          <RequestList requests={requestList} year={year} />

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={2}
          >
            <Button
              variant="outlined"
              display="flex"
              justifyContent="flex-end"
              alignItem=""
              onClick={props.handleClose}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};
export default memo(BasicModal);
