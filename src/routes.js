import listCollaborator from "com/list/listCollaborator";
import addCollaborator from "com/add/addCollaborator";
import calendar from "com/calendor/calendor";
import Profile from "./com/userprofile";
import Addholiday from "./com/add/addHoliday";
import Holidaylist from "./com/list/holidaylist";
import UnitList from "./com/list/UnitList";
import myRequest from "./com/list/myRequest";
//import myRequest from './com/vacationrequest/alt';
import userprofile from "./com/userprofile";
import Request from "./com/list/Request";
import addUnit from "./com/add/addUnit";
import changePassword from "./com/add/changePassword";
import Vacationrequest from "com/vacationrequest/Vacationrequest";
import CollaboratorSolde from "./com/list/CollaboratorSolde";
import PaidVacation from "com/vacationrequest/PaidVacation";
import RecoveryVacation from "com/vacationrequest/RecoveryVacation";
import ExceptionVacation from "com/vacationrequest/ExceptionalVacation";
import UnpaidVacation from "com/vacationrequest/UnpaidVacation";
import Historic from "com/vacationrequest/HistoricVacation";
import TypeOfVacation from "com/list/TypeOfVacacionList";
import AddType from "com/add/addType";
import translate from "./i18nProvider/translate";
import RequestOfTeam from "./com/list/RequestOfTeam";
import DashBoard from "com/DashBoard/DashBoard";
const dashboardRoutes = [
  {
    path: "/Home",
    class: "IoIosHome",
    name: "Home",
    nametranslate: translate("Home"),
    component: calendar,
    layout: "/admin",
  } /*{
    path: "/calendar",
    name: "calendar",
    icon: "nc-icon nc-chart-pie-35",
    component: calendar,
    layout: "/admin",
  },*/,
  {
    path: "",
    class: "BarChart",
    name: "Dashboard",
    nametranslate: translate("Dashboard"),
    component: DashBoard,
    layout: "/admin/Dashboard",
  },
  {
    path: "/Request",
    name: "REQUEST",
    nametranslate: translate("REQUEST"),
    //name:translate('REQUEST'),
    class: "FaHourglassEnd",
    component: Request,
    layout: "/admin/validator",
  },
  {
    path: "/RequestOfTeam",
    name: "REQUEST OF TEAM",
    nametranslate: translate("REQUEST OF TEAM"),
    //name:translate('REQUEST'),
    class: "FaHourglassEnd",
    component: RequestOfTeam,
    layout: "/admin/validatorOfTeam",
  },
  {
    path: "/MyRequest",
    name: "MY REQUEST",
    nametranslate: translate("MY REQUEST"),
    class: "IoIosPaper",
    component: myRequest,
    layout: "/admin/collaborator",
  },
  {
    path: "/user",
    name: "User Profile",
    nametranslate: translate("User Profile"),
    icon: "nc-icon nc-circle-09",
    component: userprofile,
    layout: "/admin/password",
  },

  {
    path: "/collaborator",
    name: "List Users",
    nametranslate: translate("List Users"),
    class: "IoIosPeople",
    component: listCollaborator,
    layout: "/admin/list",
  },
  {
    path: "/add-user/:id",
    name: "Add employees",
    nametranslate: translate("Add employees"),
    class: "IoIosPersonAdd",
    component: addCollaborator,
    layout: "/admin/list",
  },
  {
    path: "/holidays",
    name: "Holidays",
    nametranslate: translate("Holidays"),
    class: "IoCalendar",
    component: Holidaylist,
    layout: "/admin",
  },
  {
    path: "/:id",
    name: "add holiday",
    nametranslate: translate("add holiday"),
    component: Addholiday,
    layout: "/admin/holiday",
  },
  {
    path: "/list",
    name: "Organizational Unit",
    nametranslate: translate("Organizational Unit"),
    class: "unit",
    component: UnitList,
    layout: "/admin/units",
  },
  {
    path: "/:id",
    name: "Unit",
    nametranslate: translate("Unit"),
    component: addUnit,
    layout: "/admin/unit",
  },
  {
    path: "/change",
    name: "Change password",
    nametranslate: translate("Change password"),
    component: changePassword,
    layout: "/admin/password",
  },
  {
    path: "/solde",
    name: "Collaborator balance",
    nametranslate: translate("Collaborator balance"),
    class: "MdAccountBalanceWallet",
    component: CollaboratorSolde,
    layout: "/admin/validator",
  },
  {
    path: "/vacationrequests",
    name: "Vacation Request",
    class: "FiSend",
    component: Vacationrequest,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/paid",
    name: "Vacation Request",
    component: PaidVacation,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/unpaid",
    name: "Vacation Request",
    component: UnpaidVacation,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/exceptional",
    name: "Vacation Request",
    component: ExceptionVacation,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/recovery",
    name: "RecoveryVacation",
    component: RecoveryVacation,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/History",
    name: "Historic",
    component: Historic,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/Type",
    name: "Type of vacation",
    nametranslate: translate("Type of vacation"),
    icon: "nc-icon nc-send",
    component: TypeOfVacation,
    layout: "/admin/vacationrequest",
  },
  {
    path: "/:id",
    name: "Type Of Vacation",
    nametranslate: translate("Type of vacation"),
    component: AddType,
    layout: "/admin/type",
  },
];

export default dashboardRoutes;
