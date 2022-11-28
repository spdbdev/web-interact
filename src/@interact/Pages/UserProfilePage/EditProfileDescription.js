import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '0px 0px 32px',
    borderRadius:'10px'
  };

  
function EditProfileDescription({
    editModalOpen,
    setEditModalOpen,
    description,
    updateDescription,
}) {
    const handleClose = () => setEditModalOpen(false);
    const [updatedDescription, setUpdatedDescription] = useState(description);

    useEffect(()=>{
        setUpdatedDescription(description);
    },[description])

    const handleUpdateButtonClicked = () => {
        updateDescription(updatedDescription);
        setEditModalOpen(false);
    }
    return (
        <Modal
            align="center"
            open={editModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{display:'flex', justifyContent:'flex-end', padding:'10px 10px 10px 0px'}}>
                    <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }}></CloseIcon>
                </div>
                <div style={{marginBottom:'20px'}}>
                    <textarea
                        style={{height:'100px', lineHeight:'1.5', width:'340px', padding:'10px 15px', border:'2px solid hsl(223, 19%, 93%)', borderRadius:'10px', fontFamily:'Jost,Arial'}}
                        value={updatedDescription}
                        onChange={(e) => {
                            setUpdatedDescription(e.target.value);
                        }}
                    />
                </div>
                <div>
                    <InteractFlashyButton onClick={handleUpdateButtonClicked}>
                        Update
                    </InteractFlashyButton>
                </div>
            </Box>
        </Modal>
    );
}

export default EditProfileDescription;
