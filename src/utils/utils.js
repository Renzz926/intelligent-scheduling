
/**
 * px转rem
 */
export function getDprSize(fontSize) {
  let deviceWidth = document.documentElement.clientWidth;
  const tmpWidth = (document.documentElement.clientHeight * 1600) / 900;
  const designRes = window.screen.width * 9 === window.screen.height * 16; // 实际分辨率
  if (!designRes && window.screen.width * 10 === window.screen.height * 16) {
    // 屏幕分辨率为16：10
    deviceWidth = (document.documentElement.clientWidth * 9) / 10;
  }
  deviceWidth = deviceWidth < tmpWidth ? deviceWidth : tmpWidth;
  return Math.floor((deviceWidth * fontSize) / 1600);
}

/**
 * 判断是否是合法URL
 */
export const isUrl = (path) => {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

/**
 * 获取地址的参数
 */
 export const getPageQuery = () => {
  return parse(window?.location?.search?.split('?')[1]);
};

/**
 * 错误处理
 *  */
 export const errorHandle = (err) => {
  message.error(err?.msg || err?.message);
};

/**
 * 判断是否为JSON
 * @param {*} str
 */
 export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  return false;
}

/**
 * 空数组
 * @param {*} arr
 */
 export function isEmptyArray(arr) {
  if (arr instanceof Array && arr.length > 0) {
    return false;
  }
  return true;
}

/**
 * 空对象
 * @param {*} Object
 */
 export function isEmptyObject(obj) {
  if (!obj) {
    return true;
  }
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 得到token
 */
 export function getProjectToken() {
  return localStorage.getItem(`${PROJECT_KEY}-token`) || '';
}

/**
 * 清空token
 */
export function rmProjectToken() {
  localStorage.removeItem(`${PROJECT_KEY}-token`);
}