import React, { Component } from 'react'
import HolidayService from '../../servicees/HolidayService'
import dateFormat from "dateformat";
import {FormattedMessage} from "react-intl";
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate"
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
  
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


class Addholiday extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
            id: this.props.match.params.id,
            name: '',
            date: '',
            duration: '',
            open: false
        }
        this.changenameHandler = this.changenameHandler.bind(this);
        this.changedurationHandler = this.changedurationHandler.bind(this);
        this.changedateHandler = this.changedateHandler.bind(this);
        this.saveOrUpdateHoliday = this.saveOrUpdateHoliday.bind(this);
    }

    
    // get holiday formation if user click in update
    componentDidMount(){
      
       
        if(this.state.id === 'add'){
            return
        }else{
            HolidayService.getHolidayById(this.state.id).then( (res) =>{
                let user = res.data;
                this.setState({
                    id:user.id,
                    name:user.name,
                    date:user.date,
                    duration:user.duration,
                    country:sessionStorage.getItem("country")
                });
            });
        }
    }
        saveOrUpdateHoliday = (e) => {
            e.preventDefault();
            let holiday = {
                    name:this.state.name,
                    date:this.state.date,
                    duration:this.state.duration,
                    country:sessionStorage.getItem("country")
            };     
                if(this.state.id === "add"){
                    HolidayService.createholiday(holiday).then(res =>{
                        this.setState({open:true})
                        setTimeout(()=>{
                            this.props.history.push('/admin/holidays');
                         },3000) 
                         
                    });
                }else{
                    HolidayService.updateHoliday(holiday, this.state.id).then( res => {
                        this.props.history.push('/admin/holidays');
                    });
                }   
        }
    
    
    changenameHandler= (event) => {
        this.setState({name: event.target.value});
    }

    changedurationHandler = (event) => {
        this.setState({duration: event.target.value});
    }

    changedateHandler = (event) => {
        this.setState({date: dateFormat(event.target.value, "yyyy-mm-dd")});
        
    }

    cancel(){
        this.props.history.push('/admin/holidays');
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
    }
        this.setState({open:false});
    };

    
    render() {
  
        return (
            <div>
                 <Stack spacing={2} sx={{ width: '100%' }}>
                        <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
                            <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
                              {translate("The Holiday is successfully added")}
                            </Alert>
                        </Snackbar>
                    </Stack>
                <br></br>
                <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                <div className = "card-body">
                                    <form>
                                        <div className = "form-group">
                                            <label>{translate('Name')}: </label>
                                            <FormattedMessage id="Name">
                                              {message =>  <input placeholder={message} name="name" className="form-control" 
                                                value={this.state.name} onChange={this.changenameHandler}/>}
                                            </FormattedMessage>
                                        </div>
                                        <div className = "form-group">
                                            <label> {translate('date')} </label>
                                            <FormattedMessage id="date">
                                              {message =>  <input placeholder={message} name="date" className="form-control" 
                                               type="date" value={this.state.date} onChange={this.changedateHandler}/>}
                                            </FormattedMessage>
                                        </div>
                                        <div className = "form-group">
                                            <label> {translate('duration')} </label>
                                            <FormattedMessage id="duration">
                                              {message => <input placeholder={message} name="duration" className="form-control" 
                                                value={this.state.duration} onChange={this.changedurationHandler}/>}
                                            </FormattedMessage>
                                        </div>
                                      

                                        <button className="btn btn-success" onClick={this.saveOrUpdateHoliday}>{translate('Save')}</button>
                                        <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>{translate('Cancel')}</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                </div>
            </div>
        )
    }
}

export default Addholiday 