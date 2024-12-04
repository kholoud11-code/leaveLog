import React from "react";
import '../css/list.css';
import translate from "../../i18nProvider/translate"
import { Button, Modal, CardGroup, Card } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#5876AA',//theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 17,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

//add years function 
const addYears = (date,years) => {
  date.setFullYear(date.getFullYear() + years);
  return date;
}

//console.info(props.collabdata)

const DetailSoldeModal = (props) => {
  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton style={{ paddingTop: '10px' }}></Modal.Header>
        <Modal.Body style={{ padding: '10px' }}>
          <Tabs
            defaultActiveKey="Solde"
            transition={false}
            id="noanim-tab-example"
            className="mb-3"
          >
            <Tab eventKey="Solde" title={<span style={{ fontWeight: 'bold' }}>{translate("Balance")}</span>}>
              <Card bg={'light'} style={{ marginBottom: '10px' }}>
                <Card.Header style={{ background: '#e9ecef', padding: '5px 0 5px 10px' }}><span style={{ fontWeight: "bold", textAlign: "center", color: 'rgb(49, 116, 173)' }}>{translate("Cumulative Balance")}</span>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>

                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">{translate("Year")}</StyledTableCell>
                          <StyledTableCell align="center">{translate("Balance")}</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          props.collabdata.solde.cumulativeBances.map(cumulativebance => (
                            <StyledTableRow key={cumulativebance.id}>
                              {cumulativebance.balance != 0 ? <React.Fragment><StyledTableCell align="center" style={{ color: 'rgb(49, 116, 173)', fontWeight: "bold", fontSize: "18px" }}>{cumulativebance.year}</StyledTableCell><StyledTableCell align="center" style={{ color: 'rgb(49, 116, 173)', fontWeight: "bold", fontSize: "18px" }}>{cumulativebance.balance}</StyledTableCell></React.Fragment> : null}
                            </StyledTableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Card.Body>
              </Card>

              <Card bg={'light'} style={{ marginBottom: 0 }}>
                <Card.Header style={{ background: '#e9ecef', padding: '5px 0 5px 10px' }}>
                  <span style={{ fontWeight: "bold", textAlign: "center", color: 'rgb(49, 116, 173)' }}>{translate("Annual Balance")}</span>
                </Card.Header>
                <Card.Body style={{ padding: 0 }}>

                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">{translate("Year")}</StyledTableCell>
                          <StyledTableCell align="center">{translate("Balance")}</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                            <StyledTableRow>
                              <StyledTableCell align="center" style={{ color: 'rgb(49, 116, 173)', fontWeight: "bold", fontSize: "18px" }}>{new Date().getFullYear()/*addYears(new Date(),1).getFullYear()*/}</StyledTableCell>
                              <StyledTableCell align="center" style={{ color: 'rgb(49, 116, 173)', fontWeight: "bold", fontSize: "18px" }}>{props.collabdata.solde.annualBalance}</StyledTableCell>
                            </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="Other informations" title={<span style={{ fontWeight: 'bold' }}>{translate("Other informations")}</span>} >
              <div className='boxview2'>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("username")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.username}</span></p>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("Full Name")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.firstname + " " + props.collabdata.lastname}</span></p>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("Employee Nr")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.cin}</span></p>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("Email")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.email}</span></p>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("country work")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.country}</span></p>
                <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("address")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.collabdata.adresse}</span></p>
                {props.path === "home" ? <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("Project Name")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.unitname}</span></p> : null}
                {props.path === "listcollaborator" ? <p><span style={{ fontSize: "17px", fontWeight: 'bold' }}>{translate("Project Name")} : </span> <span style={{ fontSize: "17px", color: '#5876AA', fontWeight: 'bold' }}>{props.unitname}</span></p> : null}
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default DetailSoldeModal;