import { StyleSheet } from "react-native";

export const colors = {
  main: "#2096f2",
  lightMain: "#cffdff",
  grey1: "#8d96a7",
  grey2: "#f8f8f8",
  grey3: "#8c96a6",
  grey4: "#f2f5f9",
  grey5: "#a9b1b6",
  grey7: "#e1e6ea",
  grey9: "#859097",
  grey10: "#f4f8fb",
  grey11: "#3a4046",
  red: "#f44336",
  white: "#fff",
  primaryFont: "#3a4046"
};

export const styles = StyleSheet.create({
  test: { backgroundColor: "red" },

  roundIcon: {
    width: 30,
    height: 30,
    backgroundColor: colors.main,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  roundIconBig: {
    width: 60,
    height: 60,
    backgroundColor: colors.main,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  wrap: {
    flexWrap: "wrap"
  },

  border: { borderWidth: 1, borderColor: colors.grey7 },
  borderRed: { borderWidth: 1, borderColor: colors.red },
  borderMain: { borderWidth: 1, borderColor: colors.main },
  borderTop: { borderTopWidth: 1, borderTopColor: colors.grey7 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: colors.grey7 },
  borderBottomMain: { borderBottomWidth: 1, borderBottomColor: colors.main },
  button1: { color: colors.grey1 },
  button2: { backgroundColor: colors.main },
  button3: {
    borderWidth: 1,
    borderColor: colors.main
  },

  shadowBottom: {
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#999999",
    shadowOpacity: 0.3
  },
  shadowAll: {
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#999999",
    shadowOpacity: 1
  },

  taggedUser: {
    backgroundColor: colors.lightMain
  },

  justifyCenter: { justifyContent: "center" },
  justifyBetween: { justifyContent: "space-between" },
  justifyEnd: { justifyContent: "flex-end" },
  alignCenter: { alignItems: "center" },
  alignEnd: { alignItems: "flex-end" },
  fullCenter: { alignItems: "center", justifyContent: "center" },

  fill: { flexGrow: 1 },
  xFill: { width: "100%" },
  flexColumn: { flexDirection: "column" },
  flexRow: { flexDirection: "row" },

  bgGrey2: { backgroundColor: colors.grey2 },
  bgGrey4: { backgroundColor: colors.grey4 },
  bgGrey10: { backgroundColor: colors.grey10 },
  bgWhite: { backgroundColor: colors.white },
  bgRed: { backgroundColor: colors.red },
  bgMain: { backgroundColor: colors.main },
  bgLightMain: {
    backgroundColor: colors.lightMain
  },

  primary: { color: colors.primaryFont },
  colorGrey1: {
    color: colors.grey1
  },
  colorGrey3: {
    color: colors.grey3
  },
  colorGrey5: {
    color: colors.grey5
  },
  colorGrey9: {
    color: colors.grey9
  },
  colorGrey11: {
    color: colors.grey11
  },
  colorMain: {
    color: colors.main
  },
  colorRed: {
    color: colors.red
  },
  colorWhite: {
    color: colors.white
  },
  colorBlack: { color: colors.black },

  online: {
    minWidth: 16,
    minHeight: 16,
    backgroundColor: "#1FAB89",
    borderRadius: 100
  },

  tac: { textAlign: "center" },
  extraLight: { fontFamily: "nunito-extra-light" },
  light: { fontFamily: "nunito-light" },
  semiBold: { fontFamily: "nunito-semi-bold" },
  bold: { fontFamily: "nunito-bold" },
  extraBold: { fontFamily: "nunito-extra-bold" },

  fs14: { fontSize: 14 },
  fs16: { fontSize: 16 },
  fs18: { fontSize: 18 },
  fs20: { fontSize: 20 },
  fs22: { fontSize: 22 },
  fs24: { fontSize: 24 },
  fs26: { fontSize: 26 },
  fs28: { fontSize: 28 },
  fs32: { fontSize: 32 },
  fs36: { fontSize: 36 },
  fs40: { fontSize: 40 },

  br2: { borderRadius: 2 },
  br4: { borderRadius: 4 },
  br8: { borderRadius: 8 },
  br16: { borderRadius: 16 },
  br32: { borderRadius: 32 },

  pt2: { paddingTop: 2 },
  pt4: { paddingTop: 4 },
  pt8: { paddingTop: 8 },
  pt16: { paddingTop: 16 },
  pt32: { paddingTop: 32 },

  pr2: { paddingRight: 2 },
  pr4: { paddingRight: 4 },
  pr8: { paddingRight: 8 },
  pr16: { paddingRight: 16 },
  pr32: { paddingRight: 32 },

  pb2: { paddingBottom: 2 },
  pb4: { paddingBottom: 4 },
  pb8: { paddingBottom: 8 },
  pb16: { paddingBottom: 16 },
  pb32: { paddingBottom: 32 },

  pl2: { paddingLeft: 2 },
  pl4: { paddingLeft: 4 },
  pl8: { paddingLeft: 8 },
  pl16: { paddingLeft: 16 },
  pl32: { paddingLeft: 32 },

  px2: { paddingRight: 2, paddingLeft: 2 },
  px4: { paddingRight: 4, paddingLeft: 4 },
  px8: { paddingRight: 8, paddingLeft: 8 },
  px16: { paddingRight: 16, paddingLeft: 16 },
  px32: { paddingRight: 32, paddingLeft: 32 },

  py2: { paddingTop: 2, paddingBottom: 2 },
  py4: { paddingTop: 4, paddingBottom: 4 },
  py8: { paddingTop: 8, paddingBottom: 8 },
  py16: { paddingTop: 16, paddingBottom: 16 },
  py32: { paddingTop: 32, paddingBottom: 32 },

  pa2: { padding: 2 },
  pa4: { padding: 4 },
  pa8: { padding: 8 },
  pa16: { padding: 16 },
  pa32: { padding: 32 },

  mt1: { marginTop: 1 },
  mt2: { marginTop: 2 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mr1: { marginRight: 1 },
  mr2: { marginRight: 2 },
  mr4: { marginRight: 4 },
  mr8: { marginRight: 8 },
  mr16: { marginRight: 16 },
  mb1: { marginBottom: 1 },
  mb2: { marginBottom: 2 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  ml1: { marginLeft: 1 },
  ml2: { marginLeft: 2 },
  ml4: { marginLeft: 4 },
  ml8: { marginLeft: 8 },
  ml16: { marginLeft: 16 },
  mx1: { marginRight: 1, marginLeft: 1 },
  mx2: { marginRight: 2, marginLeft: 2 },
  mx4: { marginRight: 4, marginLeft: 4 },
  mx8: { marginRight: 8, marginLeft: 8 },
  mx16: { marginRight: 16, marginLeft: 16 },
  my1: { marginTop: 1, marginBottom: 1 },
  my2: { marginTop: 2, marginBottom: 2 },
  my4: { marginTop: 4, marginBottom: 4 },
  my8: { marginTop: 8, marginBottom: 8 },
  my16: { marginTop: 16, marginBottom: 16 },
  ma1: { margin: 1 },
  ma2: { margin: 2 },
  ma4: { margin: 4 },
  ma8: { margin: 8 },
  ma16: { margin: 16 }
});