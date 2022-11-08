import React,{ useEffect} from "react";
import { Container, Stack, Typography } from "@mui/material";
import TitleAndDesc from "../CampaignTitleAndDesc";
import InteractButton from "@interact/Components/Button/InteractButton";
import StripeLogo from "@interact/Images/stripe-logo.svg";
import Span from "@jumbo/shared/Span";
import CreateCampaignItemWrapper from "../CreateCampaignItemWrapper";
import { postRequest, getRequest } from "utils/api";
import { useStripe } from "@stripe/react-stripe-js";

export default function PaymentTab() {
  const stripe = useStripe();
  useEffect(() => {
    return () => {
      // This is the cleanup function
    }
  },[]);
  // const handleLinkStripeClick = async (event)=> {
  //   event.preventDefault();
  //   // const formData = new FormData();
  //   // formData.append("paymid", paymentid);
  //   // formData.append("customerid", customerid);
  //   // console.log(paymentid, customerid);
  //   // console.log(paymentid, customerid);

  //   // postRequest("/create_stripe_account")
  //   //   .then(async (resp) => {
  //   //     console.log(resp);
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //   })
  //   try {
  //     const formData = new FormData();

  //     alert('testing on click');
  //     postRequest("/create_stripe_account", formData)
  //     .then(async (resp) => {
  //       console.log(resp);
     
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //     // const account = await stripe.accounts.create({type: 'express'}).then((response)=>{
  //     //   console.log('RESP');
  //     //   console.log(response);        
  //     // }).
  //     // catch((err)=>{
  //     //   console.log(err);
  //     // });
  //     // console.log('ACCOUNTS');
  //     // console.log(account);      
  //     // const { cid } = req.params;
  //     // const paymentMethods = await stripe.customers.listPaymentMethods(cid, {
  //     //   type: "card",
  //     // });
  //     // res.status(200).json({ paymentmethod: paymentMethods });
  //   } catch (err) {
  //     console.log(err);
  //     // res.status(400).json({ message: "An error occured" });
  //   }
  // }
  
  return (
    <>
      <CreateCampaignItemWrapper>
        <TitleAndDesc title={"Banking details"}>
          Link a bank account where your campaign funds will be deposited.{" "}
          <br />
          <br /> Funds are processed through our third-party provider (Stripe)
          and your bank account details are not stored on our servers. <br />
          <br /> Funds will be deposited automatically within 3 business days
          after the campaign ends.
        </TitleAndDesc>
        <InteractButton>
          <Span
            sx={{
              fontWeight: 500,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              px: 2,
            }}
          >
            Link through <img alt="stripe logo" src={StripeLogo} width="60px" />
          </Span>
        </InteractButton>
      </CreateCampaignItemWrapper>
    </>
  );
}
