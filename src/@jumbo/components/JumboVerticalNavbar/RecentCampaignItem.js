import React from 'react';
import {Link as RouterLink, useLocation} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import {SIDEBAR_VIEWS} from "@jumbo/utils/constants/layout";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import CustomMarquee from './CustomMarquee';
const menuBefore = {
    left: 0,
    top: 0,
    content: `''`,
    position: 'absolute',
    display: 'inline-block',
    width: '4px',
    height: '100%',
    backgroundColor: 'transparent'
}

const RecentCampaignItem = ({item, isNested, translate}) => {
    const location = useLocation();
    const {sidebarOptions} = useJumboLayoutSidebar();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const isMiniAndClosed = React.useMemo(() => {
        return sidebarOptions?.view === SIDEBAR_VIEWS.MINI && !sidebarOptions?.open;
    }, [sidebarOptions.view, sidebarOptions.open]);

    const label = React.useMemo(() => {
        return translate ? t(item.label) : item.label;
    }, [item, translate, t]);

    if (!item) return null;

    return (
        <ListItemButton
            component={"li"}
            style={{padding:'8px 30px'}}
            onClick={()=>navigate(item?.campaignUri)}
            sx={{
                p: 0,
                overflow: 'hidden',
                borderRadius: isMiniAndClosed ? '50%' : '0 24px 24px 0',
                margin: isMiniAndClosed ? '0 auto' : '0',
                ...(isMiniAndClosed) ? {width: 40, height: 40, justifyContent: 'center'} : {},
                ...(!isMiniAndClosed) ? {'&::before': menuBefore} : {},
                '&:hover': {
                    color: theme => theme.palette.nav.action.hover,
                    backgroundColor: theme => theme.palette.nav.background.hover,
                    ...(!isMiniAndClosed) ? {'&::before': {
                            ...menuBefore,
                            backgroundColor: theme => theme.palette.nav.tick.hover,
                        }} : {}
                },
                ...(location.pathname === item.campaignUri) ? {
                    color: theme => theme.palette.nav.action.active,
                    backgroundColor: theme => theme.palette.nav.background.active,
                    ...(!isMiniAndClosed) ? {'&::before': {
                        ...menuBefore,
                            backgroundColor: theme => theme.palette.nav.tick.active,
                    }}: {},
                } : {},
            }}
        >
            <div
                style={{
                    display: "flex",
                    paddingRight: "12%",
                    alignItems: "center",
                }}
                >
                <img
                    src={item?.photoURL}
                    alt={'No Image'}
                    style={{
                        objectFit: "cover",
                        width: 35,
                        height: 35,
                        borderRadius: 2,
                    }}
                />
            </div>
            <div style={{overflow:'hidden',height:'40px'}}>
                <CustomMarquee
                    text={label}
                >
                </CustomMarquee>
                <ListItemText
                    primary={
                    <>
                        <span style={{color:'black'}}>
                            {item?.creator_label}&nbsp;
                        </span>
                        <a href={item?.creator_Uri} >
                            {item?.creator_name}
                        </a> 
                    </>
                }
                    sx={{
                        m: 0,
                        '& .MuiTypography-root': {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '10px',
                        }
                    }}
                >
                    
                </ListItemText>
            </div>
        </ListItemButton>
    );
};

export default RecentCampaignItem;
