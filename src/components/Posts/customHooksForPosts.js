
import { StatusData } from "../../api/ApiRoutes";
import { Loader } from "../helperComponents/Loader";
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

export const useLoadingStatusToRenderLoader = (trackingStatus) => {
  let statusPostLoadingData = null;
  if (trackingStatus === StatusData.loading) {
    statusPostLoadingData = <Loader></Loader>;
  } else if (trackingStatus === StatusData.succeeded) {
    statusPostLoadingData = null;
  }

  return { statusPostLoadingData };
};


export const usePostIdToSelectOrFetchPost = ({ postId, postSelector, postFetcher }) => {

  const dispatch = useDispatch();

  const post = useSelector((state) => postSelector(state, postId));

  useEffect(() => {
    if (!post) {
      dispatch(postFetcher({ postId }));
    }
  },[postId, dispatch, post, postFetcher]);

  return post;
};