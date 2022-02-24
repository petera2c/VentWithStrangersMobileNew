import * as React from "react";
import { Platform } from "react-native";
import ReactDOMServer from "react-dom/server";
import avatars from "avataaars";
import { SvgUri } from "react-native-svg";
import Image from "react-native-remote-svg";

function Avatar(props) {
  if (Platform.OS === "ios")
    return (
      <SvgUri
        height="100%"
        width="100%"
        uri={
          "data:image/svg+xml;utf8," +
          ReactDOMServer.renderToString(React.createElement(avatars, props))
        }
      />
    );
  else
    return (
      <Image
        source={{
          uri:
            "data:image/svg+xml;utf8," +
            "data:image/svg+xml;utf8," +
            ReactDOMServer.renderToString(React.createElement(avatars, props)),
        }}
        style={{ width: "100%", height: "100%" }}
      />
    );
}

export default Avatar;
