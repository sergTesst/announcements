import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
  fetchPosts,
  selectPostsIds,
  selectPostById,
  selectPostsStatus,
  selectFetchedAllPostsLength,
  selectSearchQuery,
  selectFromAndToForPagination,
} from "./postsSlice";

import { StatusData } from "../../api/ApiRoutes";
import { TimeAgo } from "../helperComponents/TimeAgo";
import { useLoadingStatusToRenderLoader } from "./customHooksForPosts";
import { ReadMoreText } from "../helperComponents/ReadMoreText.jsx";

const PostsListFetchPostsErrorMessage =
  "There is an error occurred. Try again later.";

export const PostsList = () => {
  const dispatch = useDispatch();

  const postsIds = useSelector((state) => selectPostsIds(state));
  const postsStatus = useSelector(selectPostsStatus);

  const allFetchedPostsLength = useSelector(selectFetchedAllPostsLength);
  const fromAndTo = useSelector((state) => selectFromAndToForPagination(state));

  useEffect(() => {
    if (postsStatus === StatusData.idle) {
      dispatch(fetchPosts({ from: 0, to: 5 }));
    }
  }, [postsStatus, dispatch]);

  const { statusPostLoadingData } = useLoadingStatusToRenderLoader(postsStatus);

  let postsRenderedContent = null;
  if (postsStatus === StatusData.succeeded) {
    postsRenderedContent = postsIds.map((postId) => {
      return <PostExcerpt key={postId} postId={postId}></PostExcerpt>;
    });
  } else if (postsStatus === StatusData.failed) {
    postsRenderedContent = (
      <div className="alert alert-danger">
        {PostsListFetchPostsErrorMessage}
      </div>
    );
  }

  return (
    <React.Fragment>
      {postsRenderedContent}
      {statusPostLoadingData}
    </React.Fragment>
  );
};

export const PostExcerpt = ({ postId }) => {
  // const dispatch = useDispatch();
  const post = useSelector((state) => selectPostById(state, postId));

  return (

    <article className=" mb-1 p-1 border-bottom">
      <div className="row justify-content-sm-between">
        <div className="col">
          <h3>{post.title}</h3>
          {/* link here to single post page */}
        </div>

        <div className="col-sm-auto">
          <TimeAgo timeStamp={post.date}></TimeAgo>
        </div>
      </div>

      <div className="p-1">
        <ReadMoreText
          content={post.description}
          maxCharCount={120}
        ></ReadMoreText>
      </div>
    </article>
  );
};
