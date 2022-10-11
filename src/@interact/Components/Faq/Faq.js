import './Faq.css';
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function Faq({campaignData}) {


  const FAQs = campaignData?.info?.faq;


  return (
    <div>
      <h3 style={{color:'#782eee'}}>FAQ</h3>
      {FAQs?.map(faq => <FaqElem faq={faq}/>)}
    </div>
  );
}

export default Faq;


function FaqElem({faq}){
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        {faq.q}
      </AccordionSummary>
      <AccordionDetails>
        {faq.a}
      </AccordionDetails>
    </Accordion>
  )
}
