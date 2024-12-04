import React, {useState} from "react";
import {Modal, Button,InputGroup,FormControl,Form} from "react-bootstrap";
import '../css/list.css';
import {FaUserCircle} from "react-icons/fa";
import translate from "../../i18nProvider/translate"
import {FormattedMessage} from "react-intl";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import collaboratorService from '../../servicees/CollaborateurServices';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class UpdatePasswordModel extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            id:'',
            cin:'',
            password:'Nttd@t@2022',
            open:false
        }

        this.changecinHandler=this.changecinHandler.bind(this);
        this.changepasswordHandler = this.changepasswordHandler.bind(this);
    }
   //let cinvalueprops = props.rowcollab1.cin;
   //let cinvalueprops = props.rowcin1;
   //let passwordvalueprops = props.rowpassword1;
   //let[cin,setCin] = useState(cinvalueprops);
   //let[password,setPassword] = useState(passwordvalueprops);
   //const[password,setPassword] = useState("Nttd@t@2022");
   //const[open,setOpen] = useState(false);
   //setCin(cinvalueprops)
   //setPassword(passwordvalueprops)
   //console.info(cin)
   //console.info(cinvalueprops)

   //console.info(password)
   //console.info(passwordvalueprops)

   componentDidUpdate = (prevProps,prevState) => {
       if(prevState.id !== this.props.rowcollab1.id){
           this.setState({
               id:this.props.rowcollab1.id,
               cin:this.props.rowcollab1.cin,
           })
       }
   }
   
    handleClose = (event, reason) => {
       if (reason === 'clickaway') {
         return;
        }
       this.setState({open:false});
    };
   
    changecinHandler = (event) => {
        //console.log(event.target.value)
        this.setState({cin:event.target.value});
        //console.log(this.state.cin)
    }

    changepasswordHandler = (event) => {
       //console.log(event.target.value)
       this.setState({password:event.target.value});
       //console.log(this.state.password)
    }

   ChangeDefaultPasswordByCinMethod = (e) => {
    e.preventDefault();
        let user = {
            password:this.state.password
        }
    collaboratorService.passwordbycin(user,this.state.cin).then(res => {
        this.setState({open:true});
         this.props.onHide()
         this.props.refresh()
    })
    }

   /*const changecinHandler = (event) => {
       setCin(event.target.value)
   }*/
    render(){
       return (
       <React.Fragment>
            <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar open={this.state.open} autoHideDuration={4000} onClose={this.handleClose}> 
                            <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
                               {translate("Reset Password Successfully")} 
                            </Alert>
                        </Snackbar>
            </Stack>
           <Modal {...this.props}>
                  <Modal.Header closeButton>
                   <Modal.Title style={{marginTop: 0,marginBottom: '5px'}}>
                   <h3>{translate("Reset Password")}</h3>
                  </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <div className="btn-group me-2" role="group" aria-label="First group" id="mycontainer" style={{height:'auto'}}>
                     <div className='box'>
                             <div className='boxview1' style={{alignItems:'center'}}>
                                <div>
                                   <FaUserCircle style={{fontSize:"70px",color:"#20B2AA",marginBottom:"10px",marginLeft:"10px"}}/>
                                </div>
                                <div style={{width:"170px",paddingLeft:'30px'}}>
                                <p style={{marginBottom:"20px",fontSize:"17px",fontWeight:"bold"}}>{this.props.rowcollab1.firstname+" "+ this.props.rowcollab1.lastname}</p>
                                </div>
                             </div>
                             <div className='boxview2'>
                                <p style={{marginTop:"25px",fontSize:"17px"}}> {translate("Do you want to reset password by default for this user?")} </p>
                             </div>
                     </div>
                  </div>
                  <div className='' style={{paddingBottom:""}}>
                    {/*<InputGroup><FormControl as="textarea" key={props.rowReq1.id} style={{ width: 'auto' }} placeholder="give your justification before sending cancellation request" onChange={(e) => {props.changecancellationjustification(props.rowReq1.id,e);setJustistest(e.target.value)}} id="InputJustis"/></InputGroup>*/}
                    <Form.Group>
                       <label>{translate("Employee Nr")}</label>
                       <FormattedMessage id='Employee Nr'>
                         {message => <Form.Control /*defaultValue={this.state.cin}*/ value={this.state.cin} disabled onChange={this.changecinHandler} placeholder={message} type="text"></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                     <Form.Group>
                        <label>{translate('password')}: </label>
                        <FormattedMessage id='password'>
                         {message => <Form.Control /*defaultValue={this.state.password}*/ value={this.state.password} onChange={this.changepasswordHandler} placeholder={message} type="text"></Form.Control>}
                       </FormattedMessage>
                     </Form.Group>
                  </div>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button id="cancelReqBTN" style={{marginLeft: "246px"}} onClick={this.props.closeModel}>{translate("Close")}</Button>
                  <Button id="deleteReqBTN" style={{marginLeft: "10px"}}  onClick={this.ChangeDefaultPasswordByCinMethod}>{translate("save")}</Button>
                 </Modal.Footer>
            </Modal>
       </React.Fragment>
    );
  }
}
export default UpdatePasswordModel;