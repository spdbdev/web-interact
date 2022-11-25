import InteractButton from "@interact/Components/Button/InteractButton";
import Span from "@jumbo/shared/Span";
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
		<InteractButton sx={sx} variant={selectedState ? "contained" : "outlined"}
			disabled={user?.id === targetUser?.id ? true : false} onClick={() => onBanButtonClicked()}>
            <Span sx={{ color: selectedState ? "primary.contrastText" : "primary.main" }} >
                {selectedState ? "Banned" : "Ban"}
            </Span>
		</InteractButton>
	);
}