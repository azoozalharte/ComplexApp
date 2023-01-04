import Axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
// Components
import PageTitle from "./PageTitle";
export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const appDispatch = useContext(DispatchContext);
  //   Navigate
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await Axios.post("/create-post", {
        title,
        body,
        token: localStorage.getItem("complexappToken"),
      });
      appDispatch({ type: "flashMessage", value: "Post Added :))" });
      navigate(`/post/${res.data}`);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <PageTitle title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </PageTitle>
  );
}
