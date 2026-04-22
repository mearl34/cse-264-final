import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { getUserByGid } from "../api/userApi";

export default function Profile({uid}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUserByGid(uid);
      setUser(data);
    };

    loadUser();
  }, []);

  return (
    <Typography>
      User Profile
      <br />
      {user ? JSON.stringify(user) : "Loading..."}
    </Typography>
  );
}