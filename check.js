const url = 'http://5c93cbee.ngrok.io/spell';
let errors = [];
let warnings = [];
let isFetching = false;

const capablyCharacters = [',', ';', '-', ' ', '!', '.'];

window.onload = function () {
  const btnCheck = document.querySelector('#check');
  btnCheck.onclick = onChecking;
}

function onChecking() {
  const inputBox = document.querySelector('#input-box');
  let content = inputBox.textContent;
  lastChar = content.substr(-1);
  console.log(content.substr(-1));
  content = content.trim();
  if (!capablyCharacters.includes(lastChar)) {
    content = content.concat('.');
  }
  content = ".".concat(content);
  console.log(content);

  fetching();

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
      fetchSuccess();
      errors = res.errors;
      warnings = res.warning;

      warnings.forEach(warning => {
        console.log(warning);
        capablyCharacters.forEach(character => {
          const { regex1, regex2, replaceWord } = regex(warning, character);
          content = replaceAll(content, regex1, warningTagSpan(replaceWord));
          content = replaceAll(content, regex2, warningTagSpan(replaceWord));
          inputBox.innerHTML = content;
        });
      });

      errors.forEach((item, index) => {
        const error = Object.keys(item)[0];
        capablyCharacters.forEach(character => {
          const { regex1, regex2, replaceWord } = regex(error, character);
          content = replaceAll(content, regex1, errorTagSpan(replaceWord, index));
          content = replaceAll(content, regex2, errorTagSpan(replaceWord, index));
          inputBox.innerHTML = content;
          setErrorListener();
        });
      })
    })
    .catch(err => {
      console.log(err);
      fetchFail();
    });
}

function regex(error, character) {
  return {
    regex1: ` ${error}\\${character}`,
    regex2: `\\${character}${error} `,
    replaceWord: `${error}${character}`
  }
}

function fetching() {
  const selector = document.querySelector('#status');
  selector.innerHTML = 'Fetching';
}

function fetchSuccess() {
  const selector = document.querySelector('#status');
  selector.innerHTML = 'Done';
}

function fetchFail() {
  const selector = document.querySelector('#status');
  selector.innerHTML = 'Fail';
}

function replaceAll(str, pattern, replace) {
  return str.replace(new RegExp(pattern, 'gi'), replace);
}

function errorTagSpan(text, id) {
  return ` <span class="error" data-errorId=${id}>${text}</span> `;
}

function warningTagSpan(text) {
  return ` <span class="warning">${text}</span> `;
}

function setErrorListener() {
  const errors = document.querySelectorAll('.error');
  errors.forEach(item => {
    item.onclick = e => onErrorClick(e, item);
  });
}

function onErrorClick(event, item) {
  const panel = document.querySelector('#panel');
  console.log(item);
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
  // console.log(character);
  const list = panel.querySelector('ul');
  list.innerHTML = '';
  const id = error.dataset.errorid;
  const suggestions = Object.values(errors[id])[0];
  console.log(error);
  suggestions.forEach(option => {
    const node = document.createElement('li');
    node.onclick = (e) => {
      error.innerHTML = ` ${option} `;
      // error.off('click');
      error.classList.remove('error');
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
