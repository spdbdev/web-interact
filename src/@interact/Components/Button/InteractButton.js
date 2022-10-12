import { Button } from "@mui/material";

export default function InteractButton({ onClick, children }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      style={{
        color: "#782eee",
        textTransform: "none",
        borderRadius: "2px 11px",
        borderWidth: 2,
      }}
      color="inherit"
      type="submit"
    >
      {children}
    </Button>
  );
}
