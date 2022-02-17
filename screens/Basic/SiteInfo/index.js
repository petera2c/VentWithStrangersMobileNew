import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons/faLinkedin";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import Screen from "../../../components/containers/Screen";
import KarmaBadge from "../../../components/views/KarmaBadge";

import { styles } from "../../../styles";

function SiteInfoScreen({ navigation }) {
  const [activeBadge, setActiveBadge] = useState(0);

  return (
    <Screen navigation={navigation}>
      <ScrollView>
        <View style={{ ...styles.pa16 }}>
          <View style={{ ...styles.box, ...styles.pa32 }}>
            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.title, ...styles.mb8 }}>
                Vent Online With People Who Care
              </Text>
              <Text style={{ ...styles.pTag, ...styles.tac }}>
                People care and help is here. Vent and chat anonymously to be a
                part of a community committed to making the world a better
                place. This is a website for people that want to be heard and
                people that want to listen. Your mental health is our priority.
              </Text>
            </View>

            <View style={{ ...styles.mb16 }}>
              <TouchableOpacity
                onPress={() => navigation.jumpTo("QuoteContest")}
              >
                <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                  Daily Feel Good Quote Contest
                </Text>
              </TouchableOpacity>
              <Text style={{ ...styles.pTag }}>
                Every day we display a feel good quote. The winner from this
                contest will be show cased for the following day. Submit your
                quote to potentially win.
              </Text>
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                What the Heck are Karma Points?
              </Text>
              <Text style={{ ...styles.pTag }}>
                Karma Points are gained when your vent or comment gets upvoted
                or when you reach a new{" "}
                <TouchableOpacity onPress={() => navigation.jumpTo("Rewards")}>
                  <Text style={{ ...styles.fs20, ...styles.colorMain }}>
                    milestone
                  </Text>
                </TouchableOpacity>
                . Karma points will be lost if you are reported.
              </Text>
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text
                style={{ ...styles.titleSmall, ...styles.tac, ...styles.mb8 }}
              >
                With Great Power Comes Great Responsibility
              </Text>
              <View className="column gap8">
                <Text style={{ ...styles.pTag, ...styles.tac, ...styles.mb8 }}>
                  Click on a badge to learn more :)
                </Text>
                <View
                  style={{
                    ...styles.flexRow,
                    ...styles.fullCenter,
                    ...styles.wrap,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setActiveBadge(0)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 50 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(1)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 100 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(2)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 250 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(3)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 500 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(4)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 1000 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(5)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 2500 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(6)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 5000 }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveBadge(7)}
                    style={{ ...styles.pa8 }}
                  >
                    <KarmaBadge userBasicInfo={{ karma: 10000 }} />
                  </TouchableOpacity>
                </View>
                <View style={{ ...styles.fullCenter }}>
                  <Text style={{ ...styles.titleSmall, ...styles.my8 }}>
                    {badgeDescriptions[activeBadge].title}
                  </Text>
                  <View>
                    {badgeDescriptions[activeBadge].benefits.map(
                      (benefit, index) => (
                        <Text
                          key={index}
                          style={{ ...styles.pTag, ...styles.tac }}
                        >
                          {benefit}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
                What Can You Do on VWS?
              </Text>
              <View style={{ ...styles.pl16 }}>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  Chat anonymously with strangers
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("NewVent")}
                >
                  <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                    Create vents anonymously
                  </Text>
                </TouchableOpacity>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  Comment on vents anonymously
                </Text>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  Tag someone in a post or comment by placing @ before their
                  username
                </Text>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  Earn Karma Points
                </Text>
              </View>
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.titleSmall, ...styles.mb16 }}>
                How Do You Gain Karma Points?
              </Text>
              <View style={{ ...styles.pl16 }}>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  <Text style={{ ...styles.colorGreen }}>+4</Text> For an upvote
                  on your comment
                </Text>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  <Text style={{ ...styles.colorGreen }}>+4</Text> For an upvote
                  on your vent
                </Text>
                <Text
                  style={{
                    ...styles.alignEnd,
                    ...styles.pTag,
                    ...styles.mb8,
                  }}
                >
                  However, the best way to earn karma is through Rewards
                </Text>
                <Text style={{ ...styles.pTag, ...styles.mb8 }}>
                  <Text style={{ ...styles.colorRed }}>- 30</Text> When you get
                  reported (for a valid reason)
                </Text>
              </View>
            </View>

            <View style={{ ...styles.mb16 }}>
              <Text style={{ ...styles.titleSmall, ...styles.mb8 }}>
                If you have any issues please email us at
              </Text>
              <Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("mailto:ventwithstrangers@gmail.com")
                  }
                >
                  <Text style={{ ...styles.pTag, ...styles.colorMain }}>
                    ventwithstrangers@gmail.com
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const badgeDescriptions = [
  {
    benefits: ["Can create a vent once every 4 hours"],
    title: "Basic Orange Badge",
  },
  {
    benefits: ["Can create a vent once every 3 hours"],
    title: "Basic Red Badge",
  },
  {
    benefits: ["Can create a vent once every 2 hours"],
    title: "Basic Green Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Basic Blue Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Orange Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Red Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Green Badge",
  },
  {
    benefits: ["Can create a vent once every 1 hour"],
    title: "Super Blue Badge",
  },
];

export default SiteInfoScreen;
