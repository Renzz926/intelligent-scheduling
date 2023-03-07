import { IApi } from 'umi';

export default (api: IApi) => {
  api.addHTMLScripts(() => [
    `function setHtmlFontSize() {let deviceWidth = document.documentElement.clientWidth;const tmpWidth = (document.documentElement.clientHeight * 1600) / 900;const designRes = window.screen.width * 9 === window.screen.height * 16;if (!designRes && window.screen.width * 10 === window.screen.height * 10) {deviceWidth = (document.documentElement.clientWidth * 9) / 10;}deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;document.documentElement.style.fontSize = deviceWidth/16 + "px";}setHtmlFontSize();window.addEventListener('resize',() => {setHtmlFontSize();},false);`,
    // `mapboxgl.accessToken = 'pk.eyJ1IjoidG1oMDYxOSIsImEiOiJjamhyaDdwMGcwZDZkM2RwcG85a3RnZ3F0In0.nfxn0HZs_RhFnGuhDgzEOg'`,
    // `window._AMapSecurityConfig = { securityJsCode:'f0adc4169cd4a83a5a6beb16e48139cd'}`
  ]);
};