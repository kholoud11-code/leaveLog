import React, { Component } from 'react'
import '../css/Request.css';
import { I18nPropvider, LOCALES } from '../../i18nProvider';
import translate from "../../i18nProvider/translate"
import Calendar from '../calendor/calendar3'
import {
    Badge,
    Button,
    Card,
    Form,
    Navbar,
    Nav,
    Container,
    Row,
    Col,
  } from "react-bootstrap";
class Vacationrequest extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            balance: []
        }
        
        this.saverequestvacationpaid = this.saverequestvacationpaid.bind(this);
        this.paid=this.paid.bind(this);
        this.unpaid=this.unpaid.bind(this)
        this.exception=this.exception.bind(this)
        this.recovery=this.recovery.bind(this)
        this.history=this.history.bind(this)
      }

    // step 3
    
    saverequestvacationpaid = (e) => {
        e.preventDefault();
        let holiday = {date_start: this.state.datestart, date_end: this.state.date, duration: this.state.duration};
        console.log('vacation => ' + JSON.stringify(RequestVacationPaid));
         BalanceService.createRequestVacationPaid(RequestVacationPaid).then(res =>{
        this.props.history.push('/admin/RequestVacation/History');});
    }
    

    history(){
        this.props.history.push('/admin/vacationrequest/History');
    }
    paid(){
        this.props.history.push('/admin/vacationrequest/paid');
    }
    unpaid(){
        this.props.history.push('/admin/vacationrequest/unpaid');
    }
    exception(){
        this.props.history.push('/admin/vacationrequest/exceptional');
    }
    recovery(){
        this.props.history.push('/admin/vacationrequest/recovery');
    }
    render() {
        return (
          
        <Container fluid>
            <Row>
              <Col md="12">
                <Card>
                  <Card.Header>
                    <Card.Title as="h4">{translate('Vacation request')}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form style={{display:"grid"}}>
                    
                      
                      <Button className="btn-fill pull-right" type="submit" variant="primary" onClick={this.paid} style={{backgroundColor:"#6785c1",color:"white",marginBottom:"10px"}}> {translate('Paid vacation')}</Button>
                      <br></br>
                      <br></br>
                      <Button  className="btn-fill pull-right" type="submit" variant="primary" onClick={this.unpaid} style={{backgroundColor:"#6785c1",marginBottom:"10px"}}> {translate('Unpaid vacation')}</Button>
                      <br></br>
                      <br></br>
                      <Button  className="btn-fill pull-right" type="submit" variant="primary" onClick={this.exception} style={{backgroundColor:"#6785c1",marginBottom:"10px"}}> {translate('Exceptional vacation')}</Button>
                      <br></br>
                      <br></br>
                      <Button  className="btn-fill pull-right" type="submit" variant="primary" onClick={this.recovery} style={{backgroundColor:"#6785c1",marginBottom:"10px"}}>{translate('Recovery vacation')} </Button>
                      <br></br>
                      <br></br>
                      <Button className="btn-fill pull-right" type="submit" variant="primary" onClick={this.history} style={{backgroundColor:"#6785c1",marginBottom:"10px"}}>{translate('Historic')}</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>


              
            </Row>
          </Container>
        );
    }
}

export default Vacationrequest