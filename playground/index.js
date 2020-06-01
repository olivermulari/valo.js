import VALO from '../src/index';

const examples = ["cube", "test"];
const DEFAULT = "cube";
let renderer;

// LOAD functions

function destoryScene() {
  if (renderer !== undefined) {
    renderer.destroy();
    renderer = undefined;
  }
}

function runCode(script) {
  destoryScene();
  try {
    const getFunc = Function("VALO", `return function () { ${script}; return createScene; }`);
    const runnable = getFunc(VALO).call();

    renderer = runnable();

  } catch (error) {
    console.error(error)
  }
}

async function loadText(name) {
  let url = `examples/${name}.js`;

  return fetch(url)
    .then((res) => res.text())
    .then((raw) => raw)
    .catch((err) => console.log(err));
}

async function loadAndSetCurrentFile() {
  const text = await loadText("cube");

  if (!text) {
    console.error("Something went wrong when fetching text file");
    return;
  }

  const textarea = document.getElementById("code");
  textarea.value = text;

  runCode(text);
}

// UI functions

let isHidden = false;
function toggleHideCode() {
  const textarea = document.getElementById("code");
  const button = document.getElementById("code-btn");
  if (isHidden) {
    textarea.style.visibility = "visible";
    button.textContent = "Hide Code";
    isHidden = false;
  } else {
    textarea.style.visibility = "hidden";
    button.textContent = "Show Code";
    isHidden = true;
  }
}

function initUI() {
  document.getElementById("code-btn").onclick = toggleHideCode;
}

function Main() {
  loadAndSetCurrentFile()
  initUI()
}

window.addEventListener('DOMContentLoaded', Main);