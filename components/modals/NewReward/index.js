import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { faComet } from "@fortawesome/pro-duotone-svg-icons/faComet";
import { faMeteor } from "@fortawesome/pro-duotone-svg-icons/faMeteor";
import { faStarShooting } from "@fortawesome/pro-duotone-svg-icons/faStarShooting";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { styles } from "../../../styles";

function NewRewardModal({ close, newReward }) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    setTimeout(() => setCanClose(true), 2000);
  }, []);

  return (
    <Modal
      className="modal-container full-center"
      onClick={(e) => {
        if (canClose) close();
      }}
    >
      <View
        className={
          "modal column align-center ov-auto bg-white pa32 br8 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <View className="column x-fill" size="large">
          <View className="column">
            <h1 className="blue tac">Congratulations!</h1>
            <h4 className="tac">{newReward.title}</h4>
            <p className="blue tac">+ {newReward.karma_gained} Karma Points</p>
          </View>
          <View>
            <FontAwesomeIcon className="blue" icon={faComet} size="5x" />
            <FontAwesomeIcon className="blue" icon={faMeteor} size="5x" />
            <FontAwesomeIcon className="blue" icon={faStarShooting} size="5x" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default NewRewardModal;
