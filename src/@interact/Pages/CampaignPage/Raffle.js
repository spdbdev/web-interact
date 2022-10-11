import './CampaignPage.css'; 
import {InfoCircleOutlined} from '@ant-design/icons'
import { Button, Divider, OutlinedInput, InputAdornment } from '@mui/material';

export default function Raffle({campaignData}){
    return (
        <div className='Card'>
            <div style={{fontSize:30, textDecoration: 'underline'}}><b>Raffle</b></div>
             <div><span className='Highlight'>50</span>x 30 minute interactions</div>
            <div><span className='Highlight'>50</span>winners will be randomly chosen from the ticketholders at the end of the campaign</div>
            <div style={{fontSize:20}}>Ticket cost: <span className='Highlight'>${campaignData?.rafflePrice}</span></div>


            <div>Chance multipler: 1x <a href='#'>learn more</a></div>

            <div className='InfoSection'>
            <InfoCircleOutlined style={{fontSize:30, color:'gray'}}/>
            <div style={{marginRight:-10}}>Remember, the % chance of winning the raffle will go down as more fans join the raffle</div>
            </div>

            <div style={{color:'#782eee'}}>
                <form action="http://localhost:4242/create-raffle-session" method="POST">
                    <Button variant='outlined' style={{borderRadius:0, textTransform: 'none', borderTopRightRadius:11, borderBottomLeftRadius:11}} color='inherit' type="submit">Buy</Button>
                </form>
            </div>
        </div>


    )
}