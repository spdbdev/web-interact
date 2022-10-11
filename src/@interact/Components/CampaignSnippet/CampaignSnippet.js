
import './CampaignSnippet.css'
export default function CampaignSnippet() {

    return (
      <div className='CampaignSnippetContainer card'>
        <img style={{width:'100%', height:170, 
        borderBottomWidth:5, borderTopRightRadius:11, borderBottomStyle:'solid', borderBottomColor:'#782fee'
      }}src='https://clips-media-assets2.twitch.tv/AT-cm%7C861811248-preview-480x272.jpg'/>
        <div className='infoContainer'>
          <div style={{fontWeight:600}}>Limited interactions<span style={{fontSize:15, fontWeight:'regular'}}> - I will eat 100 hotdogs at $5000</span></div>
          <div style={{fontSize:12, fontWeight:'bold', color:'#777'}}>by Friday, 26 August 2022</div>
          
          <br />
          <div>Play minecraft with me 1 on 1</div>
        </div>
        <div style={{bottom:20, left:20, position:'absolute',}}>Created by <a href='#' style={{ color:'#aaa'}}>Pattedevelours</a></div>
      </div>
    )
}

