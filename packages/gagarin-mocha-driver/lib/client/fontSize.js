// http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
export function fontSize (el = document.body) {
  const test = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.visiblity = 'hidden';
  div.style.height = 'auto';
  div.style.width = 'auto';
  div.style.whiteSpace = 'nowrap';
  div.textContent = test;
  el.appendChild(div);
  const result = (div.clientWidth + 1) / test.length;
  el.removeChild(div);
  return result;
};
