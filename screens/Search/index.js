import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import algoliasearch from "algoliasearch";

import Screen from "../../components/containers/Screen";
import User from "../../components/User";
import Vent from "../../components/Vent";

import { styles } from "../../styles";

import { capitolizeFirstChar } from "../../util";

const searchClient = algoliasearch(
  "N7KIA5G22X",
  "a2fa8c0a85b2020696d2da1780d7dfdb"
);
const usersIndex = searchClient.initIndex("users");
const ventsIndex = searchClient.initIndex("vents");

function SearchScreen({ navigation }) {
  const [searchString, setSearchString] = useState("");

  const [isUsers, setIsUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [vents, setVents] = useState([]);

  useEffect(() => {
    if (isUsers) {
      usersIndex
        .search(searchString, {
          hitsPerPage: 5,
        })
        .then(({ hits }) => {
          setUsers(hits);
        });
    } else {
      ventsIndex
        .search(searchString, {
          hitsPerPage: 5,
        })
        .then(({ hits }) => {
          setVents(hits);
        });
    }
  }, [searchString, isUsers]);

  return (
    <Screen navigation={navigation}>
      <View
        style={{
          ...styles.flexRow,
          ...styles.box,
          ...styles.ma16,
          ...styles.pa16,
        }}
      >
        <TouchableOpacity
          className={
            "TouchableOpacity-2 no-bold py8 px16 my16 br8 " +
            (isUsers ? "active" : "")
          }
          onPress={() => setIsUsers(true)}
          style={{
            ...styles.flexFill,
            ...(isUsers ? styles.buttonPrimary : styles.buttonSecondary),
            ...styles.mr8,
          }}
        >
          <Text
            style={{
              ...styles.fs20,
              ...(isUsers ? styles.colorWhite : styles.colorMain),
            }}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={
            "TouchableOpacity-2 no-bold py8 px16 my16 br8 " +
            (isUsers ? "" : "active")
          }
          onPress={() => setIsUsers(false)}
          style={{
            ...styles.flexFill,
            ...(!isUsers ? styles.buttonPrimary : styles.buttonSecondary),
            ...styles.ml8,
          }}
        >
          <Text
            style={{
              ...styles.fs20,
              ...(!isUsers ? styles.colorWhite : styles.colorMain),
            }}
          >
            Vents
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {isUsers && (
          <View style={{ ...styles.pa16 }}>
            {users &&
              users.map((user) => {
                const displayName = user.displayName
                  ? capitolizeFirstChar(user.displayName)
                  : "Anonymous";

                return (
                  <User
                    displayName={displayName}
                    key={user.objectID}
                    showAdditionaluserInformation={false}
                    showMessageUser={false}
                    userID={user.objectID}
                  />
                );
              })}
            {!users && (
              <View>
                <Text>Loading</Text>
              </View>
            )}
            {users && users.length === 0 && (
              <Text className="fw-400">No users found.</Text>
            )}
          </View>
        )}
        {!isUsers && (
          <View className={"column align-center py32 "}>
            {vents && (
              <View className="x-fill" direction="vertical" size="middle">
                {vents &&
                  vents.map((vent, index) => (
                    <Vent
                      key={vent.objectID}
                      previewMode={true}
                      showVentHeader={false}
                      ventID={vent.objectID}
                      ventIndex={index}
                      ventInit={{ ...vent, id: vent.objectID }}
                      searchPreviewMode={true}
                    />
                  ))}
              </View>
            )}
            {!vents && (
              <View>
                <Text>Loading</Text>
              </View>
            )}
            {vents && vents.length === 0 && (
              <Text className="fw-400">No vents found.</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View
        style={{
          ...styles.flexRow,
          ...styles.alignCenter,
          ...styles.bgWhite,
          ...styles.borderTop,
          ...styles.pa8,
        }}
      >
        <TextInput
          autoCapitalize="none"
          autocorrect={false}
          multiline
          onChangeText={(text) => {
            setSearchString(text);
          }}
          placeholder="Search..."
          style={{ ...styles.input, ...styles.flexFill, ...styles.mr8 }}
          value={searchString}
          rows={1}
        />
      </View>
    </Screen>
  );
}

export default SearchScreen;
