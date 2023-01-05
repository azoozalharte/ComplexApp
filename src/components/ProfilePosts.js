import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ProfilePosts() {
  const [isLodding, setIslodding] = useState(true);
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    async function fecthPosts() {
      const res = await Axios.get(`/profile/${username}/posts`);
      setPosts(res.data);
      console.log(res.data);
      setIslodding(false);
    }

    fecthPosts();
  }, []);

  if (isLodding) return <div>Lodding...</div>;
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
