import PageTitle from "./PageTitle";
import { useContext, useEffect } from "react";
import StateContext from "../StateContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { Link } from "react-router-dom";
export default function Home() {
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    isLoadding: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await Axios.post(
          `/getHomeFeed`,
          { token: appState.user.token },
          {
            cancelToken: ourRequest.token,
          }
        );
        console.log("1");
        setState((draft) => {
          draft.isLoadding = false;
          draft.feed = res.data;
        });
        console.log(res.data.length);
      } catch (error) {
        console.log("some error here");
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoadding) return <LoadingDotsIcon />;

  return (
    <PageTitle title="Your Feed">
      <h2 className="text-center">
        Hello <strong>{appState.user.username}</strong>, your feed is empty.
      </h2>

      <div className="container container--narrow py-md-5">
        {state.feed.length !== 0 ? (
          <h2 className="text-center mb-4">The Latest From Those You Follow</h2>
        ) : (
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        )}
        <div className="list-group">
          {state.feed &&
            state.feed.map((post) => {
              const date = new Date(post.createdDate);
              const formateDate = `${date.getDay()}/${
                date.getMonth() + 1
              }/${date.getFullYear()}`;
              return (
                <Link
                  to={`/post/${post._id}`}
                  key={post._id}
                  className="list-group-item list-group-item-action"
                >
                  <img
                    className="avatar-tiny"
                    alt="Profile"
                    src={post.author.avatar}
                  />{" "}
                  <strong>{post.title}</strong>{" "}
                  <span className="text-muted small">
                    by {post.author.username} on {formateDate}{" "}
                  </span>
                </Link>
              );
            })}
        </div>
      </div>
    </PageTitle>
  );
}
