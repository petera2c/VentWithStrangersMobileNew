import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ProgressBar, Colors } from "react-native-paper";

import Screen from "../../components/containers/Screen";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import {
  calculateMilestone,
  getNextMilestone,
  getUserRecentRewards,
  getUserRewardsProgress,
} from "./util";

dayjs.extend(relativeTime);

function RewardsScreen({ navigation }) {
  const { user } = useContext(UserContext);

  const [recentRewards, setRecentRewards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userRewards, setUserRewards] = useState({});

  useEffect(() => {
    if (user) {
      getUserRecentRewards(setRecentRewards, user.uid);
      getUserRewardsProgress(setUserRewards, user.uid);
    }
    setTimeout(() => setRefreshing(false), 400);
  }, [refreshing, setRefreshing, user]);

  return (
    <Screen navigation={navigation}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View style={{ ...styles.pa16 }}>
          <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
            <Text style={{ ...styles.title, ...styles.mb16 }}>
              Your Upcoming Rewards
            </Text>
            <View style={{ ...styles.mb16 }}>
              <CounterDisplay
                counter={userRewards.created_vents_counter}
                size="small"
                tooltip="The total number of vents you have created :)"
                title="Vents Created"
              />
              <CounterDisplay
                counter={userRewards.created_vent_supports_counter}
                size="medium"
                tooltip="The total number of vents you have supported :)"
                title="Vents You Supported"
              />
              <CounterDisplay
                counter={userRewards.received_vent_supports_counter}
                size="medium"
                tooltip="The total number of supports received on your vents :)"
                title="Vent Supports Received"
              />
            </View>
            <View style={{ ...styles.mb16 }}>
              <CounterDisplay
                counter={userRewards.created_comments_counter}
                size="small"
                tooltip="The total number of comments you have created :)"
                title="Comments Created"
              />
              <CounterDisplay
                counter={userRewards.created_comment_supports_counter}
                size="medium"
                tooltip="The total number of comments you have supported :)"
                title="Comments You Supported"
              />
              <CounterDisplay
                counter={userRewards.received_comment_supports_counter}
                size="medium"
                tooltip="The total number of supports received on your comments :)"
                title="Comment Supports Received"
              />
            </View>
            <View style={{ ...styles.mb16 }}>
              <CounterDisplay
                counter={userRewards.created_quotes_counter}
                size="small"
                tooltip="The total number of quotes you have created :)"
                title="Quotes Created"
              />
              <CounterDisplay
                counter={userRewards.created_quote_supports_counter}
                size="medium"
                tooltip="The total number of quotes you have supported :)"
                title="Quotes You Supported"
              />
              <CounterDisplay
                counter={userRewards.received_quote_supports_counter}
                size="medium"
                tooltip="The total number of supports received on your quotes :)"
                title="Quote Supports Received"
              />
              <CounterDisplay
                counter={userRewards.quote_contests_won_counter}
                size="tiny"
                tooltip="The total number of quote contests you have won :)"
                title="Quote Contests Won"
              />
            </View>
          </View>
          <View>
            <Text style={{ ...styles.title, ...styles.mb16 }}>
              Recent Rewards
            </Text>
            {recentRewards.map((obj, index) => (
              <View
                key={index}
                style={{ ...styles.box, ...styles.mb16, ...styles.pa16 }}
              >
                <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                  {obj.title}
                </Text>
                <Text
                  style={{ ...styles.fs20, ...styles.colorMain, ...styles.mb8 }}
                >
                  + {obj.karma_gained} Karma Points
                </Text>
                <Text style={{ ...styles.fs18, ...styles.colorGrey1 }}>
                  {dayjs(obj.server_timestamp).fromNow()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function CounterDisplay({ counter = 0, size, tooltip, title }) {
  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <View style={{ ...styles.mb16 }}>
      <View
        align="center"
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.wrap,
          ...styles.mb8,
        }}
      >
        <Text style={{ ...styles.fs24, ...styles.colorGrey1, ...styles.mr16 }}>
          {title}
        </Text>
        <Text style={{ ...styles.pTag }}>
          {counter}/{getNextMilestone(counter, size)}
        </Text>
      </View>
      <ProgressBar
        progress={counter / getNextMilestone(counter, size)}
        color="#2096f2"
      />

      <Text className="flex justify-end" style={{ lineHeight: 1.25 }}>
        {calculateMilestone(counter, size)} Karma Points
      </Text>
    </View>
  );
}

export default RewardsScreen;
