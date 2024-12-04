import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { makeStyles } from "@material-ui/core/styles";

export default function DatePickerOpenTo(props) {
  const useStyles = makeStyles({
    root: {
      "& .MuiInputLabel-root": {
        margin: "0px",
      },
    },
  });
  const [selectDate, setSelecteDate] = React.useState(null);

  const classes = useStyles();
  const handleDateChange = (date) => {
    props.selectedRequestDate(date.$y);
  };

  // useEffect(() => {
  //   if (selectedDate) {
  //     const currentDate = new Date();
  //     if (selectedDate > currentDate) {
  //     }
  //   }
  // }, [selectedDate]);

  // return (
  //   <div style={{ marginLeft: "auto", width: "300px" }}>
  //     <LocalizationProvider dateAdapter={AdapterDayjs}>
  //       <MuiDatePicker
  //         value={selectedDate}
  //         onChange={handleDateChange}
  //         renderInput={(params) => <TextField {...params} />}
  //       />
  //     </LocalizationProvider>
  //   </div>
  // );

  return (
    <div style={{ marginLeft: "auto", width: "300px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            className={classes.root}
            value={selectDate}
            onChange={handleDateChange}
            label={'"year"'}
            openTo="year"
            views={["year"]}
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}
