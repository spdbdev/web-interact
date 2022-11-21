import { Button } from "@mui/material";

export default function InteractFlashyButton({
  onClick,
  children,
  disabled = false,
  radius,
  aos
}) {
  return (
    <Button
      sx={{
        ":hover": {
          background:
            "linear-gradient(180deg, #782FEE -8.69%, #DD00FF 109.93%)", // theme.palette.primary.main
          color: "white",
        },
        background:
          "linear-gradient(90deg, #782FEE -8.69%, #DD00FF 109.93%)",
        borderColor: "primary.main",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: radius ?? "3px 11px",
        borderWidth: 1,
        px: 4,
        py: 1,
      }}
      disableElevation
      variant={"contained"}
      onClick={onClick}
      type="submit"
      disabled={disabled}
      data-aos={aos}
    >
      {children}
    </Button>
  );
}
