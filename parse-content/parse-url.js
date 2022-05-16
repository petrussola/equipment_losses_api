const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("node:fs");

let documentDom;

JSDOM.fromURL(
  "https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html",
  { includeNodeLocations: true }
)
  .then((dom) => {
    documentDom = dom;
    const results = traverseNode(getAllByTag("h3")[0]);
    fs.writeFileSync("./parse-content/data.json", JSON.stringify(results));
  })
  .catch((error) => {
    console.log(error);
  });

function getAllByTag(tag) {
  return documentDom.window.document.getElementsByTagName(tag);
}

function traverseNode(element) {
  let nextElement = element;
  let data = [];
  let parseId = 1;
  let mostRecentCategory = "abc";
  let mostRecentModel = "abc";
  while (
    nextElement &&
    !nextElement.textContent.includes("Special thanks to")
  ) {
    // if element has children, set next element to first child
    if (nextElement.childElementCount > 0) {
      // detect if nextElement is a title and print it
      if (nextElement.textContent.length > 4) {
        const initialElement = nextElement.textContent.trim().split(" ");
        if (
          isNaN(parseInt(initialElement)) &&
          nextElement.textContent.includes("(")
        ) {
          // console.log("######################################");
          const content = nextElement.textContent.trim().split("(");
          const category = content[0].trim();
          const total = content[1].split(",")[0].trim();
          // console.log(`Category: ${category}, total: ${total}`);
          mostRecentCategory = category;
          // console.log(category);
          // console.log("######################################");
        } else {
          // console.log("======================================");
          const contentArray = nextElement.textContent.trim().split(" ");
          const total = contentArray[0];
          const model = contentArray.slice(1).join(" ");
          mostRecentModel = model.split(":")[0];
          // console.log(model.split(":")[0]);
          // console.log(`Total: ${total}, model: ${model.split(":")[0]}\n`);
        }
      }
      nextElement = nextElement.children[0];
      // otherwise move to next sibling
    } else if (nextElement.nextElementSibling) {
      if (nextElement.textContent[0] === "(") {
        const content = nextElement.textContent.split("(")[1].split(")")[0];
        const [id, state] = content.split(",");
        let link;
        if (nextElement.tagName === "A") {
          link = nextElement.getAttribute("href");
        }
        // console.log(data)
        // console.log(mostRecentCategory)
        // console.log(mostRecentModel)
        data = [
          ...data,
          {
            id: parseId.trim(),
            oryxId: id,
            country: "ru",
            category: mostRecentCategory.trim(),
            model: mostRecentModel.trim(),
            event: state.trim(),
            imageUrl: link.trim(),
          },
        ];
        parseId++;
        // console.log(`id: ${id}, state: ${state}, link: ${link}`);
      } else {
        if (nextElement.textContent.length > 0) {
          // console.log(nextElement.textContent);
        }
      }
      nextElement = nextElement.nextElementSibling;
      // otherwise search for next parent with siblin
    } else {
      let el = nextElement;
      while (!el.parentNode.nextElementSibling) {
        el = el.parentNode;
      }
      nextElement = el.parentNode.nextElementSibling;
    }
  }
  console.log("done!");
  return data;
}
