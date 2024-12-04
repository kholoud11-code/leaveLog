import React, { useEffect, useState } from "react";
import {
  GridToolbarContainer,
  GridToolbar,
  gridVisibleSortedRowIdsSelector,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { RiDownload2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import translate from "../../i18nProvider/translate";
import CollaborateurServices from "../../servicees/CollaborateurServices";

const englishColumn = [
  "Month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Unit",
  "Balance",
  "Employee Id",
  "Last Name",
  "First Name",
  "Indicator 1",
  "Indicator 2",
];
const frenchColumn = [
  "Mois",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Unité",
  "Solde",
  "Id d'Employé",
  "Nom",
  "Prénom",
  "Indicateur 1",
  "Indicateur 2",
];
const spanishColumn = [
  "Mes",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
  "Unidad",
  "Saldo",
  "Id Empleado",
  "Apellidos",
  "Nombre",
  "Indicador 1",
  "Indicador 2",
];
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

const ExcelExport2 = () => {
  const [indicatorsTimeMonthAndYear, setIndicatorsTimeMonthAndYear] = useState(
    {}
  );
  const [currentDateMonthValue, setCurrentDateMonthValue] = useState(0);
  const [firstNextMonthValue, setFirstNextMonthValue] = useState(0);
  const [secondNextMonthValue, setSecondNextMonthValue] = useState(0);
  const [currentPendingToBeExpended, setCurrentPendingToBeExpended] =
    useState("");
  const [currentAccumulatedExpended, setCurrentAccumulatedExpended] =
    useState("");
  const [
    firstNextMonthAccumulatedExpended,
    setFirstNextMonthAccumulatedExpended,
  ] = useState("");
  const [
    secondNextMonthAccumulatedExpended,
    setSecondNextMonthAccumulatedExpended,
  ] = useState("");

  useEffect(() => {
    CollaborateurServices.getIndicatorsTimeMonthAndYear().then((res) => {
      setIndicatorsTimeMonthAndYear(res.data);
      setCurrentDateMonthValue(res.data.currentDateMonthValue);
      setFirstNextMonthValue(res.data.firstNextMonthValue);
      setSecondNextMonthValue(res.data.secondNextMonthValue);
      setCurrentPendingToBeExpended(res.data.currentPendingToBeExpended);
      setCurrentAccumulatedExpended(res.data.currentAccumulatedExpended);
      setFirstNextMonthAccumulatedExpended(
        res.data.firstNextMonthAccumulatedExpended
      );
      setSecondNextMonthAccumulatedExpended(
        res.data.secondNextMonthAccumulatedExpended
      );
    });
  }, []);

  const apiRef = useGridApiContext();
  const getFilteredRows = ({ apiRef }) =>
    gridVisibleSortedRowIdsSelector(apiRef);
  let getDateToday = () => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return `${year}_${month}_${day}`;
  };

  //treatment of spent vacation in current year
  let getcurrentyear = () => {
    var current_date = new Date();
    return current_date.getFullYear();
  };

  const myfiltredRows = (a) => {
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let url = window.location.href.split("/");
    const userDetaile =
      JSON.parse(sessionStorage.getItem("firstname")) +
      "_" +
      JSON.parse(sessionStorage.getItem("lastname"));
    let fileName =
      "Horidē_" +
      userDetaile +
      "_" +
      url[url.length - 1] +
      "_" +
      getDateToday();

    const excelExport = (a, fileName) => {
      const ws = XLSX.utils.json_to_sheet(a);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    };

    let data = filteredSortedRowIds.map((id) => {
      const row = {};
      visibleColumnsField.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).value;
      });
      return row;
    });
    let username =
      JSON.parse(sessionStorage.getItem("firstname")) +
      " " +
      JSON.parse(sessionStorage.getItem("lastname"));
    let newData = [];
    data.map((obj) => {
      delete obj.__check__, delete obj.action;
      let myNewObj = {};
      if (url[url.length - 1] == "Dashboard") {
        myNewObj = {
          "Employee Id": obj.cin,
          "Last Name": obj.lastname,
          "First Name": obj.firstname,
          Unit: obj.NameUnit,
          "Remaining Balance": obj.remainingBalance,
          [englishColumn[18] +
          " " +
          englishColumn[currentDateMonthValue] +
          " " +
          currentPendingToBeExpended]: obj.firstIndicator,
          [englishColumn[19] +
          " " +
          englishColumn[currentDateMonthValue] +
          " " +
          currentAccumulatedExpended]: obj.secondIndicatorFirstNextMonth,
          [englishColumn[19] +
          " " +
          englishColumn[firstNextMonthValue] +
          " " +
          firstNextMonthAccumulatedExpended]:
            obj.secondIndicatorSecondNextMonth,
          [englishColumn[19] +
          " " +
          englishColumn[secondNextMonthValue] +
          " " +
          secondNextMonthAccumulatedExpended]:
            obj.secondIndicatorThirdNextMonth,
        };
      } else if (url[url.length - 1] == "solde") {
        myNewObj = {
          "Employee Id": obj.cin,
          "First Name": obj.firstname,
          "Last Name": obj.lastname,
          "Contract Balance": obj.contractBalance,
          ["Balance" + ` ${getcurrentyear()}`]: obj.annualBalance,
          ["Balance" + ` ${getcurrentyear() - 1}`]: obj.cumulativeBances,
          "Remaining Balance": obj.Rimmmingbalanc,
          "Balance of pending requests": obj.Panding,
          ["Spent Vacation" + ` ${getcurrentyear()}`]: obj.SpentVacation,
          Validator: obj.validator,
          Unit: obj.NameUnit,
        };
      } else if (url[url.length - 1] == "MyRequest") {
        myNewObj = {
          "Request Date": obj.requestDate,
          Collaborator:
            url[url.length - 1] == "MyRequest" ? username : obj.collaborator,
          Type: obj.nameReq,
          Statut: obj.statut,
          "Type of time": obj.typeOfTime,
          "Start Date": obj.startDate[0],
          "End Date": obj.endDate[0],
          Duration: obj.duration[0],
          ...(obj.fridaysCount !== undefined && obj.fridaysCount !== null
            ? { "Fridays Count (d)": obj.fridaysCount }
            : {}),
          ...(obj.durationCurrentMonth !== undefined &&
          obj.durationCurrentMonth !== null
            ? { "Current Month (h)": obj.durationCurrentMonth }
            : {}),
          ...(obj.durationNextMonth !== undefined &&
          obj.durationNextMonth !== null
            ? { "Next Month (h)": obj.durationNextMonth }
            : {}),
          ...(obj.summertime !== undefined && obj.summertime !== null
            ? { "Summer Time": obj.summertime }
            : {}),
        };
      } else {
        myNewObj = {
          "Employee Id": obj.cin,
          Collaborator:
            url[url.length - 1] == "MyRequest" ? username : obj.collaborator,
          Type: obj.nameReq,
          Statut: obj.statut,
          "Type of time": obj.typeOfTime,
          "Start Date": obj.startDate[0],
          "End Date": obj.endDate[0],
          Duration: obj.duration[0],
          ...(obj.fridaysCount !== undefined && obj.fridaysCount !== null
            ? { "Fridays Count (d)": obj.fridaysCount }
            : {}),
          ...(obj.durationCurrentMonth !== undefined &&
          obj.durationCurrentMonth !== null
            ? { "Current Month (h)": obj.durationCurrentMonth }
            : {}),
          ...(obj.durationNextMonth !== undefined &&
          obj.durationNextMonth !== null
            ? { "Next Month (h)": obj.durationNextMonth }
            : {}),
          ...(obj.summertime !== undefined && obj.summertime !== null
            ? { "Summer Time": obj.summertime }
            : {}),
          Validator: obj.validator,
          Unit: obj.NameUnit,
        };
      }
      //let myNewObj = {'collaborator':(url[url.length-1]=="MyRequest" ? username : obj.collaborator),'nameReq':obj.nameReq,'statut':obj.statut,'typeOfTime':obj.typeOfTime,'startDate':obj.startDate[0],'endDate':obj.endDate[0],'duration':obj.duration[0]}
      newData.push(myNewObj);
    });
    excelExport(newData, fileName);
  };

  return (
    <GridToolbarContainer>
      <GridToolbar />
      <Button
        style={{
          border: "medium none",
          color: "rgb(5, 104, 203)",
          fontWeight: 450,
          textTransform: "uppercase",
          fontSize: "13px",
          marginTop: "4px",
          padding: 0,
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 500,
        }}
        onClick={() => myfiltredRows(getFilteredRows)}
      >
        <RiDownload2Line
          style={{
            marginRight: "10px",
            fontSize: "17px",
            fontWeight: "bold",
            marginBottom: "2px",
          }}
        />
        {translate("Excel Export")}{" "}
      </Button>
    </GridToolbarContainer>
  );
};
export default ExcelExport2;
