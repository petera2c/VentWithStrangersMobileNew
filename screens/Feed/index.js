import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";

import Screen from "../../components/containers/Screen";
import NewVentComponent from "../../components/NewVent";
//import Vent from "../../components/Vent";

import { UserContext } from "../../context";

import { useIsMounted } from "../../util";
import { getMetaInformation, getVents, newVentListener } from "./util";

function FeedScreen({ navigation, route }) {
  const isMounted = useIsMounted();
  //  const { pathname, search } = route.params;
  const pathname = "";
  const search = "";

  const { user } = useContext(UserContext);

  const [vents, setVents] = useState([]);
  const [waitingVents, setWaitingVents] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const { metaTitle } = getMetaInformation(pathname);

  useEffect(() => {
    let newVentListenerUnsubscribe;

    setWaitingVents([]);
    setVents([]);
    setCanLoadMore(true);

    getVents(isMounted, pathname, setCanLoadMore, setVents, user, null);
    newVentListenerUnsubscribe = newVentListener(
      isMounted,
      pathname,
      setWaitingVents
    );

    return () => {
      if (newVentListenerUnsubscribe) return newVentListenerUnsubscribe();
    };
  }, [isMounted, pathname, search, setCanLoadMore, user]);
  return (
    <Screen navigation={navigation}>
      <NewVentComponent navigation={navigation} />
    </Screen>
  );
}

export default FeedScreen;
