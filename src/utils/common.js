/** 淡出 */
export function fadeOut(id) {
  const element = document.getElementById(id);
  let op = 1; // initial opacity
  const timer = setInterval(function() {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ')';
    op -= op * 0.3;
  }, 50);
}

/** 淡入 */
export function fadeIn(id) {
  const element = document.getElementById(id);
  console.log('element------', element)
  let op = 0.1; // initial opacity
  element.style.display = 'block';
  const timer = setInterval(function() {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ')';
    op += op * 0.05;
  }, 10);
}

/** 去除html标签 */
export function deleteHtmlTag(str) {
  // 去掉所有的html标签和&nbsp;之类的特殊符合
  return str.replace(/<[^>]+>|&[^>]+;/g, '').trim()
}

/**  随机截取字符串 */
export function substring(str, min, max) {
  const length = getRandomIntInclusive(min, max)
  return str.substring(0, length)
}

/** 随机获取范围内整数 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}