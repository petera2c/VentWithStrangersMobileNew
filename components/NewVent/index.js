import React, { useContext, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import algoliasearch from "algoliasearch";

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
import { checks } from "./util";

import { styles } from "../../styles";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const tagsIndex = searchClient.initIndex("vent_tags");

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

function NewVentScreen({ miniVersion, navigation, route }) {
  const { user, userBasicInfo } = useContext(UserContext);

  const ventID = "";
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
  }, [user, userBasicInfo, ventID]);

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
          {false && isMinified && (
            <TouchableOpacity onPress={() => navigation.jumpTo("Avatar")}>
              <MakeAvatar
                displayName={userBasicInfo.displayName}
                userBasicInfo={userBasicInfo}
              />
            </TouchableOpacity>
          )}
          <View style={{ ...styles.xFill }}>
            {!isMinified && (
              <Text style={{ ...styles.fs22, ...styles.mb8 }}>Description</Text>
            )}
            <TextInput
              onChangeText={(event) => {
                if (postingDisableFunction) return postingDisableFunction();

                setDescription(event.target.value);
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
              onChangeText={(e) => {
                if (postingDisableFunction) return postingDisableFunction();

                if (e.target.value.length > TITLE_LENGTH_MAXIMUM) {
                  return message.info(
                    "Vent titles can't have more than " +
                      TITLE_LENGTH_MAXIMUM +
                      " characters :("
                  );
                }

                setTitle(e.target.value);
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
              onChangeText={(e) => {
                if (postingDisableFunction) return postingDisableFunction();

                tagsIndex
                  .search(e.target.value, {
                    hitsPerPage: 10,
                  })
                  .then(({ hits }) => {
                    setVentTags(hits);
                  });

                setTagText(e.target.value);
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
            <Text>Selected Tags</Text>
            <View style={{ ...styles.wrap }}>
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
                    return message.info("You need to enter a description :)");
                  } else if (!checkVentTitle(title)) {
                    return;
                  } else {
                    setTagText("");
                    setSaving(true);

                    import("./util").then((functions) => {
                      functions.saveVent(
                        (vent) => {
                          setSaving(false);
                          navigate(
                            "/vent/" +
                              vent.id +
                              "/" +
                              vent.title
                                .replace(/[^a-zA-Z ]/g, "")
                                .replace(/ /g, "-")
                                .toLowerCase()
                          );
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
                    });
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
        visible={starterModal}
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
          return message.info("You can not set more than 3 tags in a vent!");
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
      className="button-2 br4 gap8 pa8"
      onPress={() => {
        if (postingDisableFunction) return postingDisableFunction();

        let temp = [...tags];
        temp.splice(index, 1);
        setTags(temp);
      }}
    >
      <Text className="ic flex-fill">{viewTagFunction(tag.objectID)}</Text>

      <FontAwesomeIcon icon={faTimes} />
    </TouchableOpacity>
  );
}

export default NewVentScreen;
