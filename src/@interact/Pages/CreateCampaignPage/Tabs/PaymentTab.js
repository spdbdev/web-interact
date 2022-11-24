import React,{ useState,useEffect} from "react";
import { Container, Stack, Typography } from "@mui/material";
import TitleAndDesc from "../CampaignTitleAndDesc";
import InteractButton from "@interact/Components/Button/InteractButton";
import StripeLogo from "@interact/Images/stripe-logo.svg";
import Span from "@jumbo/shared/Span";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import { _BASE_URL,postRequest, getRequest } from "utils/api";
import { useStripe } from "@stripe/react-stripe-js";
import { useNavigate,useSearchParams } from 'react-router-dom'
import { auth, db, logout } from "@jumbo/services/auth/firebase/firebase";
import { doc, query, updateDoc, collection, getDocs, setDoc, where, addDoc } from "firebase/firestore";
import { TabNavigation } from "../TabNavigation";


export default function PaymentTab({selectedTabIndex, setSelectedTabIndex}) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [accountId, setAccountId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const getAccountId = async ()=>{
    const q = query(collection(db, "users"), where("uid", "==", auth?.currentUser?.uid));
    const colledoc = await getDocs(q);
    const data = colledoc.docs[0].data();
    
    console.log('DB accountId',data.accountId);
    setAccountId(data.accountId);
  }

  useEffect(() => {
    if (searchParams.has('accountId')) {
      console.log(searchParams.get('URL accountId'));
      setAccountId(searchParams.get('accountId'));
      searchParams.delete('accountId');
      setSearchParams(searchParams);
    }
    else{
      getAccountId();
    }
    // if(accountId){
    //   const formData = new FormData();
    //   formData.append("accountId", accountId);
    //   let account_details = postRequest('/a/get-account',formData);
    //   console.log('linked account_details');
    //   console.log(account_details);  
    // }
    
  },[accountId,searchParams]);
  
  const handleLinkStripeClick = async (event)=> {
    event.preventDefault();
    try {
      const formData = new FormData();
      window.location.href = _BASE_URL+'/a/register-account'; 
    } catch (err) {
      console.log(err);
    }
  }

  
  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title={"Banking details"}>
          Link a bank account where your campaign funds will be
          deposited. <br />
          <br /> Funds are processed through our third-party provider
          (Stripe) and your bank account details are not stored on our
          servers. <br />
          <br /> Funds will be deposited automatically within 3
          business days after the campaign ends.
        </TitleAndDesc>
        {accountId && <TitleAndDesc title={"Account Linked"}><h3>Your account has beedn linked to Stripe</h3></TitleAndDesc> }
        {!accountId && <InteractButton onClick={handleLinkStripeClick}>
          <Span
            sx={{
              fontWeight: 500,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              px: 2,
            }}
          >
            Link through{" "}
            <img alt="stripe logo" src={StripeLogo} width="60px" />
          </Span>
        </InteractButton>
      }
      </CreateCampaignItemWrapper>
      <TabNavigation
        disableNext={false} // Not yet wired up to stripe
        selectedTabIndex={selectedTabIndex}
        setSelectedTabIndex={setSelectedTabIndex}
      />
    </>
  );
}
