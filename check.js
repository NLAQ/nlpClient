const url = 'http://e3b9e22d.ngrok.io/spell';
const panelShow = false;
let errors = [];
let warning = [];

window.onload = function () {
  const btnCheck = document.querySelector('#check');
  const btnFetch = document.querySelector('#fetch');
  btnCheck.onclick = onChecking;
}

function onChecking() {
  const inputBox = document.querySelector('#input-box');
  let content = inputBox.textContent;

  const data = { data: content };
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => {
      errors = res.errors;
      warning = res.warning;
      console.log(res);
      warning.forEach((w, index) => {
        content = replaceAll(content, w, warningTagSpan(w));
        console.log(warning);
        console.log(content);
        inputBox.innerHTML = content;
      });
      errors.forEach((item, index) => {
        const error = Object.keys(item)[0];
        content = replaceAll(content, error, errorTagSpan(error, index));
        inputBox.innerHTML = content;
        setErrorListener();
      });
    })
    .catch(err => console.log(err));
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function errorTagSpan(text, id) {
  return `<span class="error" data-errorId=${id}>${text}</span>`;
}

function warningTagSpan(text) {
  return `<span class="warning">${text}</span>`;
}

function setErrorListener() {
  const errors = document.querySelectorAll('.error');
  errors.forEach(item => {
    item.onclick = e => onErrorClick(e, item);
  });
}

function onErrorClick(event, item) {
  const panel = document.querySelector('#panel');
  renderPanel(panel, item);

  // show panel next to cursor
  panel.style.top = event.clientY + 'px';
  panel.style.left = event.clientX + 'px';
  panel.classList.remove('hidden');
  panelShown = true;
  panel.onblur = hidePanel;
  panel.focus();
}

function renderPanel(panel, error) {
  const list = panel.querySelector('ul');
  list.innerHTML = '';
  const id = error.dataset.errorid;
  const suggestions = Object.values(errors[id])[0];
  suggestions.forEach(option => {
    const node = document.createElement('li');
    node.onclick = (e) => {
      error.innerHTML = option;
      hidePanel();
    }
    node.innerHTML = option;
    list.appendChild(node);
  })
}

function hidePanel() {
  const panel = document.querySelector('#panel');
  panel.classList.add('hidden');
}

function clear() {
  panelShown = false;
  errors = [];
  panelList = document.querySelector('#panel > ul');
  panelList.innerHTML = '';
}
