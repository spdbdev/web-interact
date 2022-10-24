import React, { useEffect } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from "./style";
import SearchIcon from "@mui/icons-material/Search";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where, startAt, endAt, orderBy } from "firebase/firestore";


const SearchGlobal = ({ sx }) => {

  const [value, setValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState([]);

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
                let obj = {
                  title: user.data().name,
                  description: user.data().email
                }
                tempValues.push(obj)
              })
  
              const searchTermCampaign = searchkey;
              const strlengthCampaign = searchTermCampaign.length;
              const strFrontCodeCampaign = searchTermCampaign.slice(0, strlengthCampaign-1);
              const strEndCodeCampaign = searchTermCampaign.slice(strlengthCampaign-1, searchTermCampaign.length);
              const endCodeCampaign = strFrontCodeCampaign + String.fromCharCode(strEndCodeCampaign.charCodeAt(0) + 1);
              const qCampaign = query(collection(db, "campaigns"), orderBy('header.title'), where("header.title", ">=", searchTermCampaign), where("header.title", "<", endCodeCampaign));
              const docCampaign = await getDocs(qCampaign);
              docCampaign.docs.map((campaing) => {
                let obj = {
                  title: campaing.data().header.title,
                  description: campaing.data().header.tagline1
                }
                tempValues.push(obj)
              })
              setSearchValue(tempValues)
            }
            
        })

        return () => clearTimeout(fetchData)
        
    },[value])

    const changeSearch = (e) => {
      console.log('e', e)
      setValue(e.target.value)
    }

    return (
        <Search sx={sx}>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>

            <Autocomplete
                id="country-select-demo"
                sx={{ width: 300 }}
                loading={true}
                options={searchValue}
                autoHighlight
                freeSolo
                onInputChange={(e) => changeSearch(e)}
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <>{option.title}</>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                    />
                )}
            />
        </Search>
    );
};

export default SearchGlobal;
