import React from 'react';
import Div from "@jumbo/shared/Div";
import Link from "@mui/material/Link";
import {ASSET_IMAGES} from "../../utils/constants/paths";


const Logo = ({mini, mode, sx}) => {
    return (
        <Div sx={{display: "inline-flex", ...sx}}>
            <Link href={'/'}>
                {
                    !mini ?
                        <img width="110" height="30" src={ mode === "light" ? `${ASSET_IMAGES}/blankLogoFiller.png` : `${ASSET_IMAGES}/blankLogoFiller.png`} alt="logo" />
                        :
                        <img width="40" height="30" src={mode === "light" ? `${ASSET_IMAGES}/blankLogoFiller.png` : `${ASSET_IMAGES}/blankLogoFiller.png`} alt="logo" />
                }
            </Link>
        </Div>
    );
};

Logo.defaultProps = {
    mode: "light"
};

export default Logo;
