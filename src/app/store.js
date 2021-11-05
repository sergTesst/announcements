import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../components/Posts/postsSlice';

import { logm } from '../helpers/custom-logger';

const loggerMiddleware = storeAPI => next => action =>{

  logm('dispatching', action);
  let result = next(action);
  logm('next state', storeAPI.getState());
  return result;

}

export const store = configureStore({
  reducer: {
    posts:postsReducer
  },
	middleware:(getDefaultMiddleware) =>
		getDefaultMiddleware().concat(loggerMiddleware)
});
