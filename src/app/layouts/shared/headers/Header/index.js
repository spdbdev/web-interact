import React from "react";
import Stack from "@mui/material/Stack";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import AuthUserDropdown from "../../../../shared/widgets/AuthUserDropdown";
import NotificationsDropdown from "../../../../shared/NotificationsDropdown";
import MessagesDropdown from "../../../../shared/MessagesDropdown";
import SearchGlobal from "../../../../shared/SearchGlobal";
import { IconButton, Slide, useMediaQuery } from "@mui/material";
import Div from "@jumbo/shared/Div";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { SIDEBAR_STYLES } from "@jumbo/utils/constants";
import { useJumboHeaderTheme } from "@jumbo/hooks";
import { Link,useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import {auth } from "@jumbo/services/auth/firebase/firebase";
import {useState,useEffect} from 'react'
// import { useAuthState } from "react-firebase-hooks/auth";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const [dropdownSearchVisibility, setDropdownSearchVisibility] =
    React.useState(false);
  const { headerTheme } = useJumboHeaderTheme();

  auth.onAuthStateChanged(user=>{
    console.log('onAuthStateChanged');
    console.log(user);
      setIsLoggedIn(!!user);
  });
// useEffect(() => {
//   console.log('Logged In User Auth');
//       console.log(auth);
//       setIsLoggedIn(!!auth.currentUser);
//         console.log(isLoggedIn);
//       console.log(!isLoggedIn);
// },[isLoggedIn,auth]);

  return (
    <React.Fragment>
      {(sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER ||
        (sidebarOptions.style !== SIDEBAR_STYLES.CLIPPED_UNDER_HEADER &&
          !sidebarOptions?.open)) && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              ml:
                sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER
                  ? -2
                  : 0,
              mr: 3,
            }}
            onClick={() => setSidebarOptions({ open: !sidebarOptions.open })}
          >
            {sidebarOptions?.open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        )}

      <Slide in={dropdownSearchVisibility}>
        <Div
          sx={{
            zIndex: 5,
            left: 0,
            right: 0,
            position: "absolute",
            height: "100%",
            width:"100%"
          }}
        >
          <SearchGlobal
            sx={{
              maxWidth: "none",
              height: "100%",
              display: "flex",
              width:"100%",

              "& .MuiInputBase-root": {
                flex: 1,
                borderRadius: 0,
                background: (theme) => theme.palette.background.default,
              },
              "& .MuiInputBase-input": {
                pr: 6,
              },
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              right: 15,
              top: "50%",
              color: "inherit",
              transform: "translateY(-50%)",
            }}
            onClick={() => setDropdownSearchVisibility(false)}
          >
            <CloseIcon />
          </IconButton>
        </Div>
      </Slide>
      <Link to="/campaign" style={{textDecoration: 'none'}}>
        <Button variant={"contained"}>Start a campaign</Button>
      </Link>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{ ml: "auto" }}
      >
        <JumboIconButton
          elevation={25}
          onClick={() => setDropdownSearchVisibility(true)}
        >
          <SearchIcon fontSize={"small"} />
        </JumboIconButton>

        {isLoggedIn &&
        <>
        <NotificationsDropdown />
        <AuthUserDropdown/>
        </>}
        {!isLoggedIn &&
        <Link to="/interact/signin" style={{textDecoration: 'none'}}>
          <Button variant={"contained"}>Sign In</Button></Link>}
      </Stack>
    </React.Fragment>
  );
};

export default Header;
