import Span from "@jumbo/shared/Span";
import { LoadingButton } from "@mui/lab";
import { banUserFromCampaign } from "../../../firebase";
export function BanButton({ user, targetUser,sx }) {

    let selectedState = user && targetUser && user?.banList?.includes(targetUser?.id) ? true : false;
	const onBanButtonClicked = async () => {
        try{
            await banUserFromCampaign(targetUser.id, user);
            selectedState = !selectedState;
        }catch(e) {
            console.log(e);
        }
	}

	return (
        <LoadingButton
            sx={{
                ":hover": {
                background:
                    "linear-gradient(-90deg, #FF0000 -37.69%, #DD00FF 109.93%)", // theme.palette.primary.main
                color: "white",
                },
                background: "linear-gradient(90deg, #8747f0 -8.69%, #e433ff 109.93%)",
                borderColor: "primary.main",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "11px 3px",
                borderWidth: 1,
                px: 0,
                marginLeft: 0.69,
                py: 0.769,
            }}
            svariant={selectedState ? "contained" : "outlined"}
			
            //disableElevation
            variant={"contained"}
            type="submit"
    
        disabled={user?.id === targetUser?.id ? true : false} onClick={() => onBanButtonClicked()}>
            <Span sx={{ color: selectedState ? "#FFFFFF" : "#FFFFFF" }} >
                {selectedState ? "Banned" : "Ban"}
            </Span>
    </LoadingButton>
	);
}