import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import NewVentComponent from "../../components/NewVent";
import Screen from "../../components/containers/Screen";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import { styles } from "../../styles";

function NewVentScreen({ navigation, route }) {
  const { user } = useContext(UserContext);

  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setStarterModal(true);
    } else setStarterModal(false);
  }, [setStarterModal, user]);

  return (
    <Screen navigation={navigation}>
      <ScrollView>
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
