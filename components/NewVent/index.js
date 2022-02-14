import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import algoliasearch from "algoliasearch";

import { faQuestionCircle } from "@fortawesome/pro-solid-svg-icons/faQuestionCircle";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../containers/Screen";

import { UserContext } from "../../context";

import {
  capitolizeFirstChar,
  countdown,
  isUserKarmaSufficient,
  useIsMounted,
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

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const tagsIndex = searchClient.initIndex("vent_tags");

const TITLE_LENGTH_MINIMUM = 0;
const TITLE_LENGTH_MAXIMUM = 100;

function NewVentScreen({ navigation, route }) {
  const isMounted = useIsMounted();
  const { user, userBasicInfo } = useContext(UserContext);
  //const { miniVersion } = route.params;
  const miniVersion = true;
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

    if (isMounted()) {
      setPlaceholderText(selectEncouragingMessage());
    }

    tagsIndex
      .search("", {
        hitsPerPage: 10,
      })
      .then(({ hits }) => {
        if (isMounted())
          setVentTags(
            hits.sort((a, b) => {
              if (a.display < b.display) return -1;
              if (a.display > b.display) return 1;
              return 0;
            })
          );
      });

    if (ventID) getVent(isMounted, setDescription, setTags, setTitle, ventID);

    getQuote(isMounted, setQuote);

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
        if (isMounted()) setPostingDisableFunction(temp);

        if (res) {
          interval = setInterval(
            () =>
              countdown(
                isMounted,
                res,
                setUserVentTimeOut,
                setUserVentTimeOutFormatted
              ),
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
      if (isMounted()) setPostingDisableFunction(temp);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMounted, user, userBasicInfo, ventID]);

  return (
    <View
      className="x-fill column bg-white br8"
      close={() => {
        if (miniVersion) setIsMinified(true);
      }}
    >
      <View className={"column br4 pa32 " + (isMinified ? "gap8" : "gap16")}>
        {!miniVersion && quote && (
          <View className="column flex-fill align-center">
            <Text className="fs-22 italic tac">"{quote.value}"</Text>
            <Link to={"/profile?" + quote.userID}>
              <Text className="button-8 tac lh-1">
                - {capitolizeFirstChar(quote.displayName)}
              </Text>
            </Link>
          </View>
        )}
        {!miniVersion && userVentTimeOut > 0 && !ventID && (
          <View direction="vertical">
            <Text className="tac">
              To avoid spam, people can only post once every few hours. With
              more Karma Points you can post more often. Please come back in
            </Text>
            <Text className="tac">{userVentTimeOutFormatted}</Text>
          </View>
        )}
        <View className="align-center gap8">
          {false && isMinified && (
            <Link to="/avatar">
              <MakeAvatar
                displayName={userBasicInfo.displayName}
                userBasicInfo={userBasicInfo}
              />
            </Link>
          )}
          <TextInput
            className="x-fill py8 px16 br4"
            onChangeText={(event) => {
              if (postingDisableFunction) return postingDisableFunction();

              setDescription(event.target.value);
            }}
            onClick={() => {
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
            minRows={isMinified ? 1 : 3}
            value={description}
          />
          {false && hasStartedToWriteVent && (
            <Emoji
              handleChange={(emoji) => {
                if (postingDisableFunction) return postingDisableFunction();

                setDescription(description + emoji);
              }}
            />
          )}
        </View>
        {!isMinified && (
          <View className="x-fill" direction="vertical">
            <Text className="fw-400">Title</Text>
            <TextInput
              className="x-fill py8 px16 br4"
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
              type="text"
              value={title}
            />
            {title.length >= TITLE_LENGTH_MINIMUM && (
              <Text
                className={title.length > TITLE_LENGTH_MAXIMUM ? "red" : ""}
              >
                {title.length}/{TITLE_LENGTH_MAXIMUM}
              </Text>
            )}
          </View>
        )}
        {!isMinified && (
          <View className="x-fill" direction="vertical">
            <Text className="fw-400">Tag this vent</Text>

            <TextInput
              className="x-fill py8 px16 br4"
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
              type="text"
              value={tagText}
            />
            {ventTags && ventTags.length > 0 && (
              <View className="wrap gap8">
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
          <View className="column gap8">
            <Text>Selected Tags</Text>
            <View className="x-fill wrap gap8">
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
          <View className="justify-end">
            {!saving && (
              <button
                className="bg-blue white px64 py8 br4"
                onClick={() => {
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
              >
                Submit
              </button>
            )}
          </View>
        )}
        {isMinified && quote && (
          <View className="flex-fill full-center">
            <View className="column flex-fill align-center">
              <Text className="fs-18 no-bold grey-1 italic tac flex-fill">
                {quote.value}
              </Text>
              <Link to={"/profile?" + quote.userID}>
                <Text className="blue tac lh-1">
                  - {capitolizeFirstChar(quote.displayName)}
                </Text>
              </Link>
            </View>

            <TouchableOpacity to="/quote-contest">
              <FontAwesomeIcon icon={faQuestionCircle} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!miniVersion && (
        <View
          className="column pa32"
          style={{ borderTop: "2px solid var(--grey-color-2)" }}
        >
          <Text>
            If you or someone you know is in danger, call your local emergency
            services or police.
          </Text>
        </View>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </View>
  );
}

function Tag({ postingDisableFunction, setTags, tagHit, tags }) {
  return (
    <TouchableOpacity
      className="button-10 br4 px8 py4"
      onPress={() => {
        if (postingDisableFunction) return postingDisableFunction();

        if (tags && tags.length >= 3) {
          return message.info("You can not set more than 3 tags in a vent!");
        }
        import("./util").then((functions) => {
          functions.updateTags(setTags, tagHit);
        });
      }}
    >
      <Text>{viewTagFunction(tagHit.objectID)}</Text>
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
