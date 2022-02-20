import * as React from "react";
import { View, PixelRatio } from "react-native";
import ReactDOMServer from "react-dom/server";
import { default as AvatarReact } from "avataaars";
import { SvgUri } from "react-native-svg";

var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();

var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

var Avatar = (function (_super) {
  __extends(Avatar, _super);
  function Avatar() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Avatar.prototype.render = function () {
    var size = this.props.size;

    return (
      <SvgUri
        height="100%"
        width="100%"
        uri={
          "data:image/svg+xml;utf8," +
          ReactDOMServer.renderToString(
            React.createElement(AvatarReact, __assign(this.props))
          )
        }
      />
    );
  };
  return Avatar;
})(React.Component);

export default Avatar;
