import './CampaignPage.css'; 
import {InfoCircleOutlined} from '@ant-design/icons'
import { Button, Divider, OutlinedInput, InputAdornment, useScrollTrigger } from '@mui/material';
import { useState } from 'react';


export default function Auction({bids, campaignData, bidAction}){
    // // console.log('bid looking at', Math.min(bids.length -1, campaignData?.numBidSlots-1), bids[Math.min(bids.length -1, campaignData?.numBidSlots-1)].price)
    

    const [bidAmount, setBidAmount] = useState(0);
    return (
        <div className='Card'>
        <div style={{fontSize:30, textDecoration: 'underline'}}><b>Auction</b></div>
        <div>Top<span className='Highlight'>3</span>x 60 min interactions</div>
        <div><span className='Highlight'>17</span>x 30 min interactions</div>
        <div><span className='Highlight'>20</span>/ 20 have already been bid on, the top bidders win at the end of the campaign</div>
        <div style={{display:'flex', justifyContent:'space-between'}}>
            {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}
            <div>Current lowest price to win:  <span class='Highlight'>{'$'}{bids && campaignData ? bids[Math.min(bids.length -1, campaignData.numBidSlots-1)]?.price : '0'}</span></div>
          </div>

          <div style={{display:'flex', alignItems:'center'}}>
            <div style={{paddingRight:20}}>Enter bid price {'('}total{')'} </div>
            <OutlinedInput
              id="outlined-adornme nt-amount"
              type="number" 
              inputProps={{ step: ".5" }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              style={{height:50}}
              value={bidAmount}
              onChange={(e)=>setBidAmount(e.target.value)}
            />
          </div>
          <div className='InfoSection'>
            <InfoCircleOutlined style={{fontSize:30, color:'gray'}}/>
            <div style={{fontSize:15, marginRight:-10}}> If multiple parties bid the same price, the ones who bid first will have higher rankings</div>
          </div>
          <div style={{color:'#782eee', display:'flex', justifyContent:'space-around', width:'100%'}}>
            {/* <form action="http://localhost:4242/create-auction-session" method="POST">  */}
              <Button variant='outlined' onClick={()=>bidAction(bidAmount)} style={{textTransform: 'none', borderRadius:0,  borderTopRightRadius:11, borderBottomLeftRadius:11}} color='inherit' type="submit">Place bid</Button>
              or
              <Button variant='outlined' onClick={()=>bidAction(bidAmount, true)} style={{textTransform: 'none', borderRadius:0,  borderTopRightRadius:11, borderBottomLeftRadius:11}} color='inherit' type="submit">Auto bid</Button>

            {/* </form> */}
          </div>
          <span style={{fontSize:10, color:'#777'}}>You won't be charged if you don't win</span>
        </div>


    )
}