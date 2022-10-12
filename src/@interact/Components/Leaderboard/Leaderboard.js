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
import { Typography } from "@mui/material";
import InfoTooltip from "../InfoTooltip";

const columns = [
  { field: "id", headerName: "No", width: 90 },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "bidPrice",
    headerName: "Bid price",
    width: 150,
  },
  {
    field: "bidTime",
    headerName: "Bid time",
    width: 90,
  },
];

// const rows = [
//   { id: 1, username: 'Snow2', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 2, username: 'Snow23', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 3, username: 'Snow4', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 4, username: 'Snow5', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 5, username: 'Snow6', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 6, username: 'Sno6w', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 7, username: 'Sno5w', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 8, username: 'Sno56w', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 9, username: 'Sno5w', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 10, username: 'Sno55w', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 11, username: 'Sn4ow', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 12, username: 'Sn3ow', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 13, username: 'Sn3ow', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 14, username: 'Sn3ow', bidPrice: '$8.00', bidTime: 'Just now' },
//   { id: 15, username: 'Sn2ow', bidPrice: '$8.00', bidTime: 'Just now' },

// ];

export default function Leaderboard({ campaignData, bids }) {
  const minBid = 1.0; // assume bids smaller than min bid will not be acceoted

  const parseLeaderboard = (bids) => {
    console.log("parsing");
    bids = [...bids]?.sort((a, b) => {
      // console.log( parseFloat(a.bidPrice) > parseFloat(b.bidPrice), a, b)
      return parseFloat(b.price) - parseFloat(a.price);
    });

    bids = bids?.map((x, i) => {
      return {
        id: i + 1,
        username: x.person.username,
        bidPrice: x.auto
          ? i == bids.length - 1
            ? minBid
            : Math.min(x.price, parseFloat(bids[i + 1].price) + 0.5)
          : x.price,
        bidTime: new Date(x.time.seconds * 1000).toString(),
      };
    });

    console.log(bids);

    return bids;
  };

  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(parseLeaderboard(bids));
  }, [bids]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        p: 2,
      }}
    >
      <div style={{ padding: 10, height: "100%" }}>
        <Typography variant="h5">Leaderboard</Typography>

        {bids?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ padding: "10px 0" }}>
              {/* <span style={{fontWeight:'bold', color:'#782FEE', textDecoration:'underline'}}>Congrats, you're 8th!</span> */}
              <span
                style={{
                  fontWeight: "bold",
                  color: "#f54295",
                  textDecoration: "underline",
                }}
              >
                You've been overthrown to 20th
              </span>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <RankComponent data={rows[0]} />
                <RankComponent data={rows[1]} />
                <RankComponent data={rows[2]} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, width: "100%", ml: 2 }}>
                <div
                  style={{
                    fontSize: 12,
                    padding: 5,
                  }}
                >
                  If you’re on the leaderboard at the end of the campaign, you
                  will receive a{" "}
                  <span style={{ fontWeight: "bold", color: "#782FEE" }}>
                    premium interaction (occurs before raffled interactions)
                  </span>
                  ; otherwise, if you are overthrown from the leaderboard, you
                  are not charged
                </div>

                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={8}
                  disableColumnMenu
                  rowsPerPageOptions={[7]}
                  // checkboxSelection
                  disableSelectionOnClick
                />
              </Box>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ padding: 20 }}>Be the first to bid</h1>
            <div
              style={{
                fontSize: 12,
                padding: 5,
                paddingRight: 10,
                paddingTop: 15,
              }}
            >
              If you’re on the leaderboard at the end of the campaign, you will
              receive a{" "}
              <span style={{ fontWeight: "bold", color: "#782FEE" }}>
                premium interaction (occurs before raffled interactions)
              </span>
              ; otherwise, if you are overthrown from the leaderboard, you are
              not charged
            </div>
          </>
        )}
      </div>
    </Box>
  );
}

const medals = [medal1, medal2, medal3];

function RankComponent({ data }) {
  // console.log(data)
  // console.log(data != undefined)
  if (data != undefined) {
    // // console.log('condition passed')
    return (
      <div
        style={{
          display: "flex",
          width: 230,
          alignItems: "center",
          margin: "10px 0",
          padding: 15,
          height: 80,
          borderTopRightRadius: 11,
          borderBottomLeftRadius: 11,
          borderStyle: "solid",
          borderColor: "#782eee",
          borderWidth: 3,
        }}
      >
        <img
          style={{ height: 80, paddingRight: 30 }}
          src={medals[data.id - 1]}
        />
        <div>
          <div style={{ fontSize: 25 }}>
            <a href="#">{data.username}</a>
          </div>
          <div>Bid Price: {data.bidPrice}</div>
          <div style={{ fontSize: 15, fontWeight: "bold", color: "#aaa" }}>
            {data.bidTime.slice(0, 10)}
          </div>
        </div>
      </div>
    );
  } else {
    // // console.log('condition not passed')
    return (
      <></>
      // <div style={{display:'flex', width:230, alignItems:'center', margin:15, padding:15, height:80, borderTopRightRadius:11, borderBottomLeftRadius:11, borderStyle:'solid', borderColor:'#782eee', borderWidth:3}}>
      //   <div>
      //     <div style={{fontSize:25}}><a href='#'>No bidder yet</a></div>
      //   </div>
      // </div>
    );
  }
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
