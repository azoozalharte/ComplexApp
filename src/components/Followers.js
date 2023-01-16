import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

export default function Followers() {
  const [isLodding, setIslodding] = useState(true);
  const [followers, setFollowers] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    async function fecthFollowers() {
      try {
        const res = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: ourRequest.token,
        });
        setFollowers(res.data);
        setIslodding(false);
        console.log("1");
      } catch (error) {
        console.log("some error here");
      }
    }

    fecthFollowers();

    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  if (isLodding) return <LoadingDotsIcon />;
  return (
    <div className="list-group">
      {followers.map((user) => {
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
