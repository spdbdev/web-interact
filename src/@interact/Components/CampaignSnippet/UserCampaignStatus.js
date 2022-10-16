import React from "react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { ASSET_AVATARS } from "app/utils/constants/paths";
import { Icon } from "@iconify/react";

export default function UserCampaignStatus({
  userAuctionPosition,
  userGiveawayWinChance,
  auctionLeaderboardSpots,
  showUserAvatar,
  isCampaignFinished,
  hasUserWonGiveaway,
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {showUserAvatar ? (
        <Avatar alt="user_profile_pic" src={`${ASSET_AVATARS}/avatar7.jpg`} />
      ) : null}
      <Stack direction="column" spacing={0.5}>
        {userAuctionPosition ? (
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={1}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 2,
              backgroundColor: "divider",
            }}
          >
            {!showUserAvatar ? (
              <Icon icon="iconoir:leaderboard-star" fontSize={20} />
            ) : null}
            {userAuctionPosition > auctionLeaderboardSpots ? (
              <Typography variant="caption">
                {isCampaignFinished
                  ? "Sorry, you didn't win an interaction."
                  : "You're no longer on the leaderboard."}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                }}
              >
                {isCampaignFinished
                  ? `You finished in ${userAuctionPosition}th place, you've received an
                interaction!`
                  : `You're in ${userAuctionPosition}th place, you'll receive an
                interaction!`}
              </Typography>
            )}
          </Stack>
        ) : null}
        {userGiveawayWinChance ? (
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={1}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 2,
              backgroundColor: "divider",
            }}
          >
            {!showUserAvatar ? (
              <Icon icon="iconoir:mail" fontSize={20} />
            ) : null}
            <Typography
              variant="caption"
              sx={{
                color:
                  hasUserWonGiveaway && isCampaignFinished
                    ? "primary.main"
                    : "text.primary",
              }}
            >
              {isCampaignFinished
                ? hasUserWonGiveaway
                  ? "You've won the giveaway, so you get an interaction!"
                  : "Sorry, looks like you didn't win the giveaway."
                : `You've entered the giveaway with a ${userGiveawayWinChance}% chance
              of winning!`}
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
