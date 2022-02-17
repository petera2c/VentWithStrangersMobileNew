import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function NotificationList({ navigation, notifications }) {
  return (
    <View className="column x-fill">
      {notifications.map((notification, index) => {
        return (
          <TouchableOpacity
            className="column border-bottom grey-1 pa16"
            key={index}
            to={notification.link}
          >
            <Text>{notification.message}</Text>
            <Text className="grey-1 ic">
              {dayjs(notification.server_timestamp).fromNow()}
            </Text>
          </TouchableOpacity>
        );
      })}
      {((notifications && notifications.length === 0) || !notifications) && (
        <View className="full-center">
          <Text className="fw-400 pa16">
            There are no notifications to show!
          </Text>
        </View>
      )}
    </View>
  );
}

export default NotificationList;
