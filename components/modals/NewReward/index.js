import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { faComet } from "@fortawesome/pro-solid-svg-icons/faComet";
import { faMeteor } from "@fortawesome/pro-solid-svg-icons/faMeteor";
import { faStarShooting } from "@fortawesome/pro-solid-svg-icons/faStarShooting";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";

function NewRewardModal({ close, newReward, visible }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    setTimeout(() => setCanClose(true), 2000);
  }, []);

  return (
    <Modal transparent={true} visible={visible}>
      <KeyboardAvoidingView behavior="padding" style={{ ...styles.flexFill }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            close();
          }}
          style={{
            ...styles.fill,
            ...styles.fullCenter,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <TouchableWithoutFeedback>
            <SafeAreaView>
              <View
                style={{
                  ...styles.box,
                  ...styles.pa32,
                }}
              >
                <View style={{ ...styles.mb16 }}>
                  <Text style={{ ...styles.title, ...styles.mb8 }}>
                    Congratulations!
                  </Text>
                  <Text
                    style={{
                      ...styles.pTag,
                      ...styles.tac,
                      ...styles.mb8,
                    }}
                  >
                    {newReward.title}
                  </Text>
                  <Text
                    style={{
                      ...styles.fs20,
                      ...styles.colorMain,
                      ...styles.tac,
                      ...styles.mb8,
                    }}
                  >
                    + {newReward.karma_gained} Karma Points
                  </Text>
                </View>
                <View style={{ ...styles.flexRow, ...styles.fullCenter }}>
                  <FontAwesomeIcon
                    icon={faComet}
                    size={48}
                    style={{ ...styles.colorMain }}
                  />
                  <FontAwesomeIcon
                    icon={faMeteor}
                    size={48}
                    style={{ ...styles.colorMain }}
                  />
                  <FontAwesomeIcon
                    icon={faStarShooting}
                    size={48}
                    style={{ ...styles.colorMain }}
                  />
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default NewRewardModal;
