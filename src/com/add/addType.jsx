import React, { Component } from 'react'
import ExptionnelService from '../../servicees/ExptionnelService'
import dateFormat from "dateformat";
import translate from "../../i18nProvider/translate"
import {FormattedMessage} from "react-intl";
class AddType extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
            id: this.props.match.params.id,
            name: '',
            duration: ''
        }
        this.changenameHandler = this.changenameHandler.bind(this);
        this.changedurationHandler = this.changedurationHandler.bind(this);
        this.saveOrUpdateType = this.saveOrUpdateType.bind(this);
    }

    // get Type formation if user click in update
    
    componentDidMount(){
      
        // step 4
        if(this.state.id === 'add'){
            return
        }else{
            ExptionnelService.getTypetById(this.state.id).then( (res) =>{
                let user = res.data;
                this.setState({
                    id:user.id,
                    name:user.name,
                    duration:user.duration
                });
            });
        }
    }
        saveOrUpdateType = (e) => {

            e.preventDefault();
            let type = {
                    name:this.state.name,
                    duration:this.state.duration
            };     
                if(this.state.id === "add"){
                    ExptionnelService.creatType(type).then(res =>{
                        this.props.history.push('/admin/vacationrequest/Type');
                    });
                }else{
                    ExptionnelService.updatType(type, this.state.id).then( res => {
                        this.props.history.push('/admin/vacationrequest/Type');
                    });
                } 
                  
        }
    
    
    changenameHandler= (event) => {
        this.setState({name: event.target.value});
    }

    changedurationHandler= (event) => {
        this.setState({duration: event.target.value});
    }
    cancel(){
        this.props.history.push('/admin/vacationrequest/Type');
    }

    
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
                                            <label>{translate('Name')}: </label>
                                            <FormattedMessage id="Name">
                                                {message => <input placeholder={message} name="name" className="form-control" 
                                                value={this.state.name} onChange={this.changenameHandler}/>}
                                            </FormattedMessage>
                                        </div>
                                        <div className = "form-group">
                                            <label> {translate('duration')} </label>
                                            <FormattedMessage id="duration">
                                               {message => <input placeholder={message} name="duration" className="form-control" 
                                                value={this.state.duration} onChange={this.changedurationHandler}/>}
                                            </FormattedMessage>
                                        </div>

                                        <button className="btn btn-success" onClick={this.saveOrUpdateType}>{translate('Save')}</button>
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

export default AddType