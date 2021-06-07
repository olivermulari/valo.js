import VALO from "../src/valo"

const examples = ["basic", "cube"];
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

function getParams(url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

/**
 * Set scene to given query parameter.
 * If no query parameters, set to default
 */
function figureQueryParams() {
  const params = getParams(window.location.href);
  const name = params.scene;
  if (name === undefined) {
    return DEFAULT;
  } else {
    return name;
  }
}

async function loadAndSetCurrentFile() {
  let name = figureQueryParams();
  if (!examples.includes(name)) {
    console.error("No such sceneoption available");
    name = DEFAULT;
  }
  const text = await loadText(name);

  if (!text) {
    console.error("Something went wrong when fetching text file");
    return;
  }

  const textarea = document.getElementById("code");
  textarea.value = text;

  runCode(text);

  return name;
}

// UI functions

let isHidden = false;
/**
 * Code visibility functionality
 */
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

let mX = 0;
/**
 * Black filter when cursor is in the left side of the screen
 */
function addFilterListener() {
  window.addEventListener("pointermove", (e) => {
    const x = e.clientX;
    if (mX >= 250 && x < 250) {
      const code = document.getElementById("code");
      code.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    } else if (x >= 250 && mX < 250) {
      const code = document.getElementById("code");
      code.style.backgroundColor = "transparent";
    }
    mX = x;
  })
}

function createOption(parent, i) {
  const name = examples[i];
  const option = document.createElement("option");
  option.innerText = name;
  option.value = name;
  parent.appendChild(option);
}

/**
 * Initializes the options for the select tag
 */
function setSceneOptions(name) {
  const select = document.getElementById("scene-select");

  const nameIdx = examples.findIndex((v) => v === name);
  createOption(select, nameIdx);

  for (let i = 0; i < examples.length; ++i) {
    if (i !== nameIdx) {
      createOption(select, i);
    }
  }

  select.onchange = () => {
    window.location.href = updateQueryStringParameter(window.location.href, "scene", select.value);
  }
}

function initUI(name) {
  document.getElementById("code-btn").onclick = toggleHideCode;
  addFilterListener()
  setSceneOptions(name);
}

async function Main() {
  const name = await loadAndSetCurrentFile();
  initUI(name);
}

window.addEventListener('DOMContentLoaded', Main);