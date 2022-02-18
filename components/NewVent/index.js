import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import algoliasearch from "algoliasearch";
import { showMessage } from "react-native-flash-message";

import { faAngleUp } from "@fortawesome/pro-solid-svg-icons/faAngleUp";
import { faQuestionCircle } from "@fortawesome/pro-solid-svg-icons/faQuestionCircle";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../containers/Screen";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  countdown,
  isUserKarmaSufficient,
  viewTagFunction,
} from "../../util";
import {
  checkVentTitle,
  getQuote,
  getUserVentTimeOut,
  getVent,
  selectEncouragingMessage,
} from "./util";
import { checks, saveVent } from "./util";

import { styles } from "../../styles";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const tagsIndex = searchClient.initIndex("vent_tags");

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

function NewVentScreen({ miniVersion, navigation, refreshing, route, ventID }) {
  const { user, userBasicInfo } = useContext(UserContext);

  const isBirthdayPost = false;

  const [description, setDescription] = useState("");
  const [isMinified, setIsMinified] = useState(miniVersion);
  const [quote, setQuote] = useState();
  const [saving, setSaving] = useState(false);
  const [starterModal, setStarterModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [title, setTitle] = useState("");
  const [userVentTimeOut, setUserVentTimeOut] = useState(false);
  const [userVentTimeOutFormatted, setUserVentTimeOutFormatted] = useState("");
  const [ventTags, setVentTags] = useState([]);

  const [hasStartedToWriteVent, setHasStartedToWriteVent] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [postingDisableFunction, setPostingDisableFunction] = useState();

  useEffect(() => {
    setSaving(false);
    setUserVentTimeOut(false);
    setUserVentTimeOutFormatted("");
    let interval;

    setPlaceholderText(selectEncouragingMessage());

    tagsIndex
      .search("", {
        hitsPerPage: 10,
      })
      .then(({ hits }) => {
        setVentTags(
          hits.sort((a, b) => {
            if (a.display < b.display) return -1;
            if (a.display > b.display) return 1;
            return 0;
          })
        );
      });

    if (ventID) getVent(setDescription, setTags, setTitle, ventID);

    getQuote((quote) => {
      quote.value = quote.value.replace(/\s+/g, " ").trim();
      setQuote(quote);
    });

    if (user) {
      getUserVentTimeOut((res) => {
        const temp = checks(
          isUserKarmaSufficient(userBasicInfo),
          setStarterModal,
          user,
          userBasicInfo,
          ventID,
          res
        );
        setPostingDisableFunction(temp);

        if (res) {
          interval = setInterval(
            () =>
              countdown(res, setUserVentTimeOut, setUserVentTimeOutFormatted),
            1000
          );
        }
      }, user.uid);
    } else {
      const temp = checks(
        true,
        setStarterModal,
        user,
        userBasicInfo,
        ventID,
        false
      );
      setPostingDisableFunction(temp);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [refreshing, user, userBasicInfo, ventID]);

  return (
    <View style={{ ...styles.bgWhite, ...styles.br8 }}>
      <View style={{ ...styles.br4, ...styles.pa32 }}>
        {!miniVersion && quote && (
          <View style={{ ...styles.alignCenter, ...styles.mb16 }}>
            <Text
              style={{ ...styles.fs22, ...styles.boldItalic, ...styles.tac }}
            >
              "{capitolizeFirstChar(quote.value)}"
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.jumpTo("Profile", { userID: quote.userID })
              }
            >
              <Text style={{ ...styles.fs18, ...styles.colorMain }}>
                - {capitolizeFirstChar(quote.displayName)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!miniVersion && userVentTimeOut > 0 && !ventID && (
          <View>
            <Text style={{ ...styles.tac }}>
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </Text>
            <Text style={{ ...styles.tac }}>{userVentTimeOutFormatted}</Text>
          </View>
        )}
        <View
          style={{
            ...styles.flexRow,
            ...styles.alignCenter,
          }}
        >
          <View style={{ ...styles.xFill }}>
            {!isMinified && (
              <Text style={{ ...styles.fs22, ...styles.mb8 }}>Description</Text>
            )}
            <TextInput
              autoCorrect={false}
              multiline={!isMinified}
              onChangeText={(text) => {
                if (postingDisableFunction) return postingDisableFunction();

                setDescription(text);
              }}
              onFocus={() => {
                setIsMinified(false);
                setHasStartedToWriteVent(true);
              }}
              placeholder={
                isBirthdayPost
                  ? "Have the best birthday ever!"
                  : userVentTimeOutFormatted
                  ? "You can vent again in " + userVentTimeOutFormatted
                  : placeholderText
              }
              style={{
                ...styles.xFill,
                ...styles.border,
                ...styles.fs22,
                ...styles.br4,
                ...styles.mb8,
                ...styles.pa8,
              }}
              value={description}
            />
          </View>
        </View>
        {!isMinified && (
          <View style={{ ...styles.mb16 }}>
            <Text style={{ ...styles.fs22, ...styles.mb8 }}>Title</Text>
            <TextInput
              autoCorrect={false}
              multiline
              onChangeText={(text) => {
                if (postingDisableFunction) return postingDisableFunction();

                if (text.length > TITLE_LENGTH_MAXIMUM) {
                  return showMessage({
                    message:
                      "Vent titles can't have more than " +
                      TITLE_LENGTH_MAXIMUM +
                      " characters :(",
                    type: "info",
                  });
                }

                setTitle(text);
                setSaving(false);
              }}
              placeholder="Our community is listening :)"
              style={{
                ...styles.xFill,
                ...styles.border,
                ...styles.fs22,
                ...styles.br4,
                ...styles.mb2,
                ...styles.pa8,
              }}
              value={title}
            />
            {title.length >= TITLE_LENGTH_MINIMUM && (
              <Text
                style={{
                  ...(title.length > TITLE_LENGTH_MAXIMUM
                    ? styles.colorRed
                    : styles.colorGrey1),
                }}
              >
                {title.length}/{TITLE_LENGTH_MAXIMUM}
              </Text>
            )}
          </View>
        )}
        {!isMinified && (
          <View>
            <Text style={{ ...styles.fs22, ...styles.mb8 }}>Tag this vent</Text>
            <TextInput
              autoCorrect={false}
              multiline
              onChangeText={(text) => {
                if (postingDisableFunction) return postingDisableFunction();

                tagsIndex
                  .search(text.value, {
                    hitsPerPage: 10,
                  })
                  .then(({ hits }) => {
                    setVentTags(hits);
                  });

                setTagText(text.value);
              }}
              placeholder="Search tags"
              style={{
                ...styles.xFill,
                ...styles.border,
                ...styles.fs22,
                ...styles.br4,
                ...styles.mb8,
                ...styles.pa8,
              }}
              type="text"
              value={tagText}
            />
            {ventTags && ventTags.length > 0 && (
              <View style={{ ...styles.flexRow, ...styles.wrap }}>
                {ventTags.map((tagHit, index) => (
                  <Tag
                    key={tagHit.objectID}
                    postingDisableFunction={postingDisableFunction}
                    setTags={setTags}
                    tagHit={tagHit}
                    tags={tags}
                  />
                ))}
              </View>
            )}
          </View>
        )}
        {!isMinified && tags && tags.length > 0 && (
          <View>
            <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
              Selected Tags
            </Text>
            <View style={{ ...styles.flexRow, ...styles.wrap }}>
              {tags.map((tag, index) => (
                <SelectedTag
                  postingDisableFunction={postingDisableFunction}
                  index={index}
                  key={tag.objectID}
                  setTags={setTags}
                  tag={tag}
                  tags={tags}
                />
              ))}
            </View>
          </View>
        )}

        {!isMinified && (
          <View>
            {!saving && (
              <TouchableOpacity
                onPress={() => {
                  if (postingDisableFunction) return postingDisableFunction();

                  if (!description) {
                    return showMessage({
                      message: "You need to enter a description :)",
                      type: "info",
                    });
                  } else if (!checkVentTitle(title)) {
                    return;
                  } else {
                    setTagText("");
                    setSaving(true);

                    saveVent(
                      (vent) => {
                        setDescription("");
                        setSaving(false);
                        setTitle("");
                        navigation.jumpTo("SingleVent", { ventID: vent.id });
                      },
                      isBirthdayPost,
                      tags,
                      {
                        description,
                        title,
                      },
                      ventID,
                      user
                    );
                  }
                }}
                style={{ ...styles.buttonPrimary, ...styles.mt16 }}
              >
                <Text style={{ ...styles.fs24, ...styles.colorWhite }}>
                  Submit
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {isMinified && quote && (
          <View
            style={{
              ...styles.xFill,
              ...styles.flexRow,
              ...styles.fullCenter,
            }}
          >
            <View
              style={{
                ...styles.alignCenter,
                ...styles.flexFill,
              }}
            >
              <Text
                style={{
                  ...styles.fs20,
                  ...styles.tac,
                  ...styles.boldItalic,
                  ...styles.colorGrey1,
                }}
              >
                {capitolizeFirstChar(quote.value)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.jumpTo("Profile", { userID: quote.userID })
                }
              >
                <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                  - {capitolizeFirstChar(quote.displayName)}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.jumpTo("QuoteContest")}
              style={{ ...styles.pl8 }}
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                size={24}
                style={{ ...styles.colorMain }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!miniVersion && (
        <View style={{ ...styles.px32, ...styles.pb32 }}>
          <Text>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </Text>
        </View>
      )}

      {miniVersion && !isMinified && (
        <TouchableOpacity
          onPress={() => {
            setIsMinified(true);
          }}
          style={{ ...styles.xFill, ...styles.alignCenter }}
        >
          <FontAwesomeIcon
            icon={faAngleUp}
            style={{ ...styles.colorGrey1 }}
            size={32}
          />
        </TouchableOpacity>
      )}
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={Boolean(starterModal)}
      />
    </View>
  );
}

function Tag({ postingDisableFunction, setTags, tagHit, tags }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (postingDisableFunction) return postingDisableFunction();

        if (tags && tags.length >= 3) {
          return showMessage({
            message: "You can not set more than 3 tags in a vent!",
            type: "info",
          });
        }
        import("./util").then((functions) => {
          functions.updateTags(setTags, tagHit);
        });
      }}
      style={{
        ...styles.border,
        ...styles.br4,
        ...styles.mr8,
        ...styles.mb8,
        ...styles.px8,
        ...styles.py4,
      }}
    >
      <Text style={{ ...styles.fs20, ...styles.colorGrey1 }}>
        {viewTagFunction(tagHit.objectID)}
      </Text>
    </TouchableOpacity>
  );
}

function SelectedTag({ index, postingDisableFunction, setTags, tag, tags }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (postingDisableFunction) return postingDisableFunction();

        let temp = [...tags];
        temp.splice(index, 1);
        setTags(temp);
      }}
      style={{
        ...styles.buttonSecondary,
        ...styles.br4,
        ...styles.mr8,
        ...styles.mb8,
        ...styles.pa8,
      }}
    >
      <Text style={{ ...styles.fs20, ...styles.colorMain, ...styles.mr8 }}>
        {viewTagFunction(tag.objectID)}
      </Text>

      <FontAwesomeIcon
        icon={faTimes}
        size={24}
        style={{ ...styles.colorMain }}
      />
    </TouchableOpacity>
  );
}

export default NewVentScreen;
