// import TableComponent from '../TableComponent/TableComponent';
import "./Leaderboard.css";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import TablePagination from '@mui/material/TablePagination';
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import { DataGrid } from '@mui/x-data-grid'
import medal1 from "./medal1.png";
import medal2 from "./medal2.png";
import medal3 from "./medal3.png";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Divider, Link, Stack, Typography,Grid } from "@mui/material";
import InfoTooltip from "../InfoTooltip";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import JumboCardFeatured from "@jumbo/components/JumboCardFeatured";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import { formatDate, formatMoney } from "../utils";

const columns = [
  { field: "id", headerName: "No", width: 50 },
  {
    field: "username",
    headerName: "Username",
    width: 120,
  },
  {
    field: "bidPrice",
    headerName: "Bid price",
    width: 90,
    renderCell: (p) => <span>$ {p.value}</span>
  },
  {
    field: "bidTime",
    headerName: "Bid time",
    width: 180,
    renderCell: (d) => formatDate(d.value)
  },
];


export default function Leaderboard({ campaignData, bids }) {
  const minBid = 1.0; // assume bids smaller than min bid will not be acceoted
  const numAuctions = 20; // Number of bids to show on leaderboard

  const parseLeaderboard = (bids) => {
    console.log("parsing");

    bids = bids?.map((x, i) => {
      return {
        id: i + 1,
        username: x.person.username,
        bidPrice: x.auto
          ? i == bids.length - 1
            ? minBid
            : formatMoney(Math.min(x.price, parseFloat(bids[i + 1].price) + 0.5))
          : formatMoney(x.price),
        bidTime: new Date(x.time?.seconds * 1000).toString(),
      };
    });

    //console.log(bids);
    bids = bids.slice(0, campaignData.numAuctionInteractions);
    return bids;
  };
  useEffect(()=>{
    document.getElementById("jumboCardQuick").onmousemove = e => {
      for(const card of document.getElementsByClassName("jumboCardQuick")) {
        const rect = card.getBoundingClientRect(),
       
              x = e.clientX - rect.left,
              y = e.clientY - rect.top;
    
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      };
    }
  })
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(parseLeaderboard(bids));
  }, [bids]);

  return (
    <JumboCardQuick sx={{ flex: 1,mr:1 }} className="jumboCardQuick" id="jumboCardQuick">
      <Box style={{height:"100%"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ mr: 1, mb: 0 }}>
          Leaderboard
        </Typography>
        <InfoTooltip title="If you’re on the leaderboard at the end of the campaign, 
        you will receive a premium interaction, occurring before all other interactions
        (before winners from the giveaway); otherwise, if you are overthrown from the
        leaderboard by the end of the campaign, you are not charged" />
      </Box>
      <Box style={{marginTop:'1rem',height:"100%"}}>
        {bids?.length > 0 ? (
          <Grid container spacing={1} style={{height:"95%"}}>
            <Grid item xs={3}>
              {/* <span style={{fontWeight:'bold', color:'#782FEE', textDecoration:'underline'}}>Congrats, you're 8th!</span> */}
              {/* <span
                style={{
                  fontWeight: "bold",
                  color: "#f54295",
                  textDecoration: "underline",
                }}
              >
                You've been overthrown to 20th
              </span> */}

              <Stack
                spacing={2}
                direction="column"
                justifyContent="space-evenly"
                divider={<Divider orientation="horizontal" flexItem />}
                sx={{ my: 2 }}
              >
                <RankComponent data={rows[0]} />
                <RankComponent data={rows[1]} />
                <RankComponent data={rows[2]} />
              </Stack>
            </Grid>
            <Grid item xs={9} style={{height:'100%'}}>
              <DataGrid
                sx={{ flex: 1, height: "100%", borderColor: "divider" }}
                rows={rows.slice(3, campaignData.numAuctionInteractions)}
                columns={columns}
                // pageSize={rows.length}
                hideFooter
                disableColumnMenu
                // rowsPerPageOptions={[7]}
                // checkboxSelection
                disableSelectionOnClick
              />
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ padding: 20 }}>Be the first to bid</Typography>
          </Box>
        )}
      </Box>
      </Box>
    </JumboCardQuick>
  );
}

const medals = [medal1, medal2, medal3];

function RankComponent({ data }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        my: 1,
      }}
    >
      <img
        style={{ height: 60, paddingRight: 10 }}
        src={medals[data?.id - 1]}
        alt=""
      />
      <Stack direction="column">
        <Typography variant="h4">
          <Link href={`/u/${data?.username}`}>{data?.username}</Link>
        </Typography>
        <Typography variant="body">${formatMoney(data?.bidPrice)}</Typography>
        <Typography variant="caption" color="text.hint">
          {data?.bidTime?.slice(0, 10)}
        </Typography>
      </Stack>
    </Box>
  );
}

// function Leaderboard() {

//   const supporters = [
//     {
//       user: {
//         username: 'Jackson#222',
//         profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8FuEJbKwDdaz1h387130xmYkAIQbZpahhbQ&usqp=CAU',
//       },
//       bidType: 'Auction',
//       bidPrice: 10.50,
//       bidTime: 'Just Now',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Jackson#222',
//         profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8FuEJbKwDdaz1h387130xmYkAIQbZpahhbQ&usqp=CAU',
//       },
//       bidType: 'Auction',
//       bidPrice: 10.50,
//       bidTime: 'Just Now',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Jackson#222',
//         profilePicture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8FuEJbKwDdaz1h387130xmYkAIQbZpahhbQ&usqp=CAU',
//       },
//       bidType: 'Auction',
//       bidPrice: 10.50,
//       bidTime: 'Just Now',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },
//     {
//       user: {
//         username: 'Julian#123',
//         profilePicture: 'https://play-lh.googleusercontent.com/I-Yd5tJnxw7Ks8FUhUiFr8I4kohd9phv5sRFHG_-nSX9AAD6Rcy570NBZVFJBKpepmc',
//       },
//       bidType: 'Auction',
//       bidPrice: 8.00,
//       bidTime: '3 min',
//     },

//   ]

//   const columns = [
//     { field: 'no', headerName: 'no', width: 90 },
//     {
//       field: 'username',
//       headerName: 'username',
//       width: 150,
//     },
//     {
//       field: 'bidprice',
//       headerName: 'bid price',
//       width: 150,

//     },
//     {
//       field: 'time',
//       headerName: 'time',
//       width: 110,
//     },
//   ]

//   return (
//     <Box sx={{ height: 400, width: '100%' }}>
//     <DataGrid
//       rows={rows}
//       columns={columns}
//       pageSize={5}
//       rowsPerPageOptions={[5]}
//       checkboxSelection
//       disableSelectionOnClick
//     />
//   </Box>
//     // <div style={{width:3200}}>
//     //   <div style={{fontSize:20, fontWeight:'normal'}}>Leaderboard</div>
//     //   <TableContainer component={Paper} style={{width:'100%'}}>
//     //     <Table sx={{ }} size='small' aria-label="simple table">
//     //       <TableHead>
//     //         <TableRow>
//     //           <TableCell>No. </TableCell>
//     //           <TableCell>User</TableCell>
//     //           <TableCell align="left">Price</TableCell>
//     //           <TableCell align="left">Bid time</TableCell>
//     //         </TableRow>
//     //       </TableHead>
//     //       <TableBody>
//     //         {supporters.slice(3).map((row, i) => (
//     //           <TableRow
//     //             key={row.user.username}
//     //             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//     //           >
//     //             <TableCell component="th" scope="row">
//     //               {i+1 + 3}
//     //             </TableCell>
//     //             <TableCell  align="left">
//     //               {row.user.username}
//     //             </TableCell>
//     //             <TableCell align="left"><b style={{color:'purple'}}>{row.bidPrice}</b></TableCell>
//     //             <TableCell align="left">{row.bidTime}</TableCell>
//     //           </TableRow>
//     //         ))}
//     //       </TableBody>
//     //     </Table>
//     //   </TableContainer>
//     //   <TablePagination rowsPerPageOptions={[10, 50]} />
//     // </div>
//   );
// }

// export default Leaderboard;