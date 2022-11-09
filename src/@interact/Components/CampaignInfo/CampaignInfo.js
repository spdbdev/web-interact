import "./CampaignInfo.css";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Accordion,  AccordionSummary, AccordionDetails} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import TableComponent from "../TableComponent/TableComponent";
// import Faq from "../Faq/Faq";
// import Comments from "../Comments/Comments";
import Supporters from "../Supporters/Supporters";

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

function CampaignInfo({ campaignData, comments, supporters, campaignId }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


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
          {/* <Comments comments={comments} campaignId={campaignId}/> */}
        </AccordionDetails>
      </Accordion>

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
