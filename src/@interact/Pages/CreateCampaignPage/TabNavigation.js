import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InteractLogo from "@interact/Images/logo.png";

export function TabNavigation({
  selectedTabIndex,
  setSelectedTabIndex,
  disableNext,
}) {
  const navigate = useNavigate();
  const Swal = useSwalWrapper();

  function handleNextButtonClick() {
    if (disableNext) {
      Swal.fire({
        icon: "error",
        text: "All form fields are required before moving to the next campaign creation step.",
      });
      return;
    }

    if (selectedTabIndex < 6) {
      setSelectedTabIndex(selectedTabIndex + 1);
    } else if (selectedTabIndex === 6) {
      navigate("/interact/campaign-creation-summary");
    } else {
      return;
    }
  }

  function handleBackButtonClick() {
    if (selectedTabIndex > 0) {
      setSelectedTabIndex(selectedTabIndex - 1);
    } else {
      return;
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "flex-end",
        justifySelf: "flex-end",
        my: 4,
        bottom: 20,
      }}
    >
      <InteractFlashyButton onClick={handleBackButtonClick}>
        ← Back
      </InteractFlashyButton>
      <img alt="logo" src={InteractLogo} width={120} height={"100%"} />
      <InteractFlashyButton onClick={handleNextButtonClick}>
        Next →
      </InteractFlashyButton>
    </Box>
  );
}
