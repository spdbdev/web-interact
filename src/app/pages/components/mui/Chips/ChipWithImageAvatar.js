import React from 'react';
import {Avatar, Chip} from "@mui/material";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import code from "../Chips/demo-code/chip-image-avatar.txt";
import {ASSET_AVATARS} from "../../../../utils/constants/paths";
import {getAssetPath} from "../../../../utils/appHelpers";

const ChipWithImageAvatar = () => {
    return (
        <JumboDemoCard
            title={"Chip With Image Avatar"}
            demoCode={code}
            wrapperSx={{backgroundColor: 'background.paper', pt: 0}}
        >
            <Chip
                avatar={<Avatar alt="Natacha" src={getAssetPath(`${ASSET_AVATARS}/avatar11.jpg`, "24x24")}/>}
                label={"Image Avatar"}
            />
        </JumboDemoCard>
    );
};

export default ChipWithImageAvatar;
