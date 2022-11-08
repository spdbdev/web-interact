import { auth } from "@jumbo/services/auth/firebase/firebase";
import { fetchUserByUid } from "../../firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const useCurrentUser = () => {
  const [authUser, loading, error] = useAuthState(auth);
  const [user, setUser] = useState();
  useEffect(() => {
    const handleFetchUserByUID = async () => {
      const user = await fetchUserByUid(authUser.uid);
      setUser(user)
    }
    if (authUser) handleFetchUserByUID()
  }, [authUser])
  return { user }
}

export default useCurrentUser;