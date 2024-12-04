import React from 'react';
import translate from "../../i18nProvider/translate"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HolidayService from '../../servicees/HolidayService';
import dateFormat from "dateformat";
import {FormattedMessage} from "react-intl";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class AddHolidayModal extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            id: '',
            name: '',
            date: '',
            duration: '',
            openSnackBar:false
        }

        this.changenameHandler = this.changenameHandler.bind(this);
        this.changedurationHandler = this.changedurationHandler.bind(this);
        this.changedateHandler = this.changedateHandler.bind(this);
        this.saveOrUpdateHoliday = this.saveOrUpdateHoliday.bind(this);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevState.id !== this.props.holidayData.id){
            this.setState({
                id:this.props.holidayData.id,
                name:this.props.holidayData.name,
                date:this.props.holidayData.date,
                duration:this.props.holidayData.duration,
            })
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
        
        if(this.state.id === ''){
            HolidayService.createholiday(holiday).then(res =>{
                this.setState({openSnackBar:true})
                this.props.onHide()
                this.props.refresh()
            });
        }else{
            HolidayService.updateHoliday(holiday, this.state.id).then( res => {
                this.setState({openSnackBar:true})
                this.props.onHide()
                this.props.refresh()
            });
        }
                
    }

    changenameHandler= (event) => {
        this.setState({name: event.target.value});
    }

    changedurationHandler= (event) => {
        this.setState({duration: event.target.value});
    }

    changedateHandler= (event) => {
        this.setState({date: dateFormat(event.target.value, "yyyy-mm-dd")});
        
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
    }
        this.setState({openSnackBar:false});
    };

    render(){

        return (
           <React.Fragment>
                <Stack spacing={2} sx={{ width: '100%' }}>
                            <Snackbar open={this.state.openSnackBar} autoHideDuration={5000} onClose={this.handleClose}>
                                <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
                                {this.state.id===''? translate("The Holiday is successfully added!") : translate("The Holiday is successfully updated!")}
                                </Alert>
                            </Snackbar>
                </Stack>

                <Modal show={this.props.show} onHide={this.props.onHide}>
                        <Modal.Header closeButton style={{paddingTop:12,paddingRight:18}}><Modal.Title>{this.state.id===''? translate('Add a new') : translate('Update a')} {translate('Holiday')}</Modal.Title></Modal.Header>
                            <Modal.Body style={{paddingTop:0}}>
                                    <form>
                                        <div className = "form-group">
                                            <label>{translate('Name')}: </label>
                                            <FormattedMessage id="Name">
                                              {message =>  <input placeholder={message} name="name" className="form-control" 
                                              disabled={(this.state.name === "Aid Al Fitr" || this.state.name === "Aïd al-Adha" || this.state.name === "1st Moharam" || this.state.name === "Mawlid") ? true : null}  
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
                                    </form>
                            </Modal.Body>
                        <Modal.Footer style={{display:'flex',justifyContent:'flex-end'}}>
                            <Button className="btn btn-danger" style={{marginRight: "10px"}} onClick={this.props.onHide}>{translate('Cancel')}</Button>
                            <Button className="btn btn-success" onClick={this.saveOrUpdateHoliday}>{translate('Save')}</Button>
                        </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}
export default AddHolidayModal;