import './CampaignPage.css';

export default function CreatorName({campaignData}){
    // console.log('campaignData in creator name', campaignData)
    return (
        <div style={{display:'flex', paddingLeft:20, alignItems:'center', paddingTop:25}}>
            <div style={{fontSize:25, paddingRight:20}}>Created by <a href='#' style={{color:'#782fee'}}>{campaignData?.creator?.username}</a></div>
            <img alt='creatorProfilePic' src={campaignData?.creator?.photoUrl}
            style={{borderRadius:1000, width:50, height:50}}/>
        </div>

    )
}