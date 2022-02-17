import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

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

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [pathname, setCanLoadMore, user]);

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
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          <NewVentComponent navigation={navigation} />
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
          pathname={pathname}
          setPathname={setPathname}
          visible={trendingOptions}
        />

        <View style={{ ...styles.px16 }}>
          {waitingVents.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setVents((vents) => [...waitingVents, ...vents]);
                setWaitingVents([]);
              }}
              style={{ ...styles.bgWhite, ...styles.border, ...styles.br32 }}
            >
              <View>Load New Vent{waitingVents.length > 1 ? "s" : ""}</View>
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
