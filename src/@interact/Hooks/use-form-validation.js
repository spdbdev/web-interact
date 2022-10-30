import { useEffect, useState } from "react";

export function useFormValidation({
  selectedTabIndex,
  lastCompletedTabIndex,
  setData,
  formValidationConditions,
}) {
  const [isTabValidated, setIsTabValidated] = useState(false);

  useEffect(() => {
    if (formValidationConditions) {
      if (lastCompletedTabIndex < selectedTabIndex + 1) {
        setData({
          lastCompletedTabIndex: selectedTabIndex,
        });
      }
      setIsTabValidated(true);
    } else {
      setIsTabValidated(false);
    }
  }, [formValidationConditions]);

  return isTabValidated;
}
