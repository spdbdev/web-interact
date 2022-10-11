import TopBar from '../../Components/TopBar/TopBar';
import './CampaignPage.css'; 
import {InfoCircleOutlined} from '@ant-design/icons'
import CampaignInfo from '../../Components/CampaignInfo/CampaignInfo';
import raffle from './raffle.png'
import { Button, Divider, OutlinedInput, InputAdornment } from '@mui/material';
import Socials from '../../Components/Socials/Socials';
import TableComponent from '../../Components/TableComponent/TableComponent';
import Leaderboard from '../../Components/Leaderboard/Leaderboard';

function CompaignPage() {
  return (
    <div className="CampaignPage">
      <TopBar />



      <div className='Description'>
        <div style={{fontSize:30, fontWeight:400}}>
          Game &#38; Chat with <span style={{color:'#782eee'}}>Pattedevelours</span> 1-on-1
        </div>
        <div style={{color:'gray', fontSize:20}}>
          Best baguette girl who plays Smite
        </div>
        <div style={{color:'gray', fontSize:20}}>
          Scheduling personal interactions for the next 3 months, don't miss out!
        </div>
        <div  style={{ fontSize:20}}>
          Created on June 7, 2022 || Ends on June 21, 2022
        </div>
      </div>


      <div className='CardContainer'>

          
        <div className='Card' style={{borderWidth:0, padding:0}}>
          <img className='InfluencerVideo' src='https://static.bangkokpost.com/media/content/20200903/c1_3738615.jpg' />
          <div className='InfluencerDescription'>
            <div className='BiddingStats'>
              <div style={{fontSize:30, color:'#782eee', marginLeft:-10, fontWeight:'bold'}}>{'$'}4892</div>
              <Divider style={{color:'#782eee', marginTop:-10}} />
              <div style={{paddingBottom:10}}>Committed of $7000 Goal</div>
              <div><span className='Highlight'>13</span> Bidders</div>
              <div><span className='Highlight'>37</span> Bidders</div>
              <div><span className='Highlight'>2835</span> Watching</div>
              <div ><a href='#' style={{color:'#782eee'}}>Get Notified</a></div>
            </div>
            <div className='Socials'>
              <Socials type='youtube' />
              <Socials type='twitch' />
              <Socials type='tiktok' />
              <Socials type='instagram' />
            </div>
          </div>
        </div>

        <div className='Card'>
          <div style={{fontSize:30, textDecoration: 'underline'}}><b>Raffle</b></div>
          <div><span className='Highlight'>50</span> x 30 Minute Interactions</div>
          <div><span className='Highlight'>50</span> winners will be randomly chosen from the ticketholders at the end of the campaign</div>
          {/* <img src={raffle} alt='raffle' style={{height:100}}/> */}
          <div>Each ticket costs <span className='Highlight'>$1.50</span></div>
          <div style={{display:'flex', alignItems:'center'}}>
            <div style={{paddingRight:20}}>No. of Tickets</div>
            <OutlinedInput
              id="outlined-adornment-amount"
              type='number'
              // startAdornment={<InputAdornment position="start">$</InputAdornment>}
              style={{height:50}}
            />
          </div>

          <div className='InfoSection'>
            <InfoCircleOutlined style={{fontSize:30}}/>
            <div>How does the raffle work? An individual can purchase a max of 1 ticket, giving the chance to win a max of 1 interaction. Each ticket has an equal chance of winning. </div>
          </div>

          <div style={{color:'#782eee'}}>
            <Button variant='outlined' style={{borderRadius:0}} color='inherit'>Buy</Button>
          </div>
        </div>






        <div className='Card'>
          <div style={{fontSize:30, textDecoration: 'underline'}}><b>Auction</b></div>
          <div><span className='Highlight'>20</span> x 30 Minute Interactions</div>
          <div><span className='Highlight'>20</span>/20 have already been bid on, the top bidders win at the end of the campaign</div>
          <div>To bid for more than slot, submit multiple bids</div>
          <div style={{display:'flex', justifyContent:'space-between'}}>
              {/* <div>Original Price: <span class='Highlight'>{'$'}20</span></div> */}
              <div>Current Lowest Price to Win:  <span className='Highlight'>{'$'}30</span></div>
            </div>
          {/* <div style={{display:'flex', alignItems:'center'}}>
            <div style={{paddingRight:20, flex:2, textAlign:'right'}}>Enter number of interactions wanted (1-5) </div>
            <OutlinedInput
              id="outlined-adornment-amount"
              // startAdornment={<InputAdornment position="start">$</InputAdornment>}
              style={{height:50, flex:1}}
            />
          </div> */}
          {/* <div style={{display:'flex', alignItems:'center'}}>
            <div style={{paddingRight:20, flex:2, textAlign:'right'}}>Enter minimum number of interactions wanted </div>
            <OutlinedInput
              id="outlined-adornment-amount"
              // startAdornment={<InputAdornment position="start">$</InputAdornment>}
              style={{height:50, flex:1}}
            />
          </div>
          <div style={{fontSize:15}}>From your selection above, you need to bid <b>$74</b> to be the winning bid for <b>2</b> x 30 minute interactions. We recommend bidding <b>$111</b>, 50% higher, to maximize chances of winning.</div> */}

          <div style={{display:'flex', alignItems:'center'}}>
            <div style={{paddingRight:20}}>Enter bid price {'('}total{')'} </div>
            <OutlinedInput
              id="outlined-adornme nt-amount"
              type="number" 
              inputProps={{ step: ".5" }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              style={{height:50}}
            />
          </div>
          <div className='InfoSection'>
            <InfoCircleOutlined style={{fontSize:30}}/>
            <div style={{fontSize:15}}>How does auto bidding work? Your bid will be at $37 currently, increasing when necessary until your max bid price.</div>
          </div>
          <div style={{color:'#782eee'}}>
            <Button variant='outlined' style={{borderRadius:0}} color='inherit'>Place Bid</Button>
          </div>
        </div>
      </div>




      <div className='BottomSection' style={{paddingLeft:50, paddingRight:50, fontSize:20}}>
        <CampaignInfo style={{width:'60vw'}}/>
        <div style={{padding:50, width:800}}>
          <Leaderboard />
        </div>

      </div>

      <div style={{fontSize:20,  display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div><a href='#'>Refer a friend</a> {' & '} earn 50 {'%'} off!</div>
        <br /><br />
        <div style={{color:'#782eee'}}>
          <Button variant='outlined' style={{borderRadius:0}} color='inherit'>Create an Account</Button>
        </div>

        <div className='Share'>
          <Socials type='discord'/>
          <Socials type='twitter' />
          <Socials type='message' />
          <Socials type='hyperlink' />
        </div>



      </div>

      <br />
      <br />
      <br />
      <TopBar />


      <center style={{color:'gray'}}>Affiliate Program: Refer an influencer {'&'} earn up to $10,000! 5% of their first year of profits will be given to the referrer.</center>
      <center> <br/> some footer stuff <br /> </center>

    </div>
  );
}

export default CompaignPage;
