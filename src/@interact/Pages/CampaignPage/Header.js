import './CampaignPage.css'; 
import {InfoCircleOutlined} from '@ant-design/icons'
import { Button, Divider, OutlinedInput, InputAdornment } from '@mui/material';


export default function Header({campaignData}){
    return (

      <div className='Description'>
        <div style={{fontSize:30, fontWeight:400, paddingBottom:10}}>
          Game &#38; Chat with <span style={{color:'#782eee'}}>Pattedevelours</span> 1-on-1
        </div>
        <div style={{color:'gray', fontSize:18}}>
          {campaignData?.header?.tagline1}
        </div>
        <div style={{fontSize:20}}>
          {campaignData?.header?.tagline2}
        </div>
        <div  style={{color:'gray', fontSize:18}}>
          Began on {new Date(campaignData?.startDate?.seconds*1000)?.toString().slice(0, 15)} || Ends on {new Date(campaignData?.endDate?.seconds*1000)?.toString().slice(0, 15)}
        </div>
      </div>


    )
}