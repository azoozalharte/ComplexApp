import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StateContext from "../StateContext";

// comonents
import PageTitle from "./PageTitle";

export default function ViewSinglePost() {
  const [isLodding, setIslodding] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [post, setPost] = useState({});
  const appState = useContext(StateContext);
  const { id } = useParams();

  useEffect(() => {
    async function featchPost() {
      const res = await Axios.get(`/post/${id}`);
      setPost(res.data);
      if (res.data.author.username === appState.user.username) {
        setIsOwner(true);
      }
      setIslodding(false);
    }

    featchPost();
  }, []);

  if (isLodding) return <div>Lodding...</div>;

  const date = new Date(post.createdDate);
  return (
    <PageTitle title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner && (
          <span className="pt-2">
            <a href="#" className="text-primary mr-2" title="Edit">
              <i className="fas fa-edit"></i>
            </a>
            <a className="delete-post-button text-danger" title="Delete">
              <i className="fas fa-trash"></i>
            </a>
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img
            className="avatar-tiny"
            alt="profile picter"
            src={post.author.avatar}
          />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {`${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`}
      </p>

      <div className="body-content">
        <p>{post.body} </p>
      </div>
    </PageTitle>
  );
}
