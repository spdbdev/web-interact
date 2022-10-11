
import './UserProfilePage.css'
import CampaignSnippet from '../../Components/CampaignSnippet/CampaignSnippet';
import Button from '../../Components/Button/Button';
import MeetingBlocks from './MeetingBlocks';
import { useEffect, useRef } from 'react';




function FollowedCampaigns() {


  const currentCampaigns = [1, 2, 3,];

  const meetingBlockRef = useRef(null);
  useEffect(()=>{
    meetingBlockRef.current.scrollTo(360*4, 0)
  }, [])
  
  return (
    <div style={{paddingLeft:100}}>
      <div ref={meetingBlockRef} className='horizontalScroll' style={{display:'flex', overflowX:'scroll', padding:20, marginLeft:-120, paddingLeft:140, marginRight:-20 }}>
        <MeetingBlocks passed={true}/>
        <MeetingBlocks passed={true} /><MeetingBlocks passed={true}  /><MeetingBlocks passed={true}  /><MeetingBlocks /><MeetingBlocks /><MeetingBlocks /><MeetingBlocks /><MeetingBlocks /><MeetingBlocks />
      </div>
      <div style={{margin:20}}><Button title='+ Create new campaign' onClick={()=>alert('pressed')} style={{paddingLeft:200}}/></div>
      <div>
          <div style={{marginLeft:20,textDecorationLine: 'underline'}}>Interactions acquired</div>
          <div style={{display:'flex', justifyContent:'flex-start', flexWrap:'wrap'}}>
              {currentCampaigns.map((x, i)=><CampaignSnippet key={i} info={x}/>)}
          </div>
          <br />
      </div>
      <div>
          <div style={{marginLeft:20, textDecorationLine: 'underline'}}>Following campaigns</div>
          <div style={{display:'flex', justifyContent:'flex-start', flexWrap:'wrap'}}>
              {currentCampaigns.map((x, i)=><CampaignSnippet key={i} info={x}/>)}
          </div>
          <br />
      </div>
      <div>
          <div style={{marginLeft:20, textDecorationLine: 'underline'}}>Supported campaigns</div>
          <div style={{display:'flex', justifyContent:'flex-start', flexWrap:'wrap'}}>
              {currentCampaigns.map((x, i)=><CampaignSnippet key={i} info={x}/>)}
          </div>
          <br />
      </div>
    </div>
  );
}

export default FollowedCampaigns;

