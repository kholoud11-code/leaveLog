import React, { Component } from 'react';
import ExptionnelService from '../../servicees/ExptionnelService'
import '../css/list.css';
import translate from "../../i18nProvider/translate"

class TypeOfVacation extends Component {
    constructor(props) {
        super(props)

        this.state = {
                Types: []
        }
        
        this.editType = this.editType.bind(this);
        
    }

    editType(id){
        this.props.history.push(`/admin/type/${id}`);
    }
   
   addType(){
    this.props.history.push('/admin/type/add');
   }
   deleteType(id){
    ExptionnelService.deletType(id).then( res => {
        this.setState({Types: this.state.Types.filter(Type => Type.id !== id)});
    });
   }
    componentDidMount(){
        ExptionnelService.getType().then((res) => {
            this.setState({ Types: res.data});
        });
    }
    render() {
        return (
            
            <div>
                <br></br>
                <div className = "row">
                        <table className = "table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>   {translate('Type of vacation')}</th>
                                    <th> {translate('Duration')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {   
                                    this.state.Types.map(
                                        
                                        Types => 
                                        <tr key = {Types.id }>
                                            <td> {Types.name}</td>
                                            <td> {Types.duration}</td>
                                            <td>
                                                <button onClick={ () => this.editType(Types.id)} className="btn btn-info">{translate('Update')} </button>
                                                <button style={{marginLeft: "10px"}} onClick={ () => this.deleteType(Types.id)} className="btn btn-danger">{translate('Delete')} </button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <div className="btnholiday">
                                <button onClick={this.addType.bind(this)} className="btn btn-info ">{translate('Add')}</button>
                        </div>
                </div>
            
               
               </div>
        );
    }
}

export default TypeOfVacation;
