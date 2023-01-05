import PageTitle from "./PageTitle";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
export default function Profile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/?s=128",
    isFollowing: false,
    counts: {
      followerCount: "",
      followingCount: "",
      postCount: "",
    },
  });
  const appState = useContext(StateContext);
  useEffect(() => {
    async function getRequest() {
      const res = await Axios.post(`/profile/${username}`, {
        token: appState.user.token,
      });
      setProfileData(res.data);
    }

    getRequest();
  }, [username]);
  return (
    <PageTitle title="Profile">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </PageTitle>
  );
}
