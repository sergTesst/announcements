import React, { useEffect } from "react";

import { useParams } from "react-router";

import {Link} from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";

import {
  selectPostById,
  fetchSinglePost,
  selectSinglePostStatus,
  fetchSimilarPosts,
  resetSimilarEntities,
  selectSimilarPostsIds,
  selectSimilarPostsStatus,
  selectSimilarPostById,
} from "./postsSlice";

import {
  usePostIdToSelectOrFetchPost,
  useLoadingStatusToRenderLoader,
} from "./customHooksForPosts";

import { StatusData, singlePostPath } from "../../api/ApiRoutes";

import { TimeAgo } from "../helperComponents/TimeAgo";

import { ReadMoreText } from "../helperComponents/ReadMoreText";

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

  return <SinglePostWithSimilarPosts post={post}></SinglePostWithSimilarPosts>;
};

export const SinglePostWithSimilarPosts = ({ post }) => {
  const dispatch = useDispatch();

  const { id } = post;

  const similarPostIds = useSelector(selectSimilarPostsIds);

  const similarPostsStatus = useSelector(selectSimilarPostsStatus);

  useEffect(() => {
    dispatch(fetchSimilarPosts({ from: 0, to: 3, postId: id }));
    return () => {
      dispatch(resetSimilarEntities());
    };
  }, [id, dispatch]);

  const { statusPostLoadingData } =
    useLoadingStatusToRenderLoader(similarPostsStatus);

  const similarPostsRenderedContent = similarPostIds.map((postId) => {
    return (
      <SimilarPostExcerpt key={postId} postId={postId}></SimilarPostExcerpt>
    );
  });

  return (
    <article className=" mb-1 p-1 ">
      <div className="row ">
        <div className="col-sm-7">
          <PostView
            post={post}
            descriptionLength={post.description.length}
            render={()=>{
              return ( <h3>{post.title}</h3> )
            }}
          ></PostView>
        </div>
        <div className="col-sm-5">
          <div className="row">
            <div className="row">
              <div className="col-12">
                <h2>Similar announcements</h2>
              </div>
            </div>

            {similarPostsRenderedContent}
            {statusPostLoadingData}
          </div>
        </div>
      </div>
    </article>
  );
};

export const SimilarPostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectSimilarPostById(state, postId));

  return (
    <PostView
      post={post}
      descriptionLength={120}
      render={() => {
        return (
          <Link
            className='link-dark text-decoration-none'
            to={singlePostPath.replace(":postId", `${postId}`)}>
            <h3>{post.title}</h3>
          </Link>
        );
      }}
    ></PostView>
  );
};

const PostView = ({ post, descriptionLength, render }) => {
  return (
    <React.Fragment>
      <div className="row justify-content-sm-between">
        <div className="col">{render()}</div>
      </div>
      <div className="row justify-content-end">
        <div className="col-sm-auto">
          <TimeAgo timeStamp={post.date}></TimeAgo>
        </div>
      </div>

      <div className="p-1">
        <ReadMoreText
          content={post.description}
          maxCharCount={descriptionLength}
        ></ReadMoreText>
      </div>
    </React.Fragment>
  );
};
