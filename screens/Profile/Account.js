import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { showMessage } from "react-native-flash-message";

import { faBirthdayCake } from "@fortawesome/pro-solid-svg-icons/faBirthdayCake";
import { faEye } from "@fortawesome/pro-solid-svg-icons/faEye";
import { faLockAlt } from "@fortawesome/pro-solid-svg-icons/faLockAlt";
import { faMonument } from "@fortawesome/pro-light-svg-icons/faMonument";
import { faPaperPlane } from "@fortawesome/pro-light-svg-icons/faPaperPlane";
import { faTransgenderAlt } from "@fortawesome/pro-solid-svg-icons/faTransgenderAlt";
import { faVenusMars } from "@fortawesome/pro-solid-svg-icons/faVenusMars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import DeleteAccountModal from "../../components/modals/DeleteAccount";
import Screen from "../../components/containers/Screen";

import { UserContext } from "../../context";

import { styles } from "../../styles";

import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList,
} from "../../PersonalOptions";
import { calculateKarma } from "../../util";
import { deleteAccountAndAllData, getUser, updateUser } from "./util";

function AccountScreen({ navigation }) {
  const { user, userBasicInfo, setUserBasicInfo } = useContext(UserContext);

  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState();
  const [canSeePassword, setCanSeePassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [displayName, setDisplayName] = useState(
    userBasicInfo.displayName ? userBasicInfo.displayName : ""
  );
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [userInfo, setUserInfo] = useState({});

  const [education, setEducation] = useState();
  const [kids, setKids] = useState();
  const [partying, setPartying] = useState();
  const [politics, setPolitics] = useState();
  const [religion, setReligion] = useState();

  const setAccountInfo = (userInfo) => {
    if (userInfo.bio) setBio(userInfo.bio);
    if (userInfo.birth_date) setBirthDate(new dayjs(userInfo.birth_date));
    if (userInfo.education !== undefined) setEducation(userInfo.education);
    if (userInfo.gender) setGender(userInfo.gender);
    if (userInfo.kids !== undefined) setKids(userInfo.kids);
    if (userInfo.partying !== undefined) setPartying(userInfo.partying);
    if (userInfo.politics !== undefined) setPolitics(userInfo.politics);
    if (userInfo.pronouns) setPronouns(userInfo.pronouns);
    if (userInfo.religion !== undefined) setReligion(userInfo.religion);
  };

  useEffect(() => {
    getUser((userInfo) => {
      setAccountInfo(userInfo);
      if (userInfo) setUserInfo(userInfo);
    }, user.uid);
  }, [user]);

  return (
    <Screen navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          <View style={{ ...styles.box, ...styles.mb2, ...styles.pa32 }}>
            <Text
              style={{
                ...styles.titleSmall,
                ...styles.colorMain,
                ...styles.mb16,
              }}
            >
              Personal Information
            </Text>
            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                Display Name
              </Text>
              <TextInput
                onChangeText={(text) => setDisplayName(text)}
                placeholder="Art Vandalay"
                style={{ ...styles.input }}
                type="text"
                value={displayName}
              />
            </View>
            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>Email</Text>
              <TextInput
                onChangeText={(text) => setEmail(text)}
                name="email"
                placeholder="artvandalay@gmail.com"
                style={{ ...styles.input }}
                type="text"
                value={email}
              />
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>Gender</Text>
              <TextInput
                onChangeText={(text) => {
                  if (text.length > 50)
                    return showMessage({
                      message:
                        "You can not write more than 50 characters for your gender",
                      type: "info",
                    });
                  setGender(text);
                }}
                placeholder="Any"
                style={{ ...styles.input }}
                type="text"
                value={gender}
              />
            </View>
            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>Pronouns</Text>
              <TextInput
                onChangeText={(text) => {
                  if (text.length > 50)
                    return showMessage({
                      message:
                        "You can not write more than 50 characters for your pronoun",
                      type: "info",
                    });
                  setPronouns(text);
                }}
                name="pronouns"
                placeholder="she/her he/him its/them"
                style={{ ...styles.input }}
                value={pronouns}
              />
            </View>

            <Text style={{ ...styles.fs20, ...styles.mb8 }}>Bio</Text>
            <TextInput
              multiline
              onChangeText={(text) => {
                if (calculateKarma(userBasicInfo) < 20)
                  return showMessage({
                    message:
                      "You need 20 karma points to interact with this :)",
                    type: "info",
                  });

                setBio(text);
              }}
              placeholder="Let us know about you :)"
              style={{ ...styles.input }}
              value={bio}
            />

            <View style={{ ...styles.mb16 }}>
              <View
                style={{
                  ...styles.flexRow,
                  ...styles.alignCenter,
                  ...styles.py8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mr8 }}>Birthday</Text>
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  style={{ ...styles.colorPrimary }}
                />
              </View>
              <View
                style={{
                  ...styles.mb16,
                }}
              >
                <DateTimePicker
                  value={birthDate ? new Date(birthDate) : new Date()}
                  mode={"date"}
                  onChange={(event, selectedDate) => {
                    if (!selectedDate) return setBirthDate(null);
                    const date = new dayjs(selectedDate);

                    const diffInYears = new dayjs().diff(date) / 31536000000;
                    if (diffInYears > 11) setBirthDate(date);
                    else {
                      showMessage({
                        message:
                          "You are too young to use this application :'(",
                        type: "error",
                      });
                    }
                  }}
                />
              </View>

              <Text style={{ ...styles.fs20, ...styles.tac }}>
                This information will be used to connect you with other users
                with common interests. This information will not be sold or
                shared with any 3rd party.
              </Text>
              <View
                style={{
                  ...styles.alignStart,
                  ...styles.justifyCenter,
                  ...styles.mt8,
                  ...styles.pt8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mb8 }}>Partying</Text>
                <View style={{ ...styles.flexRow, ...styles.wrap }}>
                  {partyingList.map((str, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={(text) => {
                          if (partying !== index) setPartying(index);
                          else setPartying(undefined);
                        }}
                        style={{
                          ...(partying === index
                            ? styles.buttonSecondary
                            : { ...styles.border, ...styles.pa8 }),
                          ...styles.mr8,
                          ...styles.mb8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.fs20,
                            ...(partying === index
                              ? styles.colorMain
                              : styles.colorGrey11),
                          }}
                        >
                          {str}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View
                style={{
                  ...styles.alignStart,
                  ...styles.justifyCenter,
                  ...styles.mt8,
                  ...styles.pt8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                  Political Beliefs
                </Text>
                <View style={{ ...styles.flexRow, ...styles.wrap }}>
                  {politicalBeliefsList.map((str, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={(text) => {
                          if (politics !== index) setPolitics(index);
                          else setPolitics(undefined);
                        }}
                        style={{
                          ...(politics === index
                            ? styles.buttonSecondary
                            : { ...styles.border, ...styles.pa8 }),
                          ...styles.mr8,
                          ...styles.mb8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.fs20,
                            ...(politics === index
                              ? styles.colorMain
                              : styles.colorGrey11),
                          }}
                        >
                          {str}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  ...styles.alignStart,
                  ...styles.justifyCenter,
                  ...styles.mt8,
                  ...styles.pt8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                  Religious Beliefs
                </Text>
                <View style={{ ...styles.flexRow, ...styles.wrap }}>
                  {religiousBeliefsList.map((str, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={(text) => {
                          if (religion !== str) setReligion(str);
                          else setReligion(undefined);
                        }}
                        style={{
                          ...(religion === str
                            ? styles.buttonSecondary
                            : { ...styles.border, ...styles.pa8 }),
                          ...styles.mr8,
                          ...styles.mb8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.fs20,
                            ...(religion === str
                              ? styles.colorMain
                              : styles.colorGrey11),
                          }}
                        >
                          {str}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  ...styles.alignStart,
                  ...styles.justifyCenter,
                  ...styles.mt8,
                  ...styles.pt8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mb8 }}>Education</Text>
                <View style={{ ...styles.flexRow, ...styles.wrap }}>
                  {educationList.map((str, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={(text) => {
                          if (education !== index) setEducation(index);
                          else setEducation(undefined);
                        }}
                        style={{
                          ...(education === index
                            ? styles.buttonSecondary
                            : { ...styles.border, ...styles.pa8 }),
                          ...styles.mr8,
                          ...styles.mb8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.fs20,
                            ...(education === index
                              ? styles.colorMain
                              : styles.colorGrey11),
                          }}
                        >
                          {str}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View
                style={{
                  ...styles.alignStart,
                  ...styles.justifyCenter,
                  ...styles.mt8,
                  ...styles.pt8,
                }}
              >
                <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                  Do you have kids?
                </Text>
                <View style={{ ...styles.flexRow, ...styles.wrap }}>
                  {kidsList.map((str, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={(text) => {
                          if (kids !== index) setKids(index);
                          else setKids(undefined);
                        }}
                        style={{
                          ...(kids === index
                            ? styles.buttonSecondary
                            : { ...styles.border, ...styles.pa8 }),
                          ...styles.mr8,
                          ...styles.mb8,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.fs20,
                            ...(kids === index
                              ? styles.colorMain
                              : styles.colorGrey11),
                          }}
                        >
                          {str}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
              Change your Password
            </Text>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                New Password
              </Text>

              <TextInput
                name="password-change"
                onChangeText={(text) => setNewPassword(text)}
                placeholder="*******"
                secureTextEntry={canSeePassword ? false : true}
                style={{ ...styles.input }}
                value={newPassword}
              />
            </View>
            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.fs20, ...styles.mb8 }}>
                Confirm Password
              </Text>
              <View style={{ ...styles.flexRow, ...styles.alignCenter }}>
                <TextInput
                  name="confirm-password-change"
                  onChangeText={(text) => setConfirmPassword(text)}
                  placeholder="*******"
                  secureTextEntry={canSeePassword ? false : true}
                  style={{ ...styles.input, ...styles.flexFill, ...styles.mr8 }}
                  value={confirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setCanSeePassword(!canSeePassword)}
                >
                  <FontAwesomeIcon
                    icon={faEye}
                    size={24}
                    style={{
                      ...(canSeePassword
                        ? styles.colorMain
                        : styles.colorGrey1),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              ...styles.box,
              ...styles.flexRow,
              ...styles.justifyBetween,
              ...styles.pa32,
            }}
          >
            <TouchableOpacity
              onPress={(text) => {
                setDisplayName(user.displayName);
                setEmail(user.email);
                setNewPassword("");
                setConfirmPassword("");
                setAccountInfo(userInfo);
              }}
              style={{
                ...styles.border,
                ...styles.flexFill,
                ...styles.mr8,
                ...styles.pa8,
              }}
            >
              <Text
                style={{ ...styles.fs20, ...styles.colorGrey1, ...styles.tac }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                updateUser(
                  bio,
                  birthDate,
                  confirmPassword,
                  displayName,
                  education,
                  email,
                  gender,
                  kids,
                  newPassword,
                  partying,
                  politics,
                  pronouns,
                  religion,
                  setUserBasicInfo,
                  user,
                  userInfo
                )
              }
              style={{
                ...styles.buttonPrimary,
                ...styles.flexFill,
                ...styles.ml8,
              }}
            >
              <Text style={{ ...styles.fs20, ...styles.colorWhite }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ ...styles.mt16 }}>
            <TouchableOpacity onPress={() => setDeleteAccountModal(true)}>
              <Text style={{ ...styles.colorGrey11 }}>
                Delete Account and All Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <DeleteAccountModal
        close={() => setDeleteAccountModal(false)}
        submit={() => {
          deleteAccountAndAllData(user.uid);
        }}
        visible={deleteAccountModal}
      />
    </Screen>
  );
}

export default AccountScreen;
