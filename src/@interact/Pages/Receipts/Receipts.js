import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar/TopBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box } from "@mui/material";
import ReactModal from "react-modal";

import "./Receipts.css";
import Scheduler from "../../Components/Scheduler/Scheduler";
import CampaignSnippet from "../../Components/CampaignSnippet/CampaignSnippet";

import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import InteractButton from "@interact/Components/Button/InteractButton";
import Typography from "@mui/material/Typography";

function Receipts() {
  const [user, loading, error] = useAuthState(auth);
  const [receiptsList,setReceiptsList] = useState([]);
  
  const getReceipts = async () => {
    console.log('auth?.currentUser');
    console.log(auth?.currentUser); 
   
    let q = query(collection(db, "users"), where("uid", "==", user?.uid));

      const colledoc = await getDocs(q);
      console.log('colledoc.docs');
      console.log(colledoc.docs); 
      
      const data = colledoc.docs[0].data();
     
      data.id = colledoc.docs[0].id;
      
   q = query(
      collection(db, "users",data.id,"receipts"),
      where("creator_username", "==", data?.name)
    );
    const receiptsDoc = await getDocs(q);
    console.log('receiptsDoc');
    console.log(receiptsDoc); 
    console.log(receiptsDoc.docs);
    if(receiptsDoc.docs){
      setReceiptsList(receiptsDoc.docs);
      console.log('receiptsList');
      console.log(receiptsList);
    }
    
  }
  useEffect(() => {
    getReceipts();
  },[]);

  return (
    <div>
      <Box>
        <Card>
          <CardHeader></CardHeader>
          <CardContent
            style={{
              borderBottom: "1px solid black",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{textAlgin:"center"}}>Receipts & PayStubs</h1>
            {receiptsList.length > 0 ? (
          receiptsList.map((item, index) => {
            item = item.data();
            return (
              <>
            <Typography>
             Fan: {item.purchaser_username}
             </Typography>
            <Typography>
            {item.type == 'auction'?'Bid':'Ticket Price'}: ${item.price}
             </Typography>
            <Typography>
             Type: {item.type}
             </Typography>             
             {item.type == 'auction'?<Typography>
             Rank: {item.rank}
             </Typography>
            :''}
            <hr/>
 
              </>
       )
      })
            ):(
              <>
              <Typography>
             No Receipts
             </Typography>
              </>
            )
}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default Receipts;
