import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../../components/containers/Screen";
import NewVentComponent from "../../components/NewVent";
import TrendingOptions from "../../components/modals/TrendingOptions";
import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import { getMetaInformation, getVents, newVentListener } from "./util";

function FeedScreen({ navigation, route }) {
  const { user } = useContext(UserContext);

  const [canLoadMore, setCanLoadMore] = useState(true);
  const [pathname, setPathname] = useState(user ? "/my-feed" : "/recent");
  const [refreshing, setRefreshing] = useState(false);
  const [trendingOptions, setTrendingOptions] = useState(false);
  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);

  useEffect(() => {
    let newVentListenerUnsubscribe;

    setWaitingVents([]);
    setVents([]);
    setCanLoadMore(true);

    getVents(pathname, setCanLoadMore, setVents, user, null);
    newVentListenerUnsubscribe = newVentListener(pathname, setWaitingVents);

    setTimeout(() => setRefreshing(false), 400);

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [pathname, refreshing, setCanLoadMore, setRefreshing, user]);

  return (
    <Screen
      navigation={navigation}
      Title={() => (
        <View
          style={{
            ...styles.flexRow,
            ...styles.justifyBetween,
            ...styles.bgWhite,
            ...styles.py16,
          }}
        >
          {user && (
            <TouchableOpacity
              onPress={() => setPathname("/my-feed")}
              style={{
                ...styles.flexFill,
                ...(pathname === "/my-feed"
                  ? styles.borderBottomMain
                  : styles.borderBottom),
                ...styles.py8,
                ...styles.mx8,
              }}
            >
              <Text
                style={{
                  ...styles.fs24,
                  ...styles.bold,
                  ...styles.tac,
                  ...(pathname === "/my-feed"
                    ? styles.colorMain
                    : styles.colorGrey1),
                }}
              >
                My Feed
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setPathname("/recent")}
            style={{
              ...styles.flexFill,
              ...(pathname === "/recent"
                ? styles.borderBottomMain
                : styles.borderBottom),
              ...styles.py8,
              ...styles.mx8,
            }}
          >
            <Text
              style={{
                ...styles.fs24,
                ...styles.bold,
                ...styles.tac,
                ...(pathname === "/recent"
                  ? styles.colorMain
                  : styles.colorGrey1),
              }}
            >
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPathname("/trending")}
            style={{
              ...styles.flexFill,
              ...(isTrending(pathname)
                ? styles.borderBottomMain
                : styles.borderBottom),
              ...styles.py8,
              ...styles.mx8,
            }}
          >
            <Text
              style={{
                ...styles.fs24,
                ...styles.bold,
                ...styles.tac,
                ...(isTrending(pathname)
                  ? styles.colorMain
                  : styles.colorGrey1),
              }}
            >
              Trending
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View style={{ ...styles.pa16 }}>
          <NewVentComponent miniVersion navigation={navigation} />
          {isTrending(pathname) && (
            <TouchableOpacity
              onPress={() => setTrendingOptions(true)}
              style={{
                ...styles.flexRow,
                ...styles.alignCenter,
                ...styles.pt16,
              }}
            >
              <Text
                style={{ ...styles.fs18, ...styles.colorGrey11, ...styles.mr4 }}
              >
                {pathname === "/trending/this-week"
                  ? "Trending This Week"
                  : pathname === "/trending/this-month"
                  ? "Trending This Month"
                  : "Trending Today"}
              </Text>
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ ...styles.colorGrey11 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <TrendingOptions
          close={() => setTrendingOptions(false)}
          options={[
            {
              isActive: pathname === "/trending",
              onClick: () => setPathname("/trending"),
              title: "Trending Today",
            },
            {
              isActive: pathname === "/trending/this-week",
              onClick: () => setPathname("/trending/this-week"),
              title: "Trending This Week",
            },
            {
              isActive: pathname === "/trending/this-month",
              onClick: () => setPathname("/trending/this-month"),
              title: "Trending This Month",
            },
          ]}
          visible={trendingOptions}
        />

        <View style={{ ...styles.px16 }}>
          {waitingVents.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setVents((vents) => [...waitingVents, ...vents]);
                setWaitingVents([]);
              }}
              style={{
                ...styles.bgWhite,
                ...styles.border,
                ...styles.br32,
                ...styles.mb16,
                ...styles.pa8,
              }}
            >
              <Text style={{ ...styles.fs20, ...styles.tac }}>
                Load New Vent{waitingVents.length > 1 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          )}
          {vents &&
            vents.map((vent, index) => {
              return (
                <View className="column x-fill gap8" key={vent.id}>
                  <Vent
                    navigation={navigation}
                    previewMode={true}
                    ventID={vent.id}
                    ventInit={vent.title ? vent : undefined}
                  />
                </View>
              );
            })}
        </View>
      </ScrollView>
    </Screen>
  );
}

function isTrending(pathname) {
  return (
    pathname === "/trending" ||
    pathname === "/trending/this-week" ||
    pathname === "/trending/this-month"
  );
}

export default FeedScreen;
