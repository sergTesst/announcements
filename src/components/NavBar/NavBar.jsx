import { Link, useHistory } from "react-router-dom";

import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import {
  removeSearchRelatedEntities,
  setSearchQuery,
  selectFetchedAllPostsLength,
  selectSearchQuery,
} from "../Posts/postsSlice.js";

import { StatusData } from "../../api/ApiRoutes";

export const Navbar = () => {
  const allPostsLength = useSelector(selectFetchedAllPostsLength);

  return (
    <nav className="navbar navbar-expand-md navbar-light shadow bg-light fixed-top ">
      <div className="container">
        <div className="row w-100">
          <div className="col-sm-3 col-12 d-flex justify-content-center">
            <Link
              className={classNames("link-dark text-decoration-none")}
              to="/"
            >
              Announcements ({allPostsLength})
            </Link>
          </div>

          <SearchPart></SearchPart>
        </div>
      </div>
    </nav>
  );
};

const SearchPart = () => {
  const dispatch = useDispatch();

  const [text, setText] = useState("");

  const [loadingStatus, setLoadingStatus] = useState(StatusData.idle);

  const history = useHistory();

  const searchInput = useRef(null);

  const query = useSelector(selectSearchQuery);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    const trimmedText = text.trim();

    if (e.key === "Enter" && trimmedText) {
      setLoadingStatus(StatusData.loading);

      dispatch(removeSearchRelatedEntities());

      dispatch(setSearchQuery({ query: trimmedText }));

      history.push(`/`);

      setLoadingStatus(StatusData.idle);
    }
  };

  let isLoading = loadingStatus === StatusData.loading;

  return (
    <React.Fragment>
      <div className="col-12 col-sm-6 col-md-5">
        <input
          ref={searchInput}
          id="search"
          className="form-control"
          type="search"
          placeholder="search for announcements..."
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Search"
          disabled={isLoading}
          autoComplete="off"
        />
      </div>

      {query !== "" && (
        <div className="col-12 col-sm-3">
          <span>{query} </span>
          <button
            className="btn border border-secondary"
            onClick={() => {
              dispatch(removeSearchRelatedEntities());
              setText("");
            }}
          >
            x
          </button>
        </div>
      )}
    </React.Fragment>
  );
};
