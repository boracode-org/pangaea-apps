import * as PropTypes from "prop-types";
import { requireNativeComponent, View } from "react-native";

const MediaPlayer = requireNativeComponent("RCTMediaPlayer", {
  name: "MediaPlayer",
  propTypes: {
    uri: PropTypes.string.isRequired,
    speed: PropTypes.string,
    play: PropTypes.bool,
    ...View.propTypes
  }
});
export default MediaPlayer;
