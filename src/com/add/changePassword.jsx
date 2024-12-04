import React, { Component } from 'react'
import {FormattedMessage} from "react-intl";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate"
import collaboratorService from '../../servicees/CollaborateurServices';
import Swal from 'sweetalert2'
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Button } from "react-bootstrap";

const englishColumn = ['Done!','Your Password has changed with success','Password is incorrect','The two Passwords are not the same'];
const frenchColumn = ['Parfait!','Votre mot de passe est changé avec succès','Mot de passe incorrect','Les deux mots de passe ne sont pas similaire'];
const spanishColumn = ['Hecho','Su contraseña ha cambiado con éxito','Contraseña no correcta','Las dos contraseñas no son las mismas'];
let sweet = []


switch (sessionStorage.getItem('lang')) {
    case 'Fr':
        sweet = frenchColumn
        break;

    case 'Sp':
        sweet = spanishColumn
        break;

    default:
        sweet = englishColumn
        break;
}

class changePassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
           id: parseInt(sessionStorage.getItem('user')),
           userp:"",
           password:'',
           newpassword:'',
           retypepassword:'',
           result:'',
           passwordShown: false,
           newPasswordShown: false,
           retypePasswordShown: false,
        }

        this.changenewpasswordHandler=this.changenewpasswordHandler.bind(this);
        this.changepasswordHandler=this.changepasswordHandler.bind(this);
        this.changereytpepasswordHandler=this.changereytpepasswordHandler.bind(this);
        this.saveOrUpdatePassword=this.saveOrUpdatePassword.bind(this);
      

    }

    // step 3
    changepasswordHandler= (event) =>{
        this.setState({password: event.target.value});
    }
    changenewpasswordHandler= (event) =>{
        this.setState({newpassword: event.target.value});
    }
    changereytpepasswordHandler= (event) =>{
        this.setState({retypepassword: event.target.value});
    }
    cancel(){
        this.props.history.push('/admin/calendar');
    }
    //get old password
    componentDidMount(){
        collaboratorService.getUserById(this.state.id).then( (res) =>{
            let user = res.data;
            this.setState({userp: user.password});
    }); }
    
    //check password is correct and change
     saveOrUpdatePassword = (e) => {
        e.preventDefault();
        
       var bcrypt = require('bcryptjs');
       let user = {
           password:this.state.newpassword
       }
        const match =  bcrypt.compare(this.state.password, this.state.userp.slice(8))
        if(this.state.newpassword === this.state.retypepassword){
            match.then(res=> { console.log(res)
                if(res){
                    collaboratorService.password(user,this.state.id).then(ha =>{
                        Swal.fire(
                            sweet[0],
                            sweet[1],
                            'success'
                          ).then((result) => {
                            if (result.isConfirmed) {
                            this.props.history.push("/admin/Home")
                            }
                          })  
                    });
                }else{
                    Swal.fire(
                        'Oops...',
                        sweet[2],
                        'error'
                      )
                }
            })
        }else{
            Swal.fire(
                'Oops...',
                sweet[3],
                'error'
              )
        }
    }

    togglePassword = (typePassword) => {
        if (typePassword == "oldePassword") {
            this.setState((prevState) => ({ passwordShown: !prevState.passwordShown }));
        } else if (typePassword == "newPassword") {
            this.setState((prevState) => ({ newPasswordShown: !prevState.newPasswordShown }));
        } else if (typePassword == "retypePassword") {
            this.setState((prevState) => ({ retypePasswordShown: !prevState.retypePasswordShown }));
        }
    };

    render() {
        
        return (
            
            <div>
                <br></br>
                <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                <div className = "card-body">
                                    <form>
                                    
                                        <div className = "form-group">
                                            <label>{translate('Password')}: </label>
                                            <div className="container-sm element-margin" style={{ display: 'flex', border: '1px solid #E3E3E3', marginTop: 0 , paddingTop: 0, paddingLeft: 0, marginLeft:"-1px", width: '100%', borderRadius: '4px' }}>
                                            <FormattedMessage id='Password'>
                                               {message => <input placeholder={message} name="Password" className="form-control" 
                                               type={this.state.passwordShown ? "text" : "password"} value={this.state.password} onChange={this.changepasswordHandler}
                                               style={{ borderRight:'none' , borderStyle:'none'}}/>}
                                            </FormattedMessage>
                                            <Button onClick={()=>{this.togglePassword("oldePassword")}} style={{ border: 'none', padding: 0, fontSize: '23px', color: '#A9A9A9' }}>{this.state.passwordShown ? <IoEye /> : <IoEyeOff />}</Button>
                                            </div>
                                        </div>
                                        <div className = "form-group">
                                            <label> {translate('New password')}: </label>
                                            <div className="container-sm element-margin" style={{ display: 'flex', border: '1px solid #E3E3E3', marginTop: 0 , paddingTop: 0, paddingLeft: 0, marginLeft:"-1px", width: '100%', borderRadius: '4px' }}>
                                            <input placeholder="" name="" className="form-control" 
                                               type={this.state.newPasswordShown ? "text" : "password"} value={this.state.newpassword} onChange={this.changenewpasswordHandler}
                                               style={{ borderRight:'none' , borderStyle:'none'}}/>
                                            <Button onClick={()=>{this.togglePassword("newPassword")}} style={{ border: 'none', padding: 0, fontSize: '23px', color: '#A9A9A9' }}>{this.state.newPasswordShown ? <IoEye /> : <IoEyeOff />}</Button>
                                            </div>  
                                        </div>
                                        <div className = "form-group">
                                            <label> {translate('Retype password')}: </label>
                                            <div className="container-sm element-margin" style={{ display: 'flex', border: '1px solid #E3E3E3', marginTop: 0 , paddingTop: 0, paddingLeft: 0, marginLeft:"-1px", width: '100%', borderRadius: '4px' }}>
                                            <input placeholder="" name="" className="form-control" 
                                               type={this.state.retypePasswordShown ? "text" : "password"} value={this.state.retypepassword} onChange={this.changereytpepasswordHandler}
                                               style={{ borderRight:'none' , borderStyle:'none'}}/>
                                            <Button onClick={()=>{this.togglePassword("retypePassword")}} style={{ border: 'none', padding: 0, fontSize: '23px', color: '#A9A9A9' }}>{this.state.retypePasswordShown ? <IoEye /> : <IoEyeOff />}</Button>
                                            </div>  
                                        </div>
                                      
                                        <button className="btn btn-success" onClick={this.saveOrUpdatePassword}>{translate('Save')}</button>
                                        <button className="btn btn-danger"  onClick={() => this.props.history.push("/admin/Home")} style={{marginLeft: "10px"}}>{translate('Cancel')}</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                </div>
            </div>
        )
    }
}

export default changePassword 