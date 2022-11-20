import "./Stripe.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: 0,
  width: 400,
};

//maxBidAmount
export default function PaymentMethodModal({
  open,
  handleClose,
  price,
  handlePopUpClose
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="wrapper">
          <div className="innerWrapper" style={{ width: "500px" }}>
            <PaymentRequestForm price={price} handleSubmit={handlePopUpClose}/>
            <div className="payment-divider" />
            <div className="stripe-card-wrapper">
              <div className="number_input">
                  <label htmlFor="#" className="stripe-card_field_label">Card Number</label>
                  <CardNumberElement className={"number_input"}  options={{ showIcon: true }} />
              </div>
              <div className="expiry_input">
                  <label htmlFor="#" className="stripe-card_field_label">Expiration</label>
                  <CardExpiryElement className={"expiry_input"} />
              </div>
              <div className="cvc_input">
                  <label htmlFor="#" className="stripe-card_field_label">CVC</label>
                  <CardCvcElement className={"cvc_input"} />
              </div>
            </div>
            <InteractFlashyButton onClick={handleSubmit} className="stripe-card_field_button">Pay</InteractFlashyButton>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
