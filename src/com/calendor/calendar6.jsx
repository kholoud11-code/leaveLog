import React, { useState, Component } from "react";
import { Datepicker, START_DATE } from "@datepicker-react/styled";
import { ThemeProvider } from "styled-components";
import HolidayService from "../../servicees/HolidayService";
import dateFormat from "dateformat";
import {
  dayLabelFormat as dayLabelFormatFn,
  weekdayLabelFormat as weekdayLabelFormatFn,
  monthLabelFormat as monthLabelFormatFn,
} from "@datepicker-react/hooks";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/es";

// Define custom phrases for English, French, and Spanish
const phrases = {
  en: {
    datepickerStartDatePlaceholder: "Select",
    datepickerStartDateLabel: "Start Date",
    datepickerEndDatePlaceholder: "Select",
    datepickerEndDateLabel: "End Date",
    resetDates: "Reset Dates",
    close: "Close",
    startDateAriaLabel: "Start Date",
    endDateAriaLabel: "End Date",
    startDatePlaceholder: "Start Date",
    endDatePlaceholder: "End Date",
  },
  fr: {
    datepickerStartDatePlaceholder: "Sélectionner",
    datepickerStartDateLabel: "Date de début",
    datepickerEndDatePlaceholder: "Sélectionner",
    datepickerEndDateLabel: "Date de fin",
    resetDates: "Réinitialiser les dates",
    close: "Fermer",
    startDateAriaLabel: "Date de début",
    endDateAriaLabel: "Date de fin",
    startDatePlaceholder: "Date de début",
    endDatePlaceholder: "Date de fin",
  },
  es: {
    datepickerStartDatePlaceholder: "Seleccionar",
    datepickerStartDateLabel: "Fecha de inicio",
    datepickerEndDatePlaceholder: "Seleccionar",
    datepickerEndDateLabel: "Fecha de fin",
    resetDates: "Restablecer fechas",
    close: "Cerrar",
    startDateAriaLabel: "Fecha de inicio",
    endDateAriaLabel: "Fecha de fin",
    startDatePlaceholder: "Fecha de inicio",
    endDatePlaceholder: "Fecha de fin",
  },
};

let locale = "";

switch (sessionStorage.getItem("lang")) {
  case "Fr":
    locale = "fr";
    moment.locale("fr");
    break;

  case "Sp":
    locale = "es";
    moment.locale("es");
    break;

  default:
    locale = "en";
    moment.locale("en");
    break;
}

class calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // step 2
      startDate: null,
      endDate: null,
      focusedInput: START_DATE,
      holidays: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDatesChange = this.handleDatesChange.bind(this);
    this.blockedDate = this.blockedDate.bind(this);
  }

  handleDatesChange(data) {
    if (!data.focusedInput) {
      this.setState({ ...data, focusedInput: START_DATE });
    } else {
      this.setState(data);
    }
  }
  componentDidMount() {
    HolidayService.getHoliday().then((res) => {
      this.setState({ holidays: res.data });
    });
  }

  handleChange(value, e) {
    console.log(value + "hi"); // this will be a moment date object
    console.log(e.target.value); // this will be a string value in datepicker input field
  }
  blockedDate(date) {
    var show = false;

    if (date.getDay() == 6 || date.getDay() == 0) {
      show = true;
    }
    return show;
  }

  addDaysToDate(date, days) {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

  holidayslists() {
    const list = [];
    this.state.holidays.map((holiday) => {
      var date = new Date(holiday.date);
      list.push(date);
    });
    return list;
  }

  holidays(date, holids) {
    var x = "";
    var bool = false;

    holids.map((holiday) => {
      for (var i = 0; i < holiday.duration; i++) {
        var a = new Date(holiday.date);
        //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
        var c = dateFormat(a.setDate(a.getDate() + i), "yyyy-mm-dd");
        if (dateFormat(date, "yyyy-mm-dd") == c) {
          x = (
            <div
              style={{
                backgroundColor: "#FF7F50",
                color: "white",
                height: "100%",
                paddingTop: "3px",
              }}
            >
              {dayLabelFormatFn(date)}
            </div>
          );
          bool = true;
        }
        if (date.getDay() == 6 || date.getDay() == 0) {
          x = (
            <div
              style={{
                backgroundColor: "#D3D3D355",
                height: "100%",
                paddingTop: "3px",
              }}
            >
              {dayLabelFormatFn(date)}
            </div>
          );
          bool = true;
        } else if (!bool) {
          x = <div>{dayLabelFormatFn(date)}</div>;
        }
      }
    });

    return x;
  }

  render() {
    let bokkedDay = new Date();
    bokkedDay.setDate(bokkedDay.getDate());

    return (
      <ThemeProvider
        theme={{
          breakpoints: ["32em", "48em", "64em"],
          reactDatepicker: {
            daySize: [32, 32],
          },
        }}
      >
        <Datepicker
          onDatesChange={this.handleDatesChange}
          onChange={this.handleChange}
          startDate={this.state.startDate} // Date or null
          endDate={this.state.endDate} // Date or null
          focusedInput={this.state.focusedInput} // START_DATE, END_DATE or null
          showClose={false}
          //minBookingDate={bokkedDay}
          minBookingDate={
            sessionStorage.getItem("role") != "RH" ? bokkedDay : null
          }
          style={{ padding: "0px" }}
          onDayRender={(date) => this.holidays(date, this.state.holidays)}
          phrases={phrases[locale]}
          dayLabelFormat={(date) => moment(date).format("DD")}
          weekdayLabelFormat={(date) => moment(date).format("dd")}
          monthLabelFormat={(date) => moment(date).format("MMMM YYYY")}
        />
      </ThemeProvider>
    );
  }
}
export default calendar;
