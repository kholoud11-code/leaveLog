import React, { Component,useState ,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button ,ButtonGroup,Tooltip,OverlayTrigger} from "react-bootstrap";
import 'components/Navbars/navbar.css'
import routes from "routes.js";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate"
import { BsBellFill } from "react-icons/bs"
import { IoLanguageSharp } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import Badge from '@mui/material/Badge';
import {Link, useHistory} from 'react-router-dom'
import en from '../../assets/flags/en.png'
import es from '../../assets/flags/es.png'
import fr from '../../assets/flags/fr.png'
import UserAvatar from './UserAvatar'
import IdleTimerContainer from '../../layouts/sessionTimeOut'
import {reactLocalStorage} from 'reactjs-localstorage';

function Header(props) {

  useEffect(()=>{
    setTimeout(()=>{
       setBadgeValue(parseInt(sessionStorage.getItem("TotalRequest")))
    },5000)
  })

  let totalerequest ;
  if (sessionStorage.getItem("TotalRequest") === null){
    totalerequest=0
  }else{
    totalerequest = parseInt(sessionStorage.getItem("TotalRequest"))
  }
  
  const [badgeValue, setBadgeValue] = useState(totalerequest);
  const histroy = useHistory();

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
       {/*You have {badgeValue} new Request(s) <Link to="/admin/validator/Request">Click here to show them</Link>*/}
       {translate('You have')} {badgeValue} {translate('new Request(s)')} <Link to="/admin/validator/Request">{translate('Click here to show them')}</Link>
    </Tooltip>)

  const location = useLocation();
  const userDetaile = JSON.parse(sessionStorage.getItem('firstname')) +" "+ JSON.parse(sessionStorage.getItem('lastname'))
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };
  
  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].nametranslate;
      }
    }
    return translate('Updating');
  };

  return (
    <React.Fragment>
        <IdleTimerContainer/>
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            <Nav.Item>
              <Nav.Link
                data-toggle="dropdown"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="m-0"
              > 
              </Nav.Link>
            </Nav.Item>
          </Nav>
        
          <Nav className="ml-auto" navbar>
         {sessionStorage.getItem('role') !== 'Collaborator' ? <Dropdown as={ButtonGroup}>  
              <Dropdown.Toggle split variant="muted" style={{ border: "none", top: "-8px"}} id="dropdown-custom-2" >
                  {badgeValue!=0 ? <OverlayTrigger placement="bottom" delay={{ show: 50, hide: 3000 }} overlay={renderTooltip}><Button variant="primary" style={{border:"none",margin:0,padding:0,color:"#6785c1"}}><Badge badgeContent={badgeValue} color="secondary"><BsBellFill className="icon" style={{color:'#6785c1',fontSize:'20px'}}/></Badge></Button></OverlayTrigger> : <BsBellFill className="icon" style={{color:'#6785c1',fontSize:'20px'}}/>}
              </Dropdown.Toggle>
          </Dropdown> : null }
            <Dropdown as={ButtonGroup}>  
            <Dropdown.Toggle split variant="muted" style={{border:"none",top: "-8px"}}  id="dropdown-custom-2" ><IoLanguageSharp className="icon" style={{color:'#6785c1',fontSize:'25px'}}/></Dropdown.Toggle>
            <Dropdown.Menu className="super-colors"style={{ left:"-80px"}}>
              <Dropdown.Item eventKey="3" >
                <Button onClick={()=>{window.location.reload();sessionStorage.setItem('lang','En')}} variant="light" style={{border:'none',margin:0}}><img src={en} title="English" style={{width:'auto',height:'auto'}}/></Button>
                <Button onClick={()=>{window.location.reload();sessionStorage.setItem('lang','Fr')}} variant="light" style={{border:'none',margin:0}}><img src={fr} title="French" style={{width:'auto',height:'auto'}}/></Button>
                <Button onClick={()=>{window.location.reload();sessionStorage.setItem('lang','Sp')}} variant="light" style={{border:'none',margin:0}}><img src={es} title="Spain" style={{width:'auto',height:'auto'}}/></Button>
              </Dropdown.Item>
             </Dropdown.Menu>
          </Dropdown>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle split variant="muted" style={{border:"none",marginTop:0}} id="dropdown-custom-2"><UserAvatar username={userDetaile}/></Dropdown.Toggle>
            <Dropdown.Menu className="super-colors" style={{left:"-65px"}}>
              <Dropdown.Item eventKey="1" onClick={() => histroy.push("/admin/password/user")}>{translate('Profile')}</Dropdown.Item>
              <Dropdown.Item eventKey="2" onClick={() => histroy.push("/admin/password/change")}>{translate('Change password')}</Dropdown.Item>
              <Dropdown.Item eventKey="3" href="/" onClick={()=> {reactLocalStorage.remove("PaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user'));reactLocalStorage.remove("UnpaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user'));sessionStorage.clear()}}>{translate('Log out')}</Dropdown.Item>
             </Dropdown.Menu>
          </Dropdown>
            
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </React.Fragment>
  );
}

export default Header;
