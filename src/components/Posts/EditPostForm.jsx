import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { selectPostById } from "./postsSlice";

import { StatusData } from "../../api/ApiRoutes";

import { PostForm } from "./PostForm";

import { updatePost, fetchSinglePost } from "./postsSlice";

import { unwrapResult } from "@reduxjs/toolkit";

import { useParams, useHistory } from "react-router";

import { usePostIdToSelectOrFetchPost } from "./customHooksForPosts";

import { singlePostPath } from "../../api/ApiRoutes";

export const EditPostWrapper = () => {
  let { postId } = useParams();

  const post = usePostIdToSelectOrFetchPost({
    postId,
    postSelector: selectPostById,
    postFetcher: fetchSinglePost,
  });

  if (!post) {
    return (
      <section>
        <h2>Announcement with id {postId} is not found</h2>
      </section>
    );
  }

  return <EditPostForm post={post}></EditPostForm>;
};

export const EditPostForm = ({ post }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);

  const [addRequestStatus, setAddRequestStatus] = useState(StatusData.idle);
	const history  = useHistory();

  const canSave =
    ( Boolean(title !== post.title) || Boolean(description !== post.description)) &&
    addRequestStatus === StatusData.idle;

  const savePostClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus(StatusData.loading);

        const resultOfPostUpdate = await dispatch(
          updatePost({
            postToUpdate: {
              ...post,
              title,
              description,
            },
            postId: post.id,
          })
        );

        unwrapResult(resultOfPostUpdate);

        setTitle("");
        setDescription("");
			
      } catch (err) {
        console.error("Failed to save the announcement", err);
      } finally {
        setAddRequestStatus(StatusData.idle);

				history.push(singlePostPath.replace(':postId', post.id));
      }
    }
  };

  return (
    <React.Fragment>
      <h2>Update an announcement</h2>

      <PostForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        canSave={canSave}
        savePostClicked={savePostClicked}
      ></PostForm>
    </React.Fragment>
  );
};
