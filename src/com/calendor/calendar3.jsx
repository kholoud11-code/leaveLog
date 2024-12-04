/*import React, {useReducer} from 'react';
import {DateRangeInput} from '@datepicker-react/styled';

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'focusChange':
      return {...state, focusedInput: action.payload}
    case 'dateChange':
      return action.payload
    default:
      throw new Error()
  }
}

function calendar() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <DateRangeInput
      onDatesChange={data => dispatch({type: 'dateChange', payload: data})}
      onFocusChange={focusedInput => dispatch({type: 'focusChange', payload: focusedInput})}
      startDate={state.startDate} // Date or null
      endDate={state.endDate} // Date or null
      focusedInput={state.focusedInput} // START_DATE, END_DATE or null
    />
  )
}*/
import React, {useState} from 'react'
import {Datepicker, START_DATE} from '@datepicker-react/styled'
import HolidayService from '../../servicees/HolidayService'
import dateFormat from "dateformat";

function calendar() {
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    focusedInput: START_DATE,
    holidays:[]
  })

  function handleDatesChange(data) {
    if (!data.focusedInput) {
      setState({...data, focusedInput: START_DATE})
    } else {
      setState(data)
    }
  }
  let d =new Date()
  function handleChange(value, e) {
    console.log(value +"hi"); // this will be a moment date object
    console.log(e.target.value); // this will be a string value in datepicker input field
  }
 /* HolidayService.getHoliday().then(res => {
    setState({ holidays: res.data});
    
});*/
  
  function blockedDate (date){
    var show = false;
    
 /* state.holidays.map(map=>{*/
    if (date.getDay()==6|| date.getDay()==0/*||dateFormat(date.toLocaleDateString(), "yyyy-mm-dd")===map.date*/){
      show =true
    }else {
      show = false
    }
  /*})*/
      
      return show
    }
    
    
  return (
    <Datepicker
      onDatesChange={handleDatesChange}
      onChange={handleChange}
      startDate={state.startDate} // Date or null
      endDate={state.endDate} // Date or null
      focusedInput={state.focusedInput} // START_DATE, END_DATE or null
      isDateBlocked={blockedDate}
    />
  )
}
export default calendar;