import React, { useEffect, useState, Suspense } from "react";
import { IconButton } from "@mui/material";
import JumboVerticalNavbar from "@jumbo/components/JumboVerticalNavbar/JumboVerticalNavbar";
import { DrawerHeader } from "@jumbo/components/JumboLayout/style";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { useJumboLayoutSidebar, useJumboSidebarTheme } from "@jumbo/hooks";
import { SIDEBAR_STYLES, SIDEBAR_VIEWS } from "@jumbo/utils/constants/layout";
import Logo from "../../../../shared/Logo";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Zoom from "@mui/material/Zoom";
import Div from "@jumbo/shared/Div";
import SidebarSkeleton from "./SidebarSkeleton";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useCurrentUser from "@interact/Hooks/use-current-user";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import {
  fetchUsersByIds,
  fetchRecentCampaigns,
  followUser,
} from "../../../../../firebase";
import { getDateFromTimestamp } from "@interact/Components/utils";

const Sidebar = () => {
  let { user } = useCurrentUser();
  const Swal = useSwalWrapper();
  const defaultPhotoURL =
    "https://iili.io/HH6JxB1.md.jpg";
  const [followingList, setFollowingList] = useState([]);
  const [recentCampaignList, setRecentCampaignList] = useState([]);

  const getFollowingList = async () => {
    if(user?.following) {
      try {
        const returnedValue = await fetchUsersByIds(user?.following);
        let followingItemGroup = [];
        for (let i = 0; i < returnedValue.length; i++) {
          let data = {
            uri: "/u/" + returnedValue[i].name,
            label: returnedValue[i].name,
            type: "nav-item",
            icon: (
              <RemoveCircleOutlineIcon
                onClick={() => handleUserItemClick(returnedValue[i])}
                sx={{ fontSize: 20 }}
              />
            ),
            photoURL: returnedValue[i]?.photoURL
              ? returnedValue[i]?.photoURL
              : defaultPhotoURL,
          };
          followingItemGroup.push(data);
        }
        setFollowingList(followingItemGroup);
      } catch (e) {
        setFollowingList([]);
      }
    }else {
      setFollowingList([]);
    }
    
  }

  const getRecentCampaignList = async () => {
    if(user?.recentCampaignData) {
      try {
        const returnedValue = await fetchRecentCampaigns(
          user?.recentCampaignData
        );
        let recentCampaignItemGroup = [];
        for (let i = 0; i < returnedValue.length; i++) {
          let data = {
            campaignUri: returnedValue[i]?.id
              ? "/c/" + returnedValue[i]?.id
              : "/c/",
            label: returnedValue[i]?.header?.title
              ? returnedValue[i]?.header?.title
              : "No title",
            creator_label: returnedValue[i].endDate ? getDateFromTimestamp({
                timestamp: returnedValue[i].endDate?.seconds,
                format: "MMM Do"
              }) : "No enddate",
            creator_name: returnedValue[i]?.person?.username
              ? returnedValue[i]?.person?.username
              : "No name",
            creator_Uri: returnedValue[i]?.person?.username
              ? "/u/" + returnedValue[i]?.person?.username
              : "/u",
            type: "recent-campaign-item",
            photoURL: returnedValue[i]?.person?.photoUrl
              ? returnedValue[i]?.person?.photoUrl
              : defaultPhotoURL,
          };
          recentCampaignItemGroup.push(data);
        }
        setRecentCampaignList(recentCampaignItemGroup);
      } catch (e) {
        setRecentCampaignList([]);
      }
    }else {
      setRecentCampaignList([]);
    }
    
  }
  useEffect(() => {
    getFollowingList();
  }, [user?.following]);

  useEffect(() => {
    getRecentCampaignList();
  }, [user?.recentCampaignData]);

  const handleUserItemClick = (targetUser) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will unfollow this user once you approve.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        if (user && targetUser) {
          followUser(user, targetUser, false);
          //Swal.fire("Success!", "You have unfollowed.", "success");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //Swal.fire("Cancelled", "You are still following that user", "success");
      }
    });
  };

  const interactMenus = [
    {
      label: " ",
      type: "section",
      children: [
        {
          uri: user?.name ? "/u/"+user?.name : "/u/",
          label: "Profile",
          type: "nav-item",
          icon: <PersonOutlineIcon sx={{ fontSize: 20 }} />,
        },
        {
          uri: "/a/what-is-interact",
          label: "Start a campaign",
          type: "nav-item",
          icon: <EditOutlinedIcon sx={{ fontSize: 20 }} />,
        },
      ],
    },

    {
      label: "Following",
      type: "section",
      children: followingList,
    },
    {
      label: "Recent campaigns",
      type: "section",
      children: recentCampaignList,
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "url('/images/navbar-background.svg')",
        height: '100%'
      }}
    >
      <SidebarHeader />
      <JumboScrollbar autoHide autoHideDuration={200} autoHideTimeout={500}>
        <Suspense
          fallback={
            <Div
              sx={{
                display: "flex",
                minWidth: 0,
                alignItems: "center",
                alignContent: "center",
                px: 3,
              }}
            >
              <SidebarSkeleton />
            </Div>
          }
        >
          <JumboVerticalNavbar translate items={interactMenus} />
        </Suspense>
      </JumboScrollbar>
    </div>
  );
};

const SidebarHeader = () => {
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const isMiniAndClosed = React.useMemo(() => {
    return sidebarOptions?.view === SIDEBAR_VIEWS.MINI && !sidebarOptions?.open;
  }, [sidebarOptions.view, sidebarOptions.open]);

  const { sidebarTheme } = useJumboSidebarTheme();
  useEffect(() => {
    setSidebarOptions({ open: true });
  }, []);

  return (
    <React.Fragment>
      {sidebarOptions?.style !== SIDEBAR_STYLES.CLIPPED_UNDER_HEADER && (
        <DrawerHeader>
          <Logo mini={isMiniAndClosed} mode={sidebarTheme.type} />
          {
            <Zoom in={sidebarOptions?.open}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ ml: 0, mr: -1.5,zIndex:100 }}
                onClick={() =>
                  setSidebarOptions({ open: !sidebarOptions.open })
                }
              >
                <MenuOpenIcon />
              </IconButton>
            </Zoom>
          }
        </DrawerHeader>
      )}
    </React.Fragment>
  );
};

export default Sidebar;
