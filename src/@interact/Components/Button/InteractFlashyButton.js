import LoadingButton from "@mui/lab/LoadingButton";



export default function InteractFlashyButton({
  onClick,
  children,
  disabled = false,
  radius,
  aos,
  ...rest
}) {
  return (
    <LoadingButton
      sx={{
        ":hover": {
          background:
            "linear-gradient(149.69deg, #ff4500 -8.69%, #e433ff 109.93%)", // theme.palette.primary.main
          color: "white",
          borderColor: "#e433ff"
        },
        background: "linear-gradient(90deg, #8747f0 -8.69%, #e433ff 109.93%)",
        borderColor: "primary.main",
        fontWeight: 500,
        textTransform: "none",
        borderRadius: radius ?? "3px 12.69px",
        borderWidth: 1,
        px: 4,
        py: 1,
      }}
      //disableElevation
      variant={"contained"}
      onClick={onClick}
      type="submit"
      disabled={disabled}
      {...rest}
      data-aos={aos}
    >
      {children}
    </LoadingButton>
  );
}
