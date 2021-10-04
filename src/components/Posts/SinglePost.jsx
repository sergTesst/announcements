import React from "react";

import { useParams } from "react-router";

import { useSelector } from "react-redux";

import {
  selectPostById,
  fetchSinglePost,
  selectSinglePostStatus,
} from "./postsSlice";

import {
  usePostIdToSelectOrFetchPost,
  useLoadingStatusToRenderLoader,
} from "./customHooksForPosts";

import { StatusData } from "../../api/ApiRoutes";

import { TimeAgo } from "../helperComponents/TimeAgo";

export const SinglePost = () => {
  let { postId } = useParams();

  const post = usePostIdToSelectOrFetchPost({
    postId,
    postSelector: selectPostById,
    postFetcher: fetchSinglePost,
  });

  const postStatus = useSelector(selectSinglePostStatus);

  const { statusPostLoadingData } = useLoadingStatusToRenderLoader(postStatus);

  if (postStatus === StatusData.loading) {
    return statusPostLoadingData;
  }

  if (!post || postStatus === StatusData.failed) {
    return (
      <section>
        <h2>Announcement with id {postId} is not found</h2>
      </section>
    );
  }

  return (
    <article className=" mb-1 p-1 " >
      <div className="row justify-content-sm-between">
        <div className="col">
          <h3>{post.title}</h3>
        </div>
      </div>
      <div className="row justify-content-end">
        <div className="col-sm-auto">
          <TimeAgo timeStamp={post.date}></TimeAgo>
        </div>
      </div>

      <div className="p-1">
        <p>{post.description}</p>
      </div>
    </article>
  );
};
