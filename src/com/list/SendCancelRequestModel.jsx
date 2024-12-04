import React, {useState} from "react";
import {Modal, Button,InputGroup,FormControl} from "react-bootstrap";
import '../css/list.css';
import {FaUserCircle} from "react-icons/fa";
import translate from "../../i18nProvider/translate"
import {FormattedMessage} from "react-intl";

const SendCancelRequestModel = (props) => {

   const[justistest,setJustistest] = useState('');

   const TitleModelMethodByTypeRequest = (typerequest) => {
      if(typerequest === "Paid Request"){
          return translate("Cancel Paid Request");
      }
      if(typerequest === "Unpaid Request"){
         return translate("Cancel Unpaid Request");
      }
   }

   const SubjectModelMethodByTypeRequest = (typerequest) => {
      if(typerequest === "Paid Request"){
          return translate("Do you want to send this cancellation request to your validator?");
      }
      if(typerequest === "Unpaid Request"){
         return translate("Do you want to send this cancellation request?");
      }
   }

   const SendCancellationRequestMethodByType = (typerequest) => {
      if(typerequest === "Paid Request"){
         //console.info("Send Cancellation Of "+typerequest)
         props.sendcancellationrequestmethod(props.rowReq1.id)
      }

      if(typerequest === "Unpaid Request"){
         //console.info("Send Cancellation Of "+typerequest)
         props.sendcancellationunpaidrequestmethod(props.rowReq1.id)
      }
   }

    return (
       <div>
           <Modal {...props}>
                  <Modal.Header closeButton>
                   <Modal.Title style={{marginTop: 0,marginBottom: '5px'}}>
                   <h3>{TitleModelMethodByTypeRequest(props.rowReq1.nameReq)}</h3>
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
                                <p style={{marginBottom:"20px",fontSize:"17px",fontWeight:"bold"}}>{props.rowcollab1.firstname+" "+ props.rowcollab1.lastname}</p>
                                </div>
                             </div>
                             <div className='boxview2'>
                                <p style={{marginTop:"15px",fontSize:"17px"}}>{SubjectModelMethodByTypeRequest(props.rowReq1.nameReq)}</p>
                             </div>
                     </div>
                  </div>
                  <div className='' style={{paddingBottom:""}}>
                  <FormattedMessage id="give your justification before sending cancellation request">
                  {message => <InputGroup><FormControl as="textarea" key={props.rowReq1.id} style={{ width: 'auto' }} placeholder={message} onChange={(e) => {props.changecancellationjustification(props.rowReq1.id,e);setJustistest(e.target.value)}} id="InputJustis"/></InputGroup>}
                  </FormattedMessage>
                  </div>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button id="cancelReqBTN" style={{marginLeft: "269px"}} onClick={props.closeModel}>{translate("Close")}</Button>
                  <Button id="deleteReqBTN" style={{marginLeft: "10px"}} disabled={!justistest} onClick={ (e)=>{e.preventDefault(); SendCancellationRequestMethodByType(props.rowReq1.nameReq)/*props.sendcancellationrequestmethod(props.rowReq1.id)*/;props.closeModel()}}>{translate("Send")}</Button>
                 </Modal.Footer>
            </Modal>
       </div>
    );
}

export default SendCancelRequestModel;