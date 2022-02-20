import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { styles } from "../../styles";

dayjs.extend(relativeTime);

function NotificationList({ navigation, notifications }) {
  return (
    <View>
      {notifications.map((notification, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.jumpTo("SingleVent", {
              ventID: getVentIDFromLink(notification.link),
            })
          }
          style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}
        >
          <Text style={{ ...styles.fs20, ...styles.mb8 }}>
            {notification.message}
          </Text>
          <Text style={{ ...styles.fs18, ...styles.colorGrey5, ...styles.tar }}>
            {dayjs(notification.server_timestamp).fromNow()}
          </Text>
        </TouchableOpacity>
      ))}
      {((notifications && notifications.length === 0) || !notifications) && (
        <View style={{ ...styles.box, ...styles.pa32 }}>
          <Text style={{ ...styles.titleSmall, ...styles.tac }}>
            There are no notifications to show!
          </Text>
        </View>
      )}
    </View>
  );
}

function getVentIDFromLink(link) {
  if (link) link = link.substring(1, link.length);

  return link.substring(link.indexOf("/") + 1, link.lastIndexOf("/"));
}

export default NotificationList;
