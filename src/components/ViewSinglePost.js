import Axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";

// comonents
import PageTitle from "./PageTitle";

export default function ViewSinglePost() {
  const [isLodding, setIslodding] = useState(true);
  const [notFount, setNotFound] = useState(false);
  const [post, setPost] = useState({});
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const featchPost = useCallback(async () => {
    try {
      const res = await Axios.get(`/post/${id}`);
      if (res.data) {
        setPost(res.data);
      } else {
        setNotFound(true);
      }
      setIslodding(false);
    } catch (error) {
      console.log("some error here");
    }
  }, [id]);

  useEffect(() => {
    featchPost();
  }, [featchPost]);

  async function handleDelete() {
    const areYouSure = window.confirm(
      "Do you realy whant to delete this post?"
    );

    if (areYouSure) {
      try {
        const res = await Axios.delete(`/post/${post._id}`, {
          data: { token: appState.user.token },
        });
        if (res.data === "Success") {
          appDispatch({
            type: "flashMessage",
            value: "Post Delete Successfly",
          });
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (error) {}
    }
  }

  if (isLodding) return <LoadingDotsIcon />;
  if (notFount) return <NotFound />;
  const date = new Date(post.createdDate);

  function isOwner() {
    if (appState.isLoggedIn) {
      if (appState.user.username === post.author.username) {
        return true;
      }
    }
    return false;
  }
  return (
    <PageTitle title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              className="text-primary mr-2"
              title="edit"
            >
              <i className="fas fa-edit"></i>
            </Link>

            <a
              onClick={handleDelete}
              className="delete-post-button text-danger"
              title="Delete"
            >
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
        <ReactMarkdown>{post.body}</ReactMarkdown>{" "}
      </div>
    </PageTitle>
  );
}
