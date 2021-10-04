import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';

import {client} from '../../api/client';
import {
	StatusData, 
	postsRoute,
	singlePostRoute
} from '../../api/ApiRoutes.js';


const sliceName = 'posts';

const actionTypes = {
	fetchPosts:`${sliceName}/fetchPosts`,
	fetchSinglePost:`${sliceName}/fetchSinglePost`,
	addNewPost:`${sliceName}/addNewPost`,
	updatePost: `${sliceName}/updatePost`,
	deletePost: `${sliceName}/deletePost`,

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


export const fetchSinglePost = createAsyncThunk(
	actionTypes.fetchSinglePost,
	async ({postId}) => {

		const url = singlePostRoute.replace(':postId', postId);

		const response = await client.get(url);

    const { fetchedPost, allPostsLength } = response;

    return { fetchedPost, allPostsLength };
	}
);

export const addNewPost = createAsyncThunk(
	actionTypes.addNewPost,
	async(initialPost)=>{

		const response  = await client.post(postsRoute,{post:initialPost});
		return response.post;
});

export const updatePost = createAsyncThunk(
	actionTypes.updatePost,
	async({postToUpdate, postId})=>{

		const response  = await client.update(`${postsRoute}/${postId}`,{post:postToUpdate});
		debugger;
		const {post} = response;
		return {id:post.id, changes: {...post}};
});

export const deletePost = createAsyncThunk(
	actionTypes.deletePost,
	async({postId})=>{

		const response  = await client.delete(`${postsRoute}/${postId}`);
		debugger;
		return response.postId;
});


const postsAdapter = createEntityAdapter({});
const FetchIncrement = 5;

const initialState = postsAdapter.getInitialState({
  //entities

  fetchedAllEntitiesLength: 0,
  status: StatusData.idle,
  error: null,
	
	statusSinglePost:StatusData.idle,
	
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

	name:sliceName,
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
      setLoading(state,"statusSinglePost");
    },
    [fetchSinglePost.rejected]: (state, action) => {
      setIdle(state,"statusSinglePost");
    },
		[fetchSinglePost.fulfilled]:(state, action)=>{
			setSucceeded(state,"statusSinglePost");

			const { fetchedPost, allPostsLength } = action.payload;
			state.fetchedAllEntitiesLength = allPostsLength;
			postsAdapter.upsertOne(state, fetchedPost);
		},
		[addNewPost.fulfilled]:(state,action)=>{

			postsAdapter.addOne(state, action.payload);
		},

		[updatePost.fulfilled]:(state, action) => {

			postsAdapter.updateOne(state, action.payload);
		},

		[deletePost.fulfilled]:(state, action) => {

			postsAdapter.removeOne(state, action.payload);
		},

	}
})

function setIdle(state, statusToSet){
	state[`${statusToSet}`] = StatusData.idle;
}
function setLoading(state, statusToSet){
	state[`${statusToSet}`] = StatusData.loading;
}
function setFailed(state, statusToSet){
	state[`${statusToSet}`] = StatusData.failed;
}
function setSucceeded(state, statusToSet){
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

export const selectPostsStatus = state => state.posts.status;

export const selectSinglePostStatus = state => state.posts.statusSinglePost;

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