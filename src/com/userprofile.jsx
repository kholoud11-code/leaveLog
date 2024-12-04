import React, {useState, useEffect} from "react";
import collaboratorService from '../servicees/CollaborateurServices';
import SupervisorService from '../servicees/supervisorServices'
import { I18nPropvider, LOCALES } from '../i18nProvider';
import translate from "../i18nProvider/translate"
import {FormattedMessage} from "react-intl";
import {Button,Card,Form,Container,Row,Col} from "react-bootstrap";
import Fetching from './list/Fetching'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import countries from '../com/add/countries';
import {useHistory} from 'react-router-dom';
import Swal from 'sweetalert2'

const englishColumn = ['Done!','Your Informations has updated with success, Please try to reconnect again'];
const frenchColumn = ['Fait!','Vos informations ont été mises à jour avec succès, veuillez réessayer de vous reconnecter'];
const spanishColumn = ['Hecho!','Su información se ha actualizado correctamente, Intente volver a conectarse'];
let DatagridColumn = []

switch (sessionStorage.getItem('lang')) {
    case 'Fr':
        DatagridColumn = frenchColumn
        break;

    case 'Sp':
        DatagridColumn = spanishColumn
        break;

    default:
        DatagridColumn = englishColumn
        break;
}

const userprofile = () => {

        const[id, setId] = useState(parseInt(sessionStorage.getItem('user')));
        const[cin, setCin] = useState('');
        const[firstname, setFirstname] = useState('');
        const[lastname,setLastname] = useState('');
        const[team,setTeam] = useState('');
        const[age,setAge] = useState('');
        const[adresse,setAdresse] = useState('');
        const[username,setUsername] = useState('');
        const[country,setCountry] = useState('');
        const[email,setEmail] = useState('');
        const[experience,setExperience] = useState(0);
        const[solde,setSolde] = useState({});
        const[fetching,setFetching] = useState(true);
        const histroy = useHistory();

        useEffect(()=>{
            collaboratorService.getUserById(id).then( (res) =>{
                let user = res.data;
                //console.info(user)
                    setId(user.id)
                    setCin(user.cin)
                    setFirstname(user.firstname)
                    setLastname(user.lastname)
                    setTeam(user.team)
                    setAge(user.age)
                    setAdresse(user.adresse)
                    setUsername(user.username)
                    setCountry(user.country)
                    setEmail(user.email)
                    setExperience(user.experience)
                    setSolde(user.solde)
                    setFetching(false)
              });
          },[])

    const UpdateUser = (e) => {
           e.preventDefault();
           setFetching(true)
            let user = {
              cin:cin,  
              firstname:firstname,
              lastname:lastname,
              team:team,
              age:age,
              adresse:adresse,
              username:username,
              country:country,
              email:email,
              experience:experience,
              solde:solde
           };
      //treatment of log user connected
      const userDetaile = JSON.parse(sessionStorage.getItem('firstname')) + " " + JSON.parse(sessionStorage.getItem('lastname')) + " - " + " Update Profile "
        
      collaboratorService.updateUserNormal(user, id,userDetaile).then( res => {
            Swal.fire(
              DatagridColumn[0],
              DatagridColumn[1],
              'success'
            ).then((result) => {
              if (result.isConfirmed) {
                sessionStorage.clear();
                histroy.push("/");
              }
            })  
       });
      }

    return(
        <React.Fragment>
        {fetching? <Fetching /> : null}
       <Container fluid>
       <Row>
         <Col md="8">
           <Card>
             <Card.Header>
               <Card.Title as="h4">{translate('Edit Profile')}</Card.Title>
             </Card.Header>
             <Card.Body>
               <Form>
                 <Row>
                   <Col className="pr-1" md="5">
                     <Form.Group>
                       <label>{translate('Company')}</label>
                       <FormattedMessage id='Company'>
                         {message => <Form.Control defaultValue="NTT DATA" disabled placeholder={message} type="text" ></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                   <Col className="px-1" md="3">
                     <Form.Group>
                       <label>{translate("Employee Nr")}</label>
                       <FormattedMessage id='Employee Nr'>
                         {message => <Form.Control defaultValue={cin} disabled onChange={(event) => setCin(event.target.value)} placeholder={message} type="text"></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                   <Col className="pl-1" md="4">
                     <Form.Group>
                       <label htmlFor="exampleInputEmail1">
                       {translate('FirstName')}
                       </label>
                       <Form.Control defaultValue={firstname} onChange={(event) => setFirstname(event.target.value)} type="text" ></Form.Control>
                     </Form.Group>
                   </Col>
                 </Row>
                 <Row>
                   <Col className="pr-1" md="6">
                     <Form.Group>
                       <label>{translate('LastName')}</label>
                       <FormattedMessage id='LastName'>
                         {message => <Form.Control defaultValue={lastname} onChange={(event) => setLastname(event.target.value)}  placeholder={message} type="text" ></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                   
                 
                   <Col className="pl-1" md="6">
                     <Form.Group>
                       <label>{translate('Email')}</label>
                       <FormattedMessage id='Email'>
                         {message => <Form.Control defaultValue={email} onChange={(event) => setEmail(event.target.value)} placeholder={message} type="text" ></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                 </Row>
                 <Row>
                   <Col className="pr-1" md="6">
                     <Form.Group>
                       <label>{translate('address')}</label>
                       <FormattedMessage id='address'>
                         {message => <Form.Control defaultValue={adresse} onChange={(event) => setAdresse(event.target.value)} placeholder={message} type="text" ></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                   
                   <Col className="pl-1" md="6">
                     <Form.Group>
                       <label>{translate('username')}</label>
                       <FormattedMessage id='username'>
                         {message => <Form.Control placeholder={message} type="text" onChange={(event) => setUsername(event.target.value)} defaultValue={username}></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                   </Col>
                   </Row>
                   <Row style={{alignItems:'center'}}>
                   <Col className="pr-1" md="6">
                     <Form.Group>
                       <label>{translate('Your current country work is')} </label>
                       <FormattedMessage id='country work'>
                         {message => <Form.Control defaultValue={country} disabled placeholder={message} type="text" ></Form.Control>}
                       </FormattedMessage>
                       </Form.Group></Col>
                       <Col className="pr-1" md="6">
                    <Form.Group>
                    <label>{translate('Update Country Work')}</label>
                       <Autocomplete
                                           id="country-select-demo"
                                           sx={{ width: 'auto', height:50}}
                                           options={countries}
                                           autoHighlight
                                           onInputChange={(event, newInputValue) => {
                                           setCountry(newInputValue);
                                           }}
                                           
                                           renderOption={(props, option) => (
                                           <Box
                                               component="li"
                                               sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props} >
                                               <img
                                               loading="lazy"
                                               style={{width:"20px",height:"15px"}}
                                               src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                               srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                               />
                                               {option.label} ({option.code})
                                           </Box>
                                           )}
                                           renderInput={(params) => (
                                           <TextField 
                                               {...params}
                                               label={translate("Choose a country")}
                                               inputProps={{
                                               ...params.inputProps,
                                               autoComplete: "new-password"
                                               }}
                                           />
                                           )}
                                       ></Autocomplete>
                     </Form.Group>
                   </Col>
                 </Row>
                 
                 <Button className="btn-fill pull-right" type="submit" variant="info" onClick={(event) => UpdateUser(event)} >
                 {translate('Update Profile')} 
                 </Button>
                 <div className="clearfix"></div>
               </Form>
             </Card.Body>
           </Card>
         </Col>
         <Col md="4">
           <Card className="card-user">
             <div className="card-image">
               
             </div>
             <Card.Body>
               <div className="author">
                 <a href="#pablo" onClick={(e) => e.preventDefault()}>
                   <img alt="..." className="avatar border-gray" src={require("assets/img/default-avatar.png").default} ></img>
                   <h5 className="title" >{firstname+" "+ lastname}</h5>
                 </a>
                 <p className="description" >{username}</p>
               </div>
             </Card.Body>
             <hr></hr>
            
           </Card>
         </Col>
       </Row>
     </Container>
       
        </React.Fragment>
    )
}
export default userprofile