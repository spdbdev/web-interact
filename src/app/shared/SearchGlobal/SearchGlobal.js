import React, { useEffect } from 'react';
import { Search } from "./style";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { db } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where, startAt, endAt, orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getDateFromTimestamp } from "@interact/Components/utils";
import { Popper } from '@mui/material';

/*
Component for AutoComboDropdown
Developed to change the width of dropdown now
*/
const AutoComboDropDown = function (props) {
  return (
    <Popper {...props} style={{width: props.isonmobile === "true" ? '110px' : '250px'}} />
  )
};

const SearchGlobal = ({ sx }) => {
  let navigate = useNavigate();
  const [value, setValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState([]);
  const [isonmobile, SetOnMobile] = React.useState(window.innerWidth < 550);
  useEffect(() => {
    SetOnMobile(window.innerWidth < 550);
  },[window.innerWidth])
  useEffect(() => {
      const fetchData = setTimeout( async () => {
          if(value){
            const searchkey = value;
            const searchTerm = searchkey;
            const strlength = searchTerm.length;
            const strFrontCode = searchTerm.slice(0, strlength-1);
            const strEndCode = searchTerm.slice(strlength-1, searchTerm.length);
            const endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
            const q = query(collection(db, "users"), orderBy('name'), where("name", ">=", searchTerm), where("name", "<", endCode));
            const doc = await getDocs(q);
            let tempValues = []
            doc.docs.map((user) => {
              let data = user.data();
              let obj = {
                title: data.name,
                description: data.email,
                id: data.uid,
                photoURL: data?.photoURL ? data?.photoURL : "https://iili.io/HH6JxB1.md.jpg",
                type:'profile'
              }
              tempValues.push(obj)
            })
            const searchTermCampaign = searchkey;
            const strlengthCampaign = searchTermCampaign.length;
            const strFrontCodeCampaign = searchTermCampaign.slice(0, strlengthCampaign-1);
            const strEndCodeCampaign = searchTermCampaign.slice(strlengthCampaign-1, searchTermCampaign.length);
            const endCodeCampaign = strFrontCodeCampaign + String.fromCharCode(strEndCodeCampaign.charCodeAt(0) + 1);
            const qCampaign = query(collection(db, "campaigns"), orderBy('title'), where("title", ">=", searchTermCampaign), where("title", "<", endCodeCampaign));
            const docCampaign = await getDocs(qCampaign);
            docCampaign.docs.map((campaign) => {
              let campaign_data = campaign.data();
              let obj = {
                title: campaign_data.title ? campaign_data.title : "No title",
                endDate: campaign_data.endDateTime ? getDateFromTimestamp({
                  timestamp: campaign_data.endDateTime?.seconds,
                  format: "MMM Do"
                }) : "No end date",
                goal:campaign_data.goal ? campaign_data.goal : "No goal",
                goalValue:campaign_data.goalValue ? campaign_data.goalValue : "No goal value",
                username:campaign_data.creatorName ? campaign_data.creatorName : "No username",
                id: campaign.id,
                photoURL: campaign_data?.campaignVideoThumbnailLink ? campaign_data?.campaignVideoThumbnailLink : "https://iili.io/HH6JxB1.md.jpg",
                type:'campaign'
              }
              tempValues.push(obj)
            })
            setSearchValue(tempValues)
          }
      })
      return () => clearTimeout(fetchData)
  },[value])

  const changeSearch = (e) => {
    setValue(e.target.value)
  }

  return (
      <Search sx={sx}>
          <Autocomplete
              id="searchbar_dropdown"
              PopperComponent={(e) => <AutoComboDropDown {...e} isonmobile={isonmobile.toString()} />}
              sx={{ 
                width: "100%",
              }}
              loading={true}
              options={searchValue}
              freeSolo
              onInputChange={(e) => changeSearch(e)}
              getOptionLabel={(option) => (option?.title)?option?.title:""}
              renderOption={(props, option) => (
                <>
                {(option.type === 'profile')?(
                  <Box component="li" {...props} onClick={() => (option.type == "profile")?navigate("/u/"+option.title):"" }>
                    <img
                      loading="lazy"
                      width="40"
                      height="40"
                      src={option.photoURL}
                      alt="No Image"
                      style={{borderRadius:'1000px', marginRight:'10px'}}
                    />
                    {" "+option.title}
                    </Box>
                ):(
                  <Box component="li" {...props} onClick={() => (option.type == "campaign")?navigate("/c/"+option.id):"" }>
                    <img
                      loading="lazy"
                      width="40"
                      height="40"
                      src={option.photoURL}
                      alt="No Image"
                      style={{borderRadius:'1000px', marginRight:'10px'}}
                    />
                    {" "+option.title+" - "+option.endDate+" - "+option.goal+" - "+option.username}
                    </Box>
                )}
                </>
              )}
              renderInput={(params) => (
                  <TextField
                    sx={{
                      "& .MuiAutocomplete-inputRoot": {
                        borderRadius: "50px",
                        width: isonmobile ? '130px' : '280px',
                        maxHeight:'40px',
                        padding:'0', 
                        boxShadow: '2px 2px 9.69px -1px #D3D3D3',
                      },
                      "& .MuiAutocomplete-inputRoot fieldset": {
                        borderColor: "lightgray"
                      },
                      "& .MuiAutocomplete-inputRoot input": {
                        marginLeft: '15px',
                      },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#c5a5f8"
                        }
                      },
                    
                      "& .MuiAutocomplete-inputRoot input::placeholder": {
                        textAlign: "center",
                      },
                      "& .MuiAutocomplete-endAdornment": {
                        marginRight: '10px'
                      },
                      "& .MuiAutocomplete-endAdornment button svg": {
                        width: '16px',
                        height: '16px'
                      }
                    }}
                    {...params}
                  />
              )}
          />
      </Search>
    );
};

export default SearchGlobal;
