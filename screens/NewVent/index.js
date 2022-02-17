import React, { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import NewVentComponent from "../../components/NewVent";
import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

function NewVentScreen({ navigation, route }) {
  const { user } = useContext(UserContext);

  const [refreshing, setRefreshing] = useState(false);
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setStarterModal(true);
    } else setStarterModal(false);

    setTimeout(() => setRefreshing(false), 400);
  }, [refreshing, setRefreshing, setStarterModal, user]);

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
          <NewVentComponent
            navigation={navigation}
            route={route}
            ventID={
              route.params && route.params.ventID ? route.params.ventID : null
            }
          />
        </View>
      </ScrollView>
      <StarterModal
        activeModal={starterModal}
        setActiveModal={setStarterModal}
        visible={starterModal}
      />
    </Screen>
  );
}

export default NewVentScreen;
