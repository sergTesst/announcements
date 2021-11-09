import React, { useRef } from "react";
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
  deletePost,
  changePaginationPropsForSearchQuery,
  changePostsStatusToStartFetching,
} from "./postsSlice";

import { StatusData } from "../../api/ApiRoutes";
import { TimeAgo } from "../helperComponents/TimeAgo";

import {
  useLoadingStatusToRenderLoader,
  useStatusAndArrOfIdsToFetchData,
  scrollHandlerWithCallBack,
  useLoadingStatusToAddOrRemoveScrollListeners,
} from "./customHooksForPosts";

import { ReadMoreText } from "../helperComponents/ReadMoreText.jsx";

import { singlePostPath, editPostPath } from "../../api/ApiRoutes";

import { atTheBottom } from "../../helpers/atTheBottom.js";

const PostsListFetchPostsErrorMessage =
  "There is an error occurred. Try again later.";

const useToggleActionsHandler = () => {
  const isMenuShown = useRef(false);
  const currentMenuElem = useRef(null);

  const toggleActionsHandler = (e) => {
    let nextElSibling = e.target["nextElementSibling"];

    if (nextElSibling) {
      if (
        currentMenuElem.current &&
        isMenuShown &&
        currentMenuElem.current !== nextElSibling
      ) {
        currentMenuElem.current.style = null;
        isMenuShown.current = false;
      }
      currentMenuElem.current = e.target["nextElementSibling"];
    } else {
      return;
    }

    if (!isMenuShown.current) {
      const { style } = currentMenuElem.current;
      style.display = "block";
      style.right = `0px`;
      isMenuShown.current = true;
    } else {
      currentMenuElem.current.style = null;
      isMenuShown.current = false;
    }
  };

  return { toggleActionsHandler };
};

export const PostsList = ({ themeClasses }) => {
  const dispatch = useDispatch();

  const postsIds = useSelector((state) => selectPostsIds(state));
  const postsStatus = useSelector(selectPostsStatus);

  const allFetchedPostsLength = useSelector(selectFetchedAllPostsLength);
  const fromAndTo = useSelector((state) => selectFromAndToForPagination(state));

  const query = useSelector(selectSearchQuery);

  const handleScroll = scrollHandlerWithCallBack(atTheBottom, () => {
    dispatch(changePostsStatusToStartFetching({ newStatus: StatusData.idle }));
  });

  useLoadingStatusToAddOrRemoveScrollListeners({
    itemIdsArr: postsIds,
    allItemsLength: allFetchedPostsLength,
    handler: handleScroll,
  });

  useStatusAndArrOfIdsToFetchData(
    {
      itemsStatus: postsStatus,
      idsArr: postsIds,
      allItemsLength: allFetchedPostsLength,
      scrollHandler: handleScroll,
    },
    async function fetchPostsAndSetPagination() {
      dispatch(fetchPosts({ ...fromAndTo }));
      dispatch(changePaginationPropsForSearchQuery({ query: query }));
    }
  );

  const { statusPostLoadingData } = useLoadingStatusToRenderLoader(postsStatus);

  const { toggleActionsHandler } = useToggleActionsHandler();

  let postsRenderedContent;

  if (postsStatus === StatusData.failed) {
    postsRenderedContent = (
      <div className="alert alert-danger">
        {PostsListFetchPostsErrorMessage}
      </div>
    );
    return <React.Fragment>{postsRenderedContent}</React.Fragment>;
  }

  if (postsIds.length === 0 && postsStatus === StatusData.succeeded) {
    return (
      <React.Fragment>
        <h3>no search results for {query}. Try changing the search words</h3>
      </React.Fragment>
    );
  }

  postsRenderedContent = postsIds.map((postId) => {
    return (
      <PostExcerpt
        toggleActionsHandler={toggleActionsHandler}
        themeClasses={themeClasses}
        key={postId}
        postId={postId}
      ></PostExcerpt>
    );
  });

  return (
    <React.Fragment>
      {postsRenderedContent}
      {statusPostLoadingData}
    </React.Fragment>
  );
};

export const PostExcerpt = ({ toggleActionsHandler, postId, themeClasses }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  const dispatch = useDispatch();

  return (
    <article className=" mb-1 p-1 border-bottom">
      <div className="row justify-content-sm-between">
        <div className="col">
          <Link
            className={themeClasses}
            to={singlePostPath.replace(":postId", `${postId}`)}
          >
            <h3>{post.title}</h3>
          </Link>
        </div>
        <div className="col-sm-auto">
          <div className="btn-group">
            <span onClick={toggleActionsHandler} className="p-2 hoverable">
              &#x25CF; &#x25CF; &#x25CF;
            </span>
            <ul className="dropdown-menu">
              <li>
                <Link
                  className="dropdown-item hoverable"
                  to={editPostPath.replace(":postId", `${postId}`)}
                >
                  edit
                </Link>
              </li>
              <li>
                <span
                  onClick={() => {
                    dispatch(deletePost({ postId }));
                  }}
                  className="dropdown-item hoverable"
                >
                  delete
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="p-1">
        <ReadMoreText
          content={post.description}
          maxCharCount={120}
        ></ReadMoreText>
      </div>
      <div className="row justify-content-end">
        <div className="col-sm-auto">
          <TimeAgo timeStamp={post.date}></TimeAgo>
        </div>
      </div>
    </article>
  );
};
