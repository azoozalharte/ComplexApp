import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

export default function Following() {
  const [isLodding, setIslodding] = useState(true);
  const [following, setFollowing] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fecthFollowing() {
      try {
        const res = await Axios.get(`/profile/${username}/following`, {
          cancelToken: ourRequest.token,
        });
        setFollowing(res.data);
        setIslodding(false);
      } catch (error) {
        console.log("some error here");
      }
    }

    fecthFollowing();

    return () => ourRequest.cancel();
  }, [username]);

  if (isLodding) return <LoadingDotsIcon />;
  return (
    <div className="list-group">
      {following.map((user) => {
        return (
          <Link
            key={user.username}
            to={`/profile/${user.username}`}
            className="list-group-item list-group-item-action"
          >
            <img
              className="avatar-tiny"
              alt="Profile Pictuer"
              src={user.avatar}
            />{" "}
            <strong>{user.username}</strong>{" "}
          </Link>
        );
      })}
    </div>
  );
}
