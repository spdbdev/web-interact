import React, { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

import { db } from "@jumbo/services/auth/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useLocation } from "react-router-dom";

const DEBOUNCE_SAVE_DELAY_MS = 1000;

export default function useAutosaveCampaign(campaignData) {
  // This UI state mirrors what's in the database.
  //const campaignIdRef = useRef(campaignId);
  const [data, setData] = useState(campaignData);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(moment());
  const [autosaveError, setAutosaveError] = useState(false);
  const [campaignId, setCampaignId] = useState(""); // need to get ID from URL reliably

  const location = useLocation();

  useEffect(() => {
    const id = location.pathname.substring(
      location.pathname.lastIndexOf("/") + 1
    );
    setCampaignId(id);
  }, [location.pathname]);

  // This is the side effect we want to run on users' changes.
  // It is responsible for persisting the changes in the database.
  // In this example, we use localStorage for simplicity.
  const saveData = useCallback(
    async (newData) => {
      if (!campaignId) {
        setAutosaveError(true);
        setIsAutosaving(false);
        return;
      } else {
        setIsAutosaving(true);
        setAutosaveError(false);
      }

      const docRef = doc(db, "campaigns", campaignId); //this needs to be passed in programatically
      // const docRef = await doc(db, "campaigns", docId);

      updateDoc(docRef, newData)
        .then(() => {
          setIsAutosaving(false);
          setLastSavedAt(moment());
        })
        .catch((error) => {
          setAutosaveError(true);
          console.error(error);
        }); // this is updating the campaign, provided it already exists. each time a new campaign is created, we would need to run an ".add" and init the fields instead of a ".update"
      setData(newData);
    },
    [campaignId]
  );

  const debouncedSave = useCallback(
    debounce(async (newData) => {
      saveData(newData);
    }, DEBOUNCE_SAVE_DELAY_MS),
    [campaignId]
  );

  // This effect runs only when `data` changes.
  // Effectively achieving the auto-save functionality we wanted.
  useEffect(() => {
    if (data) {
      debouncedSave(data);
    }
  }, [data, debouncedSave]);

  return { data, setData, isAutosaving, lastSavedAt, autosaveError };
}
