import React, { useState } from "react";
import { Box } from "@mui/material";
import { db, storage as Storage } from "@jumbo/services/auth/firebase/firebase";
import { setDoc, doc, query, onSnapshot, getDocs, where, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Modal from "@mui/material/Modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CloseIcon from '@mui/icons-material/Close';
import InteractFlashyButton from "@interact/Components/Button/InteractFlashyButton";

function CropProfilePicture({
  cropModalOpen,
  setCropModalOpen,
  imgageObj,
  updatePhotoURL,
  setImage,
}) {
  const handleOpen = () => setCropModalOpen(true);
  const handleClose = () => setCropModalOpen(false);
  const [completedCrop, setCompletedCrop] = useState();
  const [imageRef, setImageRef] = useState();
  const [crop, setCrop] = useState({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  const handleSubmit = async (event) => {
    if (imageRef && completedCrop.width && completedCrop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        completedCrop,
        "newFile.jpeg"
      );
      if (!croppedImageUrl) return;

      const storageRef = ref(
        Storage,
        `/user_profile_pictures/${imgageObj.name}.jpg`
      );
      const uploadTask = uploadBytesResumable(storageRef, croppedImageUrl);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            setCropModalOpen(false);
            updatePhotoURL(url);
            setImage(url);
          });
        }
      );
    }
  };

  function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          blob.name = fileName;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }

    return (
        <Modal
            align="center"
            open={cropModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div 
                id="cropPhoto"
                style={{width:'550px', height:'550px', marginTop:'30px', background:'white', paddingTop:'20px', borderRadius:'30px'}}
            >
                <div style={{marginBottom:'30px', display:'flex', justifyContent:'flex-end', paddingRight:'20px', marginBottom:'10px'}}>
                    <CloseIcon onClick={() => setCropModalOpen(false)} style={{ cursor: "pointer" }}>
                    </CloseIcon>
                </div>
                <ReactCrop
                    style={{borderRadius:'10px', marginBottom:'20px'}}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    circularCrop={true}
                    aspect={1}
                    onComplete={(c) => setCompletedCrop(c)}
                >
                    <img
                        src={imgageObj.url}
                        onLoad={(e) => setImageRef(e.currentTarget)}
                        style={{ width: "400px", height: "400px" }}
                        alt=""
                    />
                </ReactCrop>
                <Box align="center" >
                    <InteractFlashyButton onClick={handleSubmit}>
                        Save
                    </InteractFlashyButton>
                </Box>
            </div>
        </Modal>
    );
}

export default CropProfilePicture;
