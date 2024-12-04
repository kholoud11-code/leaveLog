import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import {Button} from 'react-bootstrap'
import { deepOrange, deepPurple, pink, indigo, blueGrey, teal, blue} from '@mui/material/colors';

function Color(){
  let colors = [deepOrange[500], deepPurple[500], pink[500], indigo[500], blueGrey[500], teal[700], blue[500]]
  let number = Math.floor(Math.random() * 7);
  return colors[number]
}

function stringAvatar(name) {
  return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function UserAvatar({username}) {
  return (
      <Button style={{border:'none',margin:0,padding:0,background:'none'}}><Avatar {...stringAvatar(username.toUpperCase())} sx={{width:47, height:47, bgcolor: Color() }} /></Button>
  );
}