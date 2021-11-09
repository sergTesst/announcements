import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";

import { client } from "../../api/client";
import {
  StatusData,
  postsRoute,
  singlePostRoute,
} from "../../api/ApiRoutes.js";

const sliceName = "posts";

const actionTypes = {
  fetchPosts: `${sliceName}/fetchPosts`,
  fetchSinglePost: `${sliceName}/fetchSinglePost`,
  addNewPost: `${sliceName}/addNewPost`,
  updatePost: `${sliceName}/updatePost`,
  deletePost: `${sliceName}/deletePost`,
  fetchSimilarPostsForPostId: `${sliceName}/similarPosts`,
};

export const fetchPosts = createAsyncThunk(
  actionTypes.fetchPosts,
  async ({ from, to }, { getState }) => {
    const { searchQuery } = getState().posts;

    let response;

    if (searchQuery === "") {
      response = await client.get(postsRoute, {
        headers: {
          from: from,
          to: to,
        },
      });
    } else {
      response = await client.get(`${postsRoute}/get/${searchQuery}`, {
        headers: {
          from: from,
          to: to,
        },
      });
    }

    const { posts, allPostsLength } = response;

    return { posts, allPostsLength };
  }
);

export const fetchSimilarPosts = createAsyncThunk(
  actionTypes.fetchSimilarPostsForPostId,
  async ({ from, to, postId }) => {
    const response = await client.get(`${postsRoute}/similar/${postId}`, {
      headers: {
        from: from,
        to: to,
      },
    });

    const { posts, allPostsLength } = response;

    return { posts, allPostsLength };
  }
);

export const fetchSinglePost = createAsyncThunk(
  actionTypes.fetchSinglePost,
  async ({ postId }) => {
    const url = singlePostRoute.replace(":postId", postId);

    const response = await client.get(url);

    const { fetchedPost, allPostsLength } = response;

    return { fetchedPost, allPostsLength };
  }
);

export const addNewPost = createAsyncThunk(
  actionTypes.addNewPost,
  async (initialPost, { getState }) => {
    const { searchQuery } = getState().posts;

    const response = await client.post(postsRoute, {
      post: initialPost,
      query: searchQuery,
    });

    const { fetchedPost, allPostsLength } = response;

    return { fetchedPost, allPostsLength };
  }
);

export const updatePost = createAsyncThunk(
  actionTypes.updatePost,
  async ({ postToUpdate, postId }) => {
    const response = await client.update(`${postsRoute}/${postId}`, {
      post: postToUpdate,
    });

    const { post } = response;
    return { id: post.id, changes: { ...post } };
  }
);

export const deletePost = createAsyncThunk(
  actionTypes.deletePost,
  async ({ postId }, { getState }) => {
    const { searchQuery } = getState().posts;

    const response = await client.post(`${postsRoute}/delete/${postId}`, {
      query: searchQuery,
    });

    const { deletedPostId, allPostsLength } = response;

    return { deletedPostId, allPostsLength };
  }
);

const postsAdapter = createEntityAdapter({});
const FetchIncrement = 5;

const initialState = postsAdapter.getInitialState({
  //entities

  fetchedAllEntitiesLength: 0,
  status: StatusData.idle,
  error: null,

  statusSinglePost: StatusData.idle,

  searchQuery: "",
  fetchFrom: 0,
  fetchTo: FetchIncrement,

  searchedTitlesAndIds: [],

  selectedPostId: null,
  similarEntities: {},
  similarEntitiesAllLength: 0,
  similarEntitiesStatus: StatusData.idle,
});

const queryIsNotEqualStateSearchQuery = (query, state) => {
  if (query !== state.searchQuery) {
    state.fetchFrom = 0;
    state.fetchTo = FetchIncrement;
    return true;
  }
  return false;
};

const postsSlice = createSlice({
  name: sliceName,
  initialState: initialState,

  reducers: {
    setSearchQuery(state, action) {
      const { query } = action.payload;

      queryIsNotEqualStateSearchQuery(query, state);

      state.searchQuery = query;
    },

    //dispatch this action after searchRequest
    changePaginationPropsForSearchQuery(state, action) {
      const { query } = action.payload;

      if (queryIsNotEqualStateSearchQuery(query, state)) return;

      const { fetchTo } = state;
      state.fetchFrom = fetchTo;
      state.fetchTo = fetchTo + FetchIncrement;
    },

    changePostsStatusToStartFetching(state, action) {
      if (state.status === StatusData.loading) return;
      const { newStatus } = action.payload;
      state.status = newStatus;
    },

    //dispatch this action when searching for other posts
    removeSearchRelatedEntities(state, action) {
      postsAdapter.removeAll(state);

      state.fetchedAllEntitiesLength = 0;
      state.status = StatusData.idle;
      state.error = null;
      state.statusSinglePost = StatusData.idle;
      state.searchQuery = "";
      state.fetchFrom = 0;
      state.fetchTo = FetchIncrement;
      state.searchedTitlesAndIds = [];
      state.selectedPostId = null;
      state.similarEntities = {};
      state.similarEntitiesAllLength = 0;
      state.similarEntitiesStatus = StatusData.idle;
    },

    //dispatch this action when leaving currentPost or viewing other post
    resetSimilarEntities(state, action) {
      state.similarEntities = {};
      state.similarEntitiesAllLength = 0;
      state.similarEntitiesStatus = StatusData.idle;
    },
  },

  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      setLoading(state, "status");
    },
    [fetchPosts.rejected]: (state, action) => {
      setFailed(state, "status");
    },
    [fetchPosts.fulfilled]: (state, action) => {
      setSucceeded(state, "status");
      const { posts, allPostsLength } = action.payload;

      state.fetchedAllEntitiesLength = allPostsLength;

      postsAdapter.upsertMany(state, posts);
    },

    [fetchSinglePost.pending]: (state, action) => {
      setLoading(state, "statusSinglePost");
    },
    [fetchSinglePost.rejected]: (state, action) => {
      setIdle(state, "statusSinglePost");
    },
    [fetchSinglePost.fulfilled]: (state, action) => {
      setSucceeded(state, "statusSinglePost");

      const { fetchedPost, allPostsLength } = action.payload;

      state.fetchedAllEntitiesLength = allPostsLength;

      postsAdapter.upsertOne(state, fetchedPost);
    },
    [addNewPost.fulfilled]: (state, action) => {
      const { fetchedPost, allPostsLength } = action.payload;

      state.fetchedAllEntitiesLength = allPostsLength;

      postsAdapter.addOne(state, fetchedPost);
    },

    [updatePost.fulfilled]: (state, action) => {
      postsAdapter.updateOne(state, action.payload);
    },

    [deletePost.fulfilled]: (state, action) => {
      const { deletedPostId, allPostsLength } = action.payload;
      state.fetchedAllEntitiesLength = allPostsLength;

      postsAdapter.removeOne(state, deletedPostId);
    },

    [fetchSimilarPosts.pending]: (state, action) => {
      state.similarEntitiesStatus = StatusData.loading;
    },
    [fetchSimilarPosts.rejected]: (state, action) => {
      state.similarEntitiesStatus = StatusData.succeeded;
    },
    [fetchSimilarPosts.fulfilled]: (state, action) => {
      const { posts, allPostsLength } = action.payload;
      state.similarEntitiesAllLength = allPostsLength;
      state.similarEntitiesStatus = StatusData.succeeded;

      const newEntities = {};
      posts.forEach((post) => {
        newEntities[post.id] = post;
      });

      state.similarEntities = {
        ...state.similarEntities,
        ...newEntities,
      };
    },
  },
});

function setIdle(state, statusToSet) {
  state[`${statusToSet}`] = StatusData.idle;
}
function setLoading(state, statusToSet) {
  state[`${statusToSet}`] = StatusData.loading;
}
function setFailed(state, statusToSet) {
  state[`${statusToSet}`] = StatusData.failed;
}
function setSucceeded(state, statusToSet) {
  state[`${statusToSet}`] = StatusData.succeeded;
}

export default postsSlice.reducer;

export const {
  setSearchQuery,
  changePaginationPropsForSearchQuery,
  changePostsStatusToStartFetching,

  removeSearchRelatedEntities,
  resetSimilarEntities,
} = postsSlice.actions;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostsIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectPostsStatus = (state) => state.posts.status;

export const selectSinglePostStatus = (state) => state.posts.statusSinglePost;

export const selectFetchedAllPostsLength = (state) =>
  state.posts.fetchedAllEntitiesLength;

export const selectSearchQuery = (state) => state.posts.searchQuery;

export const selectFromAndToForPagination = createSelector(
  (state) => state.posts.fetchFrom,
  (state) => state.posts.fetchTo,
  (from, to) => {
    return { from, to };
  }
);

export const selectSimilarPosts = (state) => state.posts.similarEntities;
export const selectSimilarPostsStatus = (state) =>
  state.posts.similarEntitiesStatus;

export const selectSimilarPostsAllLength = (state) =>
  state.posts.similarEntitiesAllLength;

export const selectSimilarPostsIds = createSelector(
  selectSimilarPosts,
  (entities) => {
    return Object.keys(entities);
  }
);

export const selectSimilarPostById = (state, postId) => {
  return selectSimilarPosts(state)[postId];
};
