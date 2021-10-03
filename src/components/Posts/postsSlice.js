import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';

import {client} from '../../api/client';
import {
	StatusData, 
	postsRoute
} from '../../api/ApiRoutes.js';

const actionTypes = {
	fetchPosts:'posts/fetchPosts',

}

export const fetchPosts = createAsyncThunk(
  actionTypes.fetchPosts,
  async ({ from, to }, { getState }) => {
      
    const response = await client.get(postsRoute, {
      headers: {
        from: from,
        to: to,
      },
    });

    const { posts, allPostsLength } = response;

    return { posts, allPostsLength };
  }
);

const postsAdapter = createEntityAdapter({});
const FetchIncrement = 5;

const initialState = postsAdapter.getInitialState({
  //entities

  fetchedAllEntitiesLength: 0,
  status: StatusData.idle,
  error: null,

  searchQuery: "",
  fetchFrom: 0,
  fetchTo: FetchIncrement,

  searchedTitlesAndIds: [],

	selectedPostId:null,
	similarEntities:{},

});

function queryIsNotEqualStateSearchQuery(query, state){

	if(query !== state.searchQuery){
		debugger;
		state.fetchFrom = 0;
		state.fetchTo = FetchIncrement;
		return true;
	}
	return false;
}

const postsSlice = createSlice({

	name:'posts',
	initialState:initialState,

	reducers:{

		setSearchQuery(state, action) {
      const { query } = action.payload;

      queryIsNotEqualStateSearchQuery(query, state);

      state.searchQuery = query;
    },

		//dispatch this action after searchRequest
		changePaginationPropsForSearchQuery(state, action) {
			const {query} = action.payload;

			if(queryIsNotEqualStateSearchQuery(query, state)) return;
			
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
		removeSearchRelatedEntities(state, action){

			postsAdapter.removeAll(state);
			state.searchQuery = '';
			state.fetchedAllEntitiesLength = 0;
			state.fetchFrom = 0;
			state.fetchTo = FetchIncrement;
			state.status = StatusData.idle;
			state.error = null;
			state.searchedTitlesAndIds = [];

			state.selectedPostId = null;
			state.similarEntities = {};
		}, 

		//dispatch this action when leaving currentPost or viewing other post
		resetSimilarEntities(state, action){
			state.similarEntities = {};
		}
	},

	extraReducers:{
    [fetchPosts.pending]: (state, action) => {
      state.status = StatusData.loading;
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = StatusData.failed;
    },
		[fetchPosts.fulfilled]: (state, action) => {
      state.status = StatusData.succeeded;
      const { posts, allPostsLength } = action.payload;

      state.fetchedAllEntitiesLength = allPostsLength;

      postsAdapter.upsertMany(state, posts);
    },

	}
})

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

export const selectPostsStatus = state => state.posts.status;

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