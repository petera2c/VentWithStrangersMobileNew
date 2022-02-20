import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen from "../../components/containers/Screen";

import { colors, styles } from "../../styles";

export default ({ setFirstLaunch, statusBarHeight }) => {
  return (
    <Screen>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              ...styles.bgWhite,
              ...styles.pa16,
              ...styles.mx8,
              ...styles.mt16,
              ...styles.br8,
            }}
          >
            <Text style={{ ...styles.fs16, ...styles.red }}>
              End-User License Agreement (EULA) of{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers
              </Text>
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              This End-User License Agreement ("EULA") is a legal agreement
              between you and{" "}
              <Text
                style={{ ...styles.fs16, ...styles.red }}
                class="company_name"
              >
                Vent With Strangers{" "}
              </Text>
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              This EULA agreement governs your acquisition and use of our{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers{" "}
              </Text>
              software ("Software") directly from{" "}
              <Text
                style={{ ...styles.fs16, ...styles.red }}
                class="company_name"
              >
                Vent With Strangers{" "}
              </Text>
              or indirectly through a{" "}
              <Text
                style={{ ...styles.fs16, ...styles.red }}
                class="company_name"
              >
                Vent With Strangers{" "}
              </Text>
              authorized reseller or distributor (a "Reseller").{" "}
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              Please read this EULA agreement carefully before completing the
              installation process and using the{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers{" "}
              </Text>
              software. It provides a license to use the{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers{" "}
              </Text>
              software and contains warranty information and liability
              disclaimers.{" "}
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              If you register for a free trial of the{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers{" "}
              </Text>
              software, this EULA agreement will also govern that trial. By
              clicking "accept" or installing and/or using the{" "}
              <Text style={{ ...styles.fs16, ...styles.red }} class="app_name">
                Vent With Strangers{" "}
              </Text>
              software, you are confirming your acceptance of the Software and
              agreeing to become bound by the terms of this EULA agreement.{" "}
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              If you are entering into this EULA agreement on behalf of a
              company or other legal entity, you represent that you have the
              authority to bind such entity and its affiliates to these terms
              and conditions. If you do not have such authority or if you do not
              agree with the terms and conditions of this EULA agreement, do not
              install or use the Software, and you must not accept this EULA
              agreement.{" "}
            </Text>

            <Text style={{ ...styles.fs16, ...styles.red }}>
              This EULA agreement shall apply only to the Software supplied by{" "}
              <Text
                style={{ ...styles.fs16, ...styles.red }}
                class="company_name"
              >
                Vent With Strangers{" "}
              </Text>
              herewith regardless of whether other software is referred to or
              described herein. The terms also apply to any{" "}
              <Text
                style={{ ...styles.fs16, ...styles.red }}
                class="company_name"
              >
                Vent With Strangers{" "}
              </Text>
              updates, supplements, Internet-based services, and support
              services for the Software, unless other terms accompany those
              items on delivery. If so, those terms apply.{" "}
              <Text style={{ ...styles.fs16, ...styles.red }}>
                License Grant{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="company_name"
                >
                  Vent With Strangers{" "}
                </Text>
                hereby grants you a personal, non-transferable, non-exclusive
                licence to use the{" "}
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="app_name"
                >
                  Vent With Strangers{" "}
                </Text>
                software on your devices in accordance with the terms of this
                EULA agreement.{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                You are permitted to load the{" "}
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="app_name"
                >
                  Vent With Strangers{" "}
                </Text>
                software (for example a PC, laptop, mobile or tablet) under your
                control. You are responsible for ensuring your device meets the
                minimum requirements of the{" "}
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="app_name"
                >
                  Vent With Strangers
                </Text>{" "}
                software.{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                You are not permitted to:{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                <Text style={{ ...styles.fs16, ...styles.red }}>
                  Edit, alter, modify, adapt, translate or otherwise change the
                  whole or any part of the Software nor permit the whole or any
                  part of the Software to be combined with or become
                  incorporated in any other software, nor decompile, disassemble
                  or reverse engineer the Software or attempt to do any such
                  things{" "}
                </Text>
                <Text style={{ ...styles.fs16, ...styles.red }}>
                  Reproduce, copy, distribute, resell or otherwise use the
                  Software for any commercial purpose{" "}
                </Text>
                <Text style={{ ...styles.fs16, ...styles.red }}>
                  Allow any third party to use the Software on behalf of or for
                  the benefit of any third party{" "}
                </Text>
                <Text style={{ ...styles.fs16, ...styles.red }}>
                  Use the Software in any way which breaches any applicable
                  local, national or international law{" "}
                </Text>
                <Text style={{ ...styles.fs16, ...styles.red }}>
                  use the Software for any purpose that{" "}
                  <Text
                    style={{ ...styles.fs16, ...styles.red }}
                    class="company_name"
                  >
                    Vent With Strangers{" "}
                  </Text>
                  considers is a breach of this EULA agreement
                </Text>
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                Intellectual Property and Ownership{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="company_name"
                >
                  Vent With Strangers{" "}
                </Text>
                shall at all times retain ownership of the Software as
                originally downloaded by you and all subsequent downloads of the
                Software by you. The Software (and the copyright, and other
                intellectual property rights of whatever nature in the Software,
                including any modifications made thereto) are and shall remain
                the property of{" "}
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="company_name"
                >
                  Vent With Strangers{" "}
                </Text>
                .
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="company_name"
                >
                  Vent With Strangers
                </Text>{" "}
                reserves the right to grant licences to use the Software to
                third parties.{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                Termination{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                This EULA agreement is effective from the date you first use the
                Software and shall continue until terminated. You may terminate
                it at any time upon written notice to{" "}
                <Text
                  style={{ ...styles.fs16, ...styles.red }}
                  class="company_name"
                >
                  Vent With Strangers{" "}
                </Text>
                .
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                It will also terminate immediately if you fail to comply with
                any term of this EULA agreement. Upon such termination, the
                licenses granted by this EULA agreement will immediately
                terminate and you agree to stop all access and use of the
                Software. The provisions that by their nature continue and
                survive will survive any termination of this EULA agreement.{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                Governing Law{" "}
              </Text>
              <Text style={{ ...styles.fs16, ...styles.red }}>
                This EULA agreement, and any dispute arising out of or in
                connection with this EULA agreement, shall be governed by and
                construed in accordance with the laws of{" "}
                <Text style={{ ...styles.fs16, ...styles.red }} class="country">
                  ca
                </Text>
                .
              </Text>
            </Text>
          </View>
        </ScrollView>
        <View style={{ ...styles.bgWhite }}>
          <TouchableOpacity
            onPress={() => {
              AsyncStorage.setItem("alreadyLaunched", "true");
              setFirstLaunch(false);
            }}
            style={{
              ...styles.bgWhite,
              ...styles.fullCenter,
              borderTopWidth: 2,
              borderTopColor: colors.main,
              ...styles.pa16,
            }}
          >
            <Text
              style={{
                ...styles.fs24,
                ...styles.colorMain,
              }}
            >
              Agree To Our Conditions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};
