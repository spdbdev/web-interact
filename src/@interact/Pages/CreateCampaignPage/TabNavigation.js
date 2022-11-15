import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import InteractLogo from "@interact/Images/logo.png";

export function TabNavigation({
  selectedTabIndex,
  setSelectedTabIndex,
  disableNext,
  customErrorMessage,
}) {
  const navigate = useNavigate();
  const Swal = useSwalWrapper();
  const { campaignId } = useParams();

  function handleNextButtonClick() {
    if (disableNext) {
      Swal.fire({
        icon: "error",
        text:
          customErrorMessage ||
          "All form fields are required before moving to the next campaign creation step.",
      });
      return;
    }

    if (selectedTabIndex !== 7) {
      setSelectedTabIndex(selectedTabIndex + 1);
    } else {
      navigate(`/a/campaign-creation-summary/${campaignId}`);
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
      {selectedTabIndex > 0 ? (
        <InteractFlashyButton onClick={handleBackButtonClick}>
          ← Back
        </InteractFlashyButton>
      ) : null}
      <img alt="logo" src={InteractLogo} width={120} height={"100%"} />
      <InteractFlashyButton onClick={handleNextButtonClick}>
        Next →
      </InteractFlashyButton>
    </Box>
  );
}
