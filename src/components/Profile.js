import PageTitle from "./PageTitle";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import NotFound from "./NotFound";
import { useImmer } from "use-immer";
export default function Profile() {
  const { username } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [state, setState] = useImmer({
    followingRequestLoading: false,
    startFollwing: 0,
    stopFollowing: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/?s=128",
      isFollowing: false,
      counts: {
        followerCount: "",
        followingCount: "",
        postCount: "",
      },
    },
  });

  const appState = useContext(StateContext);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function getRequest() {
      try {
        const res = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token,
          },
          {
            cancelToken: ourRequest.token,
          }
        );
        if (res.data) {
          setState((draft) => {
            draft.profileData = res.data;
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.log("There was an error or the request canceld");
      }
    }

    getRequest();

    return () => {
      ourRequest.cancel();
    };
  });

  useEffect(() => {
    if (state.startFollwing) {
      const ourRequest = Axios.CancelToken.source();
      setState((draft) => {
        draft.followingRequestLoading = true;
      });
      async function getRequest() {
        try {
          const res = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );

          setState((draft) => {
            draft.profileData.followerCount++;
            draft.isFollowing = true;
            draft.followingRequestLoading = false;
          });
        } catch (error) {
          console.log("There was an error or the request canceld");
        }
      }

      getRequest();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollwing]);

  useEffect(() => {
    if (state.stopFollowing) {
      const ourRequest = Axios.CancelToken.source();
      setState((draft) => {
        draft.followingRequestLoading = true;
      });
      async function getRequest() {
        try {
          const res = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );

          setState((draft) => {
            draft.profileData.followerCount--;
            draft.isFollowing = false;
            draft.followingRequestLoading = false;
          });
        } catch (error) {
          console.log("There was an error or the request canceld");
        }
      }

      getRequest();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowing]);

  function startFollowing() {
    setState((draft) => {
      draft.startFollwing++;
    });
  }

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowing++;
    });
  }

  if (notFound) return <NotFound />;
  return (
    <PageTitle title="Profile">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
        {state.profileData.profileUsername}
        {appState.isLoggedIn &&
          !state.profileData.isFollowing &&
          state.profileData.profileUsername !== appState.user.username &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followingRequestLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {appState.isLoggedIn &&
          state.profileData.isFollowing &&
          state.profileData.profileUsername !== appState.user.username &&
          state.profileData.profileUsername !== "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followingRequestLoading}
              className="btn btn-outline-primary btn-sm ml-2"
            >
              unFollow <i className="fas fa-user"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </PageTitle>
  );
}
