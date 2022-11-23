import "./CampaignPage.css";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  OutlinedInput,
  InputAdornment,
  Typography,
  Box,
  Stack,
  Grid 
} from "@mui/material";
import moment from "moment";
import { getDateFromTimestamp } from "app/utils";
import Span from "@jumbo/shared/Span";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { light } from "@mui/material/styles/createPalette";
import {localizationServices} from "app/services/localization"
export default function Header({ campaignData }) {
  const numInteractions = Number(campaignData.numAuctionInteractions ?? 0) + Number(campaignData.numGiveawayInteractions ?? 0);
  return (
    <div className="Description">
      <Typography
        variant="h3"
        py={0}
        mb={0}
        style={{ fontSize: 30, fontWeight: 400 }}
      >
        {campaignData?.title}
      </Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 18 }}>
        Created by
        {
          campaignData?.person?.photoUrl ?
            <img
                src={campaignData?.person?.photoUrl}
                alt={'No Image'}
                align="center"
                className="profile_image"
                style={{
                    objectFit: "cover",
                    width: 35,
                    height: 35,
                    borderRadius: 1000,
                    marginLeft: "5px",
                }}
            >
            </img>
            :
            <></>
        }
        <a href={`/u/${campaignData?.person?.username}`} style={{ color: "#782fee" }}>
          {campaignData?.person?.username}
        </a>
      </Typography>
      <Divider />
      <Stack direction="column">
        <Typography py={0}>
          <Span>
            {numInteractions} interactions will be carried out from{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.interactionStartDateTime?.seconds,
            })}{" "}
            to{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.interactionEndDateTime?.seconds,
            })}
            , don't miss out!
          </Span>
          <br />
          <Span>
            Campaign ends at{" "}
            {getDateFromTimestamp({
              timestamp: campaignData?.endDateTime?.seconds,
              format: ` h:mm a [${localizationServices.getDeviceTimezone()} on] dddd, MMMM Do YYYY`,
            })}
          </Span>
        </Typography>
      </Stack>
      <br></br>
      <InteractFlashyButton
        >
          Ends {moment.unix(campaignData?.endDate?.seconds).toNow()}
      </InteractFlashyButton>
    </div>
  );
}
