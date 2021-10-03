import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../components/Posts/postsSlice'

const loggerMiddleware = storeAPI => next => action =>{

  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', storeAPI.getState());
  return result;

}

export const store = configureStore({
  reducer: {
    posts:postsReducer
  },
	middleware:(getDefaultMiddleware) =>
		getDefaultMiddleware().concat(loggerMiddleware)
});
