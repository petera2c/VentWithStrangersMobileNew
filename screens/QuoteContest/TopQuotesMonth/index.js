import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from "dayjs";

import Screen from "../../../components/containers/Screen";

import { styles } from "../../../styles";

import { capitolizeFirstChar, getUserBasicInfo } from "../../../util";
import { getQuotes } from "./util";

function TopQuotesMonthScreen({ navigation }) {
  const [quotes, setQuotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [thisMonthYearFormatted, setThisMonthYearFormatted] = useState();

  useEffect(() => {
    setThisMonthYearFormatted(dayjs().format("MMMM YYYY"));
    getQuotes(setQuotes);

    setTimeout(() => setRefreshing(false), 400);
  }, [refreshing, setQuotes, setRefreshing]);

  return (
    <Screen navigation={navigation}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
        style={{ ...styles.pa16 }}
      >
        <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
          <Text style={{ ...styles.title, ...styles.mb8 }}>
            {thisMonthYearFormatted} Feel Good Quotes
          </Text>
          <Text style={{ ...styles.pTag, ...styles.tac }}>
            Some of our favourites :)
          </Text>
        </View>

        {quotes.map((quote, index) => (
          <QuoteDisplay key={quote.id} navigation={navigation} quote={quote} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function QuoteDisplay({ navigation, quote }) {
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      setUserBasicInfo(userBasicInfo);
    }, quote.userID);
  }, [quote, setUserBasicInfo]);

  return (
    <View
      style={{
        ...styles.box,
        ...styles.fullCenter,
        ...styles.mb16,
        ...styles.pa32,
      }}
    >
      <Text style={{ ...styles.fs20, ...styles.tac, ...styles.mb8 }}>
        "{capitolizeFirstChar(quote.value)}"
      </Text>
      <TouchableOpacity
        onPress={() => navigation.jumpTo("Profile", { userID: quote.userID })}
        style={{ ...styles.mb16 }}
      >
        <Text style={{ ...styles.pTag, ...styles.colorMain }}>
          - {capitolizeFirstChar(userBasicInfo.displayName)}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          ...styles.xFill,
          ...styles.pTag,
          ...styles.fs16,
          ...styles.tar,
        }}
      >
        {dayjs(quote.server_timestamp).format("MMMM DD, YYYY")}
      </Text>
    </View>
  );
}

export default TopQuotesMonthScreen;
