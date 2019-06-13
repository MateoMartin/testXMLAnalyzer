const fs = require("fs");
const { JSDOM } = require("jsdom");
const args = require("minimist")(process.argv.slice(2));
var similarity = require("similarity");

const getXPathName = element => {
  const children = element.parentElement
    ? Array.prototype.slice
        .call(element.parentElement.children)
        .filter(e => e.tagName == element.tagName)
    : [];
  if (children.length > 1) {
    return `${element.localName}[${children.indexOf(element)}]`;
  } else {
    return element.localName;
  }
};

const getPathTo = element => {
  let path = [];
  path.push(getXPathName(element));
  while (element.parentElement != null) {
    element = element.parentElement;
    path.push(getXPathName(element));
  }
  return path.reverse().join(" > ");
};

const getScoreSimilarity = (element, target) => {
  let score = 0;
  const attributes = Array.prototype.slice.apply(target.attributes);
  attributes.forEach(attr => {
    score += similarity(element.getAttribute(attr.name), attr.value);
  });
  score += similarity(element.textContent, target.textContent) * 10;
  return score;
};

const getSimilarElementsById = (origHTML, diffHTML, targetId) => {
  try {
    const originalDom = new JSDOM(origHTML);
    const diffDom = new JSDOM(diffHTML);

    const targetElement = originalDom.window.document.getElementById(targetId);
    const sameTagElements = Array.prototype.slice.call(
      diffDom.window.document.getElementsByTagName(targetElement.tagName)
    );
    const elementsWithScore = sameTagElements.map(e => {
      return { element: e, score: getScoreSimilarity(e, targetElement) };
    });
    elementsWithScore.sort((a, b) => (a.score < b.score ? 1 : -1));
    return elementsWithScore;
  } catch (err) {
    throw err;
  }
};

// Start of script:
if (args._.length < 2) {
  console.log(
    "Tool execution should be like: node analyzer.js <input_origin_file_path> <input_other_sample_file_path> <id(optional)>"
  );
  return;
}
try {
  const originalFile = fs.readFileSync(args._[0]);
  const diffFile = fs.readFileSync(args._[1]);
  const targetElementId = args._[2] ? args._[2] : "sendMessageButton";
  similarElementsOrdered = getSimilarElementsById(
    originalFile,
    diffFile,
    targetElementId
  );
  console.log(getPathTo(similarElementsOrdered[0].element));
} catch (err) {
  console.log("Error trying to find element by id", err);
}
