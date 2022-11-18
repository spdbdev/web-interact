import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import { postRequest } from "../../../utils/api";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import "./popupstyle.css";
import { IconButton, Stack } from "@mui/material";
import { Close } from '@mui/icons-material';

export default function ConfirmAuctionPopup({
  openstate,
  settheOpenPopup,
  closefunction,
  allprimarymethod,
  desiredRanking,
  onchangeclick,
  price,
  userCostomerId,
  bidAction,
  bidActionstatus,
  selectPaymentMethod,
  setSelectedPaymentMethod,
}) {
  const [paymentId, setpaymentId] = useState();
  const [showtext, setShowText] = useState(false);
  const Swal = useSwalWrapper();

  const changeEvent = () => {
    // settheOpenPopup(false);
    onchangeclick();
  };

  const selectPaymentId = (pmid) => {
    setpaymentId(pmid);
    setSelectedPaymentMethod(pmid);
  };

  useEffect(() => {
    setShowText(false);
    allprimarymethod.forEach((element, index) => {
      if (index === 0) {
        setpaymentId(element.id);
      }
    });
  }, [allprimarymethod]);
const paymentResponse = (price,resp = null) => {
  console.log(resp?.data);
        if (!price || resp?.data?.paymentstatus) {
        
          settheOpenPopup(false);
          Swal.fire(
            "Success!",
            "Your payment has been made. Thanks",
            "success"
          );
          if (bidActionstatus) {
            bidAction(price);
          }
        } else {
          settheOpenPopup(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed!",
          });
        }
}
  const confirmFuncion = () => {
    console.log(paymentId, userCostomerId);
    const formData = new FormData();
    formData.append("price", price);
    formData.append("paymentmethodid", paymentId);
    formData.append("customerId", userCostomerId);
    console.log(price)
    if(!price){
      paymentResponse(price);
      return;
    }
    postRequest("/make_instant_payment_on_stripe", formData)
      .then(async (resp) => {
        paymentResponse(price,resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Dialog PaperProps={{ style: { borderBottomLeftRadius: 10, borderTopRightRadius: 10 } }}
        open={openstate}
        onClose={closefunction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" style={{ background: "#FAFAFA", marginBottom: '17px' }}>
          <Stack direction="row" alignItems="center" spacing={1} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Typography variant="h2" gutterBottom style={{ color: "#7c35ee", textDecoration: 'underline', marginBottom: 0 }}>
              Confirm bid
            </Typography>
            <IconButton onClick={closefunction} style={{ padding: 0 }}> <Close /> </IconButton>
          </Stack>
          
          <Typography variant="subtitle1" gutterBottom style={{fontWeight: '500', fontSize: '13px', color: 'black'}} >
            This bid will place you at <span style={{color: '#7c35ee'}}>{desiredRanking}th</span> place on the leaderboard (if no one else bids)
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ marginBottom: "20px" }}
          >
            <Typography variant="h4" gutterBottom style={{fontWeight: '600', fontSize: '23px', marginBottom: '12px'}}>
              Your bid amount: ${Number.parseFloat(price).toFixed(2)}
            </Typography>
            {allprimarymethod.length > 0 ? (
              allprimarymethod.map((item, index) => {
                return (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: 'flex-start',
                        gap: '50px',
                        margin: "8px 0px",
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '220px', gap: '5px'}}>
                        <input
                          type="radio"
                          value={item.id}
                          name="paymentid"
                          checked={selectPaymentMethod === item.id && "checked"}
                          onChange={() => selectPaymentId(item.id)}
                          style={{margin: '0px', accentColor: '#7c35ee'}}
                        />
                        <img src={item.card.brand === "visa" ? "https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" : "https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"} alt="icon" />
                        <Typography variant="h6" gutterBottom style={{fontSize: '13px', margin: "0px", textTransform: 'capitalize'}}>
                          <span style={{fontWeight: '700'}}>{item.card.brand}</span> ending in {item.card.last4}
                        </Typography>
                      </div>
                      <div onClick={changeEvent} style={{ cursor: "pointer" }}>
                        <Typography variant="h6" gutterBottom style={{ color: "#7c35ee", textDecoration: 'underline', fontSize: '13px' }}>
                          Change
                        </Typography>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <></>
            )}
          </DialogContentText>
          <InteractFlashyButton onClick={confirmFuncion}>
            Confirm
          </InteractFlashyButton>
          <Typography variant="subtitle1" style={{fontWeight: '500', fontSize: '13px', lineHeight: '1.5', marginBottom: '17px', marginTop: '30px', color: 'black'}} >
            You will only be charged if you're a winning bidder on the leaderboard at the <span style={{color: '#7c35ee'}}>end of the campaign.</span><br/>
            <span style={{color: '#b1b1b1'}}>When you confirm your bid, you consent to an automatic charge via this payment method at the end of the campaign.</span>
          </Typography>
          <Typography variant="subtitle1" style={{fontWeight: '500', fontSize: '13px', color: '#b1b1b1'}} >
            New bids replace old bids, since each user is limited to 1 interaction in the acution.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
