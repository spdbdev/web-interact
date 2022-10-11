import * as React from "react";

import { Container, Input } from "@mui/material";
import TextField from "@mui/material/TextField";

import GridContents from "./GridContents";

import DTPicker from "./DateTimePicker";
import BasicSelect from "./SelectCampaign";
export default function Header() {
  return (
    <Container>
      <div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            paddingBottom: 10,
            paddingTop: 20,
          }}
        >
          Create a new campaign
        </div>
        {/* <div style={{ fontSize: 26, fontWeight: 400 }}>
          Title: <span style={{ color: "lightgray" }}>name your campaign</span>
        </div>

        */}

        <div style={{ fontSize: 26, fontWeight: 400 }}>
          Title:{" "}
          <span style={{ color: "lightgray" }}>
            {" "}
            <Input placeholder="name your campaign" />{" "}
            {/* figure out how to make this bigger */}
          </span>
        </div>

        <div style={{ fontSize: 26, fontWeight: 400 }}>
          Category: <BasicSelect />{" "}
        </div>

        <div style={{ fontSize: 26, fontWeight: 400 }}>
          Start date: <DTPicker />
        </div>

        <div style={{ fontSize: 26, fontWeight: 400 }}>
          Campaign duration: <DTPicker />
        </div>
      </div>
    </Container>
  );
}
