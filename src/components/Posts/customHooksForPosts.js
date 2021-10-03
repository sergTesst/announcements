
import { StatusData } from "../../api/ApiRoutes";
import { Loader } from "../helperComponents/Loader";

export const useLoadingStatusToRenderLoader = (trackingStatus) => {
  let statusPostLoadingData = null;
  if (trackingStatus === StatusData.loading) {
    statusPostLoadingData = <Loader></Loader>;
  } else if (trackingStatus === StatusData.succeeded) {
    statusPostLoadingData = null;
  }

  return { statusPostLoadingData };
};