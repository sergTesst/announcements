import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { addNewPost } from "./postsSlice";

import { unwrapResult } from "@reduxjs/toolkit";
import { StatusData } from "../../api/ApiRoutes";

import { PostForm } from "./PostForm";

export const AddPostForm = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [addRequestStatus, setAddRequestStatus] = useState(StatusData.idle);

  const canSave =
    Boolean(title) &&
    Boolean(description) &&
    addRequestStatus === StatusData.idle;

  const savePostClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus(StatusData.loading);

        const resultOfAddNewPost = await dispatch(
          addNewPost({ title, description })
        );

        unwrapResult(resultOfAddNewPost);

        setTitle("");
        setDescription("");
      } catch (err) {
        console.error("Failed to save the announcement", err);
      } finally {
        setAddRequestStatus(StatusData.idle);
      }
    }
  };

  return (
    <React.Fragment>
      <h2>Add a new announcement</h2>

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
