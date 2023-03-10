import Axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

export default function ProfilePosts() {
  const [isLodding, setIslodding] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  const fecthPosts = useCallback(async () => {
    try {
      const res = await Axios.get(`/profile/${username}/posts`);
      setPosts(res.data);
      console.log(res.data);
      setIslodding(false);
    } catch (error) {
      console.log("some error here");
    }
  }, [username]);

  useEffect(() => {
    fecthPosts();
  }, [fecthPosts]);

  if (isLodding) return <LoadingDotsIcon />;
  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate);
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img
              className="avatar-tiny"
              alt="Profile Pictuer"
              src={post.author.avatar}
            />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">
              on {`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`}{" "}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
