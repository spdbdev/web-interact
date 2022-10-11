import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextField } from "@mui/material";
export default function FAQAccordian() {

  const q1 = "What can we do in an interaction?";
  const a1 = "Default: Laugh, play games, and chat together! Show me something cool about you!"
  const q2 = "How are interactions carried out?";
  const a2 = "Zoom, Google Meet & Discord (link a server, automatically gives fans the special role so they can join the private chat; special roles are removed after the interaction is over). The creator may stream it live or record it and upload highlights publicly."

  return (
    <div>
      <Accordion>
        
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{q1}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <TextField fullWidth defaultValue={a1} id="standard-basic" variant="standard" ></TextField>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>{q2}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{a2}</Typography>
        </AccordionDetails>
      </Accordion>
      <br />
    </div>
  );
}
