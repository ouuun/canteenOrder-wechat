// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    envList,
    selectedEnv: envList[0],
  }
});
