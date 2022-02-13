import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import OnlineUsers from "../../../screens/OnlineUsers";

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="OnlineUsers">
      <Drawer.Screen name="OnlineUsers" component={OnlineUsers} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigation;
