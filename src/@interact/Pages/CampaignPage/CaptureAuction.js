import React from 'react'
import { getRequest, postRequest } from "../../../utils/api";

const CaptureAuction = () => {
  return (
    <div>
        {
            postRequest('/Auction_Bid_Payment_Capture_Process', {
                data:"dwvayudg"
              }).then(function (response) {
                if(response.data.pi_id){
                  console.log(response.data.pi_id);
                  alert("Payment Captured Successfully")
  
                }else{
                  alert("Some Error");
                }

              })
              .catch(function (error) {
                console.log(error);
              })  
        }
      </div>
  )
}

export default CaptureAuction