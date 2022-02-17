import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from "dayjs";

import { faChevronCircleUp } from "@fortawesome/pro-solid-svg-icons/faChevronCircleUp";
import { faQuoteLeft } from "@fortawesome/pro-regular-svg-icons/faQuoteLeft";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import ContentOptions from "../../components/ContentOptions";
import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import {
  calculateKarma,
  capitolizeFirstChar,
  countdown,
  formatSeconds,
  getUserBasicInfo,
  hasUserBlockedUser,
  userSignUpProgress,
} from "../../util";
import {
  deleteQuote,
  getCanUserCreateQuote,
  getHasUserLikedQuote,
  getQuotes,
  likeOrUnlikeQuote,
  reportQuote,
  saveQuote,
} from "./util";

function QuoteContestScreen({ navigation }) {
  const { user, userBasicInfo } = useContext(UserContext);

  const [canLoadMoreQuotes, setCanLoadMoreQuotes] = useState(true);
  const [canUserCreateQuote, setCanUserCreateQuote] = useState(true);
  const [contestTimeLeft, setContestTimeLeft] = useState();
  const [myQuote, setMyQuote] = useState("");
  const [quoteID, setQuoteID] = useState();
  const [quotes, setQuotes] = useState([]);
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (user) getCanUserCreateQuote(setCanUserCreateQuote, user.uid);
    getQuotes(undefined, setCanLoadMoreQuotes, setQuotes);
    let timeLeftDayjs = new dayjs().utcOffset(0).add(1, "day");
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("minute", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);
    timeLeftDayjs = timeLeftDayjs.set("hour", 0);

    countdown(timeLeftDayjs, setContestTimeLeft);
    let interval = setInterval(
      () => countdown(timeLeftDayjs, setContestTimeLeft),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  return (
    <Screen navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
            <Text style={{ ...styles.title, ...styles.mb8 }}>
              Feel Good Quote Contest
            </Text>
            <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb8 }}>
              Every day we display a feel good quote. The winner from this
              contest will be show cased for the following day
            </Text>
            <Text style={{ ...styles.fs16, ...styles.tac }}>
              Time left in contest: {formatSeconds(contestTimeLeft)}
            </Text>
          </View>
          {quotes.map((quote, index) => {
            return (
              <Quote
                isLast={index === quotes.length - 1}
                key={quote.id}
                navigation={navigation}
                quote1={quote}
                setCanUserCreateQuote={setCanUserCreateQuote}
                setMyQuote={setMyQuote}
                setQuoteID={setQuoteID}
                setQuotes={setQuotes}
                setStarterModal={setStarterModal}
                user={user}
              />
            );
          })}
          {canLoadMoreQuotes && (
            <TouchableOpacity
              onPress={() => getQuotes(quotes, setCanLoadMoreQuotes, setQuotes)}
            >
              <Text>Load More Quotes</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View
        style={{
          ...styles.bgWhite,
          ...styles.shadowTop,
          ...styles.px16,
          ...styles.pt16,
        }}
      >
        <TextInput
          onChange={(event) => {
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") return setStarterModal(true);
            }
            if (userInteractionIssues) return;

            if (calculateKarma(userBasicInfo) < 20)
              return message.info(
                "You need 20 karma points to interact with this :)"
              );

            if (!event.target.value && quoteID) setQuoteID(null);
            setMyQuote(event.target.value);
          }}
          placeholder="Change someone's day :)"
          style={{ ...styles.input, ...styles.mb8 }}
          value={myQuote}
        />
        <TouchableOpacity
          onPress={() => {
            const userInteractionIssues = userSignUpProgress(user);

            if (userInteractionIssues) {
              if (userInteractionIssues === "NSI") return setStarterModal(true);
            }

            if (myQuote)
              saveQuote(
                canUserCreateQuote,
                myQuote,
                quoteID,
                setCanUserCreateQuote,
                setMyQuote,
                setQuotes,
                user.uid
              );
          }}
          style={{ ...styles.buttonPrimary, ...styles.mb16 }}
        >
          <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
            Submit My Quote
          </Text>
        </TouchableOpacity>
      </View>
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
    </Screen>
  );
}

function Quote({
  isLast,
  navigation,
  quote1,
  setCanUserCreateQuote,
  setMyQuote,
  setQuoteID,
  setQuotes,
  setStarterModal,
  user,
}) {
  const [author, setAuthor] = useState({});
  const [hasLiked, setHasLiked] = useState();
  const [isContentBlocked, setIsContentBlocked] = useState();
  const [quote, setQuote] = useState(quote1);

  useEffect(() => {
    getUserBasicInfo((author) => {
      setAuthor(author);
    }, quote.userID);

    if (user) {
      hasUserBlockedUser(user.uid, quote.userID, setIsContentBlocked);
      getHasUserLikedQuote(
        quote.id,
        (hasLiked) => {
          setHasLiked(hasLiked);
        },
        user.uid
      );
    }
  }, [quote.id, quote.userID, user]);

  if (isContentBlocked) return <View />;

  return (
    <View style={{ ...styles.box, ...styles.mb16, ...styles.pa32 }}>
      <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
        {false && (
          <FontAwesomeIcon
            icon={faQuoteLeft}
            size={32}
            style={{ ...styles.colorMain, ...styles.mr8 }}
          />
        )}
        <View style={{ ...styles.flexFill }}>
          <Text
            style={{
              ...styles.italic,
              ...styles.fs20,
              ...styles.tac,
              ...styles.mb8,
            }}
          >
            {capitolizeFirstChar(quote.value)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.jumpTo("Profile", { userID: quote.userID })
            }
          >
            <Text
              style={{ ...styles.fs20, ...styles.colorMain, ...styles.tac }}
            >
              - {capitolizeFirstChar(author.displayName)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ ...styles.flexRow, ...styles.justifyEnd }}>
        <View style={{ ...styles.justifyEnd, ...styles.mr8 }}>
          <Text style={{ ...styles.fs20, ...styles.colorGrey5, ...styles.tac }}>
            {quote.like_counter ? quote.like_counter : 0}
          </Text>
        </View>
        <View
          style={{
            ...styles.alignCenter,
            ...(user ? styles.justifyBetween : styles.justifyEnd),
          }}
        >
          {user && (
            <ContentOptions
              canUserInteractFunction={
                userSignUpProgress(user, true)
                  ? () => {
                      const userInteractionIssues = userSignUpProgress(user);

                      if (userInteractionIssues) {
                        if (userInteractionIssues === "NSI")
                          return setStarterModal(true);
                      }
                    }
                  : false
              }
              deleteFunction={(quoteID) =>
                deleteQuote(
                  quoteID,
                  setCanUserCreateQuote,
                  setQuoteID,
                  setQuotes
                )
              }
              editFunction={() => {
                setQuoteID(quote.id);
                setMyQuote(quote.value);
              }}
              objectID={quote.id}
              objectUserID={quote.userID}
              reportFunction={(option) => {
                reportQuote(option, quote.id, user.uid);
              }}
              userID={user.uid}
            />
          )}
          <TouchableOpacity
            onPress={async () => {
              const userInteractionIssues = userSignUpProgress(user);

              if (userInteractionIssues) {
                if (userInteractionIssues === "NSI") setStarterModal(true);
                return;
              }

              await likeOrUnlikeQuote(hasLiked, quote, user);

              await getHasUserLikedQuote(quote.id, setHasLiked, user.uid);

              if (!quote.like_counter) quote.like_counter = 0;
              if (hasLiked) quote.like_counter--;
              else quote.like_counter++;

              setQuote({ ...quote });
            }}
          >
            <FontAwesomeIcon
              icon={faChevronCircleUp}
              size={24}
              style={{ ...(hasLiked ? styles.colorMain : styles.colorGrey9) }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default QuoteContestScreen;
