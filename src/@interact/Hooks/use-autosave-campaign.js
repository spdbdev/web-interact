import React, { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";

import { db } from "@jumbo/services/auth/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import moment from "moment";

const DEBOUNCE_SAVE_DELAY_MS = 1000;

export default function useAutosaveCampaign(campaignData) {
  // This UI state mirrors what's in the database.
  const [data, setData] = useState(campaignData);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(moment());
  const [autosaveError, setAutosaveError] = useState(false);

  // This is the side effect we want to run on users' changes.
  // It is responsible for persisting the changes in the database.
  // In this example, we use localStorage for simplicity.
  const saveData = useCallback(async (newData) => {
    setIsAutosaving(true);
    setAutosaveError(false);
    const docRef = await doc(
      db,
      "campaigns",
      "campaign-creation-test"
    ); //this needs to be passed in programatically

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
  }, []);

  const debouncedSave = useCallback(
    debounce(async (newData) => {
      saveData(newData);
    }, DEBOUNCE_SAVE_DELAY_MS),
    []
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
