import TopBar from "../../Components/TopBar/TopBar";
import Header from "./Header";
import GridContents from "./GridContents";

import { Container, Input } from "@mui/material";

function CreateCampaignPage() {
  return (
    <div className="CreateCampaignPage">
      <TopBar />

      <Header />
      <Container>
        <GridContents />
      </Container>
    </div>
  );
}

export default CreateCampaignPage;
