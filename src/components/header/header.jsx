import React from "react";
import { Component } from "react";
import { Nav, Navbar, Form, FormControl, Button, NavDropdown } from 'react-bootstrap'
import { BsBellFill } from "react-icons/bs"
import { IoLanguageSharp } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import { MDBCol, MDBFormInline, MDBIcon } from "mdbreact";
import "./header.css";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { red } from "@material-ui/core/colors";

class Header extends Component{
    render() {
        return (
            <div className="header">
                <Navbar bg="light" className="box_head" expand="lg">
                      <div className="logo-img">
                           <img
                           src={require("assets/img/everis.svg").default}
                           alt="..."
                          style={{maxWidth:100+"px",maxHeight:88+"px"}}
                          />
                     </div>
                    <Navbar.Brand href="/admin/home" className="brand_head">EverHoliday</Navbar.Brand>
                    <MDBCol md="6" className="center_search">
                        <MDBFormInline className="md-form ">
                            <input className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search" aria-label="Search" />
                        </MDBFormInline>
                    </MDBCol>
                    
                    <div >
                         <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">   
                        <Nav className="mr-auto right_side_head">
                            <Nav.Link href="#home" > <BsBellFill className="icon"/></Nav.Link>
                             <Nav.Link href="#home"><IoLanguageSharp className="icon"/></Nav.Link>
                            <Nav.Link href="#home"><FaUser className="icon"/></Nav.Link>
                        </Nav>
                    </Navbar.Collapse> 
                    </div>
                    
                </Navbar>
            </div>
        )
    }
        
}
export default Header;