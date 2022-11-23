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
import PaymentRequestForm from "@interact/Components/Stripe/PaymentRequestForm";

export default function ConfirmVIPPopup({
  openstate,
  settheOpenPopup,
  closefunction,
  allprimarymethod,
  onaddclick,
  price,
  userCostomerId,
  bidAction,
  bidActionstatus,
  selectPaymentMethod,
  setSelectedPaymentMethod,
}) {
  const [paymentId, setpaymentId] = useState();
  const [showtext, setShowText] = useState(false);
  const [loading, setLoading] = useState(false);

  const Swal = useSwalWrapper();
  const addEvent = () => {
    // settheOpenPopup(false);
    closefunction();
    onaddclick();
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
    settheOpenPopup(false);
    setLoading(false);
    if (!price || resp?.data?.paymentstatus) {
      Swal.fire(
        "Congratulations!",
        "Your payment has been made. Thanks",
        "success"
      );
      if (bidActionstatus) {
        bidAction(price);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed!",
      });
    }
  };

  const confirmFuncion = () => {
    setLoading(true);
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
        settheOpenPopup(false);
        setLoading(false);
      });
  };

  return (
    <div>
      <Dialog PaperProps={{ style: { borderRadius: 20, padding: 15 } }}
        open={openstate}
        onClose={closefunction}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title" style={{ background: "#FAFAFA", marginBottom: '17px' }}>
          <Stack direction="row" alignItems="center" spacing={1} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Typography variant="h2" gutterBottom style={{ color: "#782FEE", textDecoration: 'underline', marginBottom: 0 }}>
              Confirm VIP entry
            </Typography>
            <IconButton onClick={closefunction} style={{ padding: 0 }}> <Close /> </IconButton>
          </Stack>
          
          <Typography variant="subtitle1" gutterBottom style={{fontWeight: '500', fontSize: '13px', color: 'black'}} >
            You have an <span style={{color: '#782FEE'}}>X%</span> chance of winning with your VIP entry (100x chance multiplier: 25x VIP entry $ 4x loss multiplier)
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ marginBottom: "30px" }}
          >
            <Typography variant="h4" gutterBottom style={{fontWeight: '600', fontSize: '23px', margin: '0px'}}>
              Entry price: <span style={{color: '#782FEE'}}>${Number.parseFloat(price).toFixed(2)}</span>
            </Typography>
            <div className="paymentRequestDiv" style={{ width: "200px", marginBottom:"15px", marginTop:"30px" }}>
              <PaymentRequestForm price={price} handleSubmit={closefunction} />
            </div>
            <div onClick={addEvent} style={{ cursor: "pointer", marginBottom: '20px' }}>
              <Typography variant="h6" gutterBottom style={{ color: "#782FEE", textDecoration: 'underline', fontSize: '13px' }}>
                Add new payment method
              </Typography>
            </div>
            {allprimarymethod.length > 0 ? (
              allprimarymethod.map((item, index) => {
                return (
                  <>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '15px', margin: '15px 0px'}}>
                      <input
                        type="radio"
                        value={item.id}
                        name="paymentid"
                        checked={selectPaymentMethod === item.id && "checked"}
                        onChange={() => selectPaymentId(item.id)}
                        style={{margin: '0px', accentColor: '#782FEE'}}
                      />
                      <img src={item.card.brand === "visa" ? "https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" : "https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg"} alt="icon" />
                      <Typography variant="h6" gutterBottom style={{fontSize: '13px', margin: "0px", textTransform: 'capitalize'}}>
                        <span style={{fontWeight: '700'}}>{item.card.brand}</span> ending in {item.card.last4}
                      </Typography>
                    </div>
                  </>
                );
              })
            ) : (
              <></>
            )}
          </DialogContentText>
          <InteractFlashyButton onClick={confirmFuncion} loading={loading}>
            Confirm
          </InteractFlashyButton>
          <Typography variant="subtitle1" style={{fontWeight: '500', fontSize: '13px', lineHeight: '1.5', marginTop: '30px', color: '#b1b1b1'}} >
            When you confirm now, you will pay ${Number.parseFloat(price).toFixed(2)} to enter the raffle
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}