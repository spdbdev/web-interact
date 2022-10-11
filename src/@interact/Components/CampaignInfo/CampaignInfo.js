import './CampaignInfo.css';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableComponent from '../TableComponent/TableComponent';
import Faq from '../Faq/Faq';
import Comments from '../Comments/Comments';
import Supporters from '../Supporters/Supporters';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function CampaignInfo({campaignData, comments, supporters, campaignId}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    
    <div className='InfoContainer'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', color:'#782eee' }}>
  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"  
   textColor="inherit" indicatorColor="secondary">
    <Tab label="Campaign Info"  color='inherit'/>
    <Tab label="Comments"/>
    <Tab label="Supporters"/>
  </Tabs>
</Box>
    <TabPanel value={value} index={0}>
          <div>
            {campaignData?.info?.description}
              {/* <ul>
                  <li>
                    Voice chat via Discord or Zoom meeting; you get to appear on stream! 
                  </li>
                  <li>
                    30 minute interactions allow us to play a full game of Smite
                  </li>
                  <li>
                      If goal is reached I'll make a special crit madness video for yall {'&'} blow you a kiss. If the goal isn't reached we'll still personally interact if you won an interaction, just no kisses :{'('}
                  </li>
              </ul>

              Hi squad fam! I'm Pav, your favorite french Smite streamer. I'd love to connect and learn more about you (tell me your life story) while we own some baguette-hating scrubs in Smite or play a 1v1 (hehe, I won't lose). The money raised from this campaign will support my stream, and allow me to keep making you guys laugh everyday.
              <br /><br />
              Beware that I have no obligation to carry out these interactions if a fan is rude {'&'} can ban a fan at any time if there is, what I deem, inappropriate behavior (e.g. racism, homophobia, sexism). No place for hate
                
                   */}
          </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Comments comments={comments} campaignId={campaignId}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Supporters supporters={supporters} campaignId={campaignId}/>
      </TabPanel>
    </div>
  );
}

export default CampaignInfo;
