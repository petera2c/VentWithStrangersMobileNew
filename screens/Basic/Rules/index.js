import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import Screen from "../../../components/containers/Screen";

import { styles } from "../../../styles";

function RulesScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setRefreshing(false), 400);
  }, [refreshing, setRefreshing]);

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
          <View style={{ ...styles.box, ...styles.pa32 }}>
            <Text style={{ ...styles.title, ...styles.mb8 }}>VWS Rules</Text>

            <View>
              <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb16 }}>
                Failing to follow any of these rules will cause you to be
                permanently banned without warning.
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                1. Don't be creepy. No sexual usernames, do not ask for anyone's
                social media/email/phone number.
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                2. No harassment, bullying, or attacking of people through
                vents, comments, or direct messages.
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                3. No racist, sexist, prejudice or discriminatory content..
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                4. Supportive comments only. We encourage everyone to comment on
                vents, but all comments must be supportive even if you disagree
                with the content of the vent.
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                5. To protect from predators, we do not allow advertising of any
                social media profiles or pages.
              </Text>
              <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                6. Have fun! :)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

export default RulesScreen;
