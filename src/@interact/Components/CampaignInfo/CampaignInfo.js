import "./CampaignInfo.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Accordion,  AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { db } from "@jumbo/services/auth/firebase/firebase";
// import TableComponent from "../TableComponent/TableComponent";
// import Faq from "../Faq/Faq";
// import Comments from "../Comments/Comments";
import Supporters from "../Supporters/Supporters";
import { getDocs,collection } from "firebase/firestore";
import Comments from "../Comments/Comments";

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

function CampaignInfo({ campaignData, comments, campaignId,bids,giveaways,isCampaignEnded }) {
  const [value, setValue] = React.useState(0);
  const [supporters,setSupporters] = React.useState([]);
  const [winners, setWinners] = React.useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function getSupporters(){
    let bidsItems = bids.map((bid)=>{
      return {price:bid.price,...bid.person};
    })
    let items = [...giveaways,...bidsItems];
    items = items.sort(function(a, b){return b.price - a.price});
    setSupporters(items);
  }

  const getWinners =async function(){
    const giveawayWinners = await getDocs(collection(db, "campaigns", campaignId, "GiveawayWinners"));
    let giveawayWinnersList = [];
    giveawayWinners.forEach((doc)=>{
      giveawayWinnersList.push(doc.data());
    })
    giveawayWinnersList = giveawayWinnersList.map((item)=>{ return {...item.person}});

    const normalAuctionWinners = await getDocs(collection(db, "campaigns", campaignId, "normalAuctionWinners"));
    let normalAuctionWinnersList = [];
    normalAuctionWinners.forEach((doc)=>{
      normalAuctionWinnersList.push(doc.data());
    })
    normalAuctionWinnersList = normalAuctionWinnersList.map((item)=>{ return {...item.person}});

    const top3AuctionWinners = await getDocs(collection(db, "campaigns", campaignId, "top3AuctionWinners"));
    let top3AuctionWinnersList = [];
    top3AuctionWinners.forEach((doc)=>{
      top3AuctionWinnersList.push(doc.data());
    })
    top3AuctionWinnersList = top3AuctionWinnersList.map((item)=>{ return {...item.person}});

    let allWinners = [...giveawayWinnersList,...normalAuctionWinnersList,...top3AuctionWinnersList];
    setWinners(allWinners);
  }

  React.useEffect(()=>{
    getSupporters();
    if(isCampaignEnded) getWinners();
  },[bids,giveaways]);

  return (
    <div className="InfoContainer">
      <Accordion style={{backgroundColor:"transparent"}} defaultExpanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{color:"#782eee",textTransform:'uppercase',fontWeight:'500'}}>
          Campaign Info
        </AccordionSummary>
        <AccordionDetails>{campaignData?.info?.description}</AccordionDetails>
      </Accordion>

      <Accordion style={{backgroundColor:"transparent"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{color:"#782eee",textTransform:'uppercase',fontWeight:'500'}}>
          Comments
        </AccordionSummary>
        <AccordionDetails>
          <Comments comments={comments} campaignId={campaignId}/>
          {/* <Comments comments={comments} campaignId={campaignId}/> */}
        </AccordionDetails>
      </Accordion>

      {isCampaignEnded && <Accordion style={{backgroundColor:"transparent"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{color:"#782eee",textTransform:'uppercase',fontWeight:'500'}}>
          Winners
        </AccordionSummary>
        <AccordionDetails>
          <Supporters supporters={winners} campaignId={campaignId} />
        </AccordionDetails>
      </Accordion>}

      <Accordion style={{backgroundColor:"transparent"}}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{color:"#782eee",textTransform:'uppercase',fontWeight:'500'}}>
          Supporters
        </AccordionSummary>
        <AccordionDetails>
          <Supporters supporters={supporters} campaignId={campaignId} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default CampaignInfo;
