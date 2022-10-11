import TableComponent from '../TableComponent/TableComponent';
import './Supporters.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Supporters({supporters}) {

  // console.log('campaignData in supporters', campaignData)

  // let supporters = campaignData?.info?.supporters;
  supporters = supporters?supporters: []
  // console.log('supporters',supporters)


  return (
    <div style={{display:'flex', flexWrap:'wrap', justifyContent:'flex-start'}}>
      {supporters.map(user=><SupporterElem user={user}/>)}
    </div>
  );
}

export default Supporters;

function SupporterElem({user}){
 return (
   <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20}}>
     <img alt='userProfilePic' src={user.photoUrl} style={{borderRadius:1000, width:100, height:100}}/>
     <a href='#'>{user.username}</a>
   </div>
 )
}