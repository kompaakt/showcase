import { useEffect } from "react";
import YOUTUBE_API from "../config";

const fetchVideoInfo = ({ id, setInfo }) =>
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet&key=${YOUTUBE_API}`
    )
      .then(resp => resp.json())
      .then(data => {
        setInfo(data.items[0]);
      });
    return () => {};
  }, []);

export default fetchVideoInfo;
