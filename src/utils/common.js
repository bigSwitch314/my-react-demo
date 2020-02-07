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