const jsdom = require("jsdom");
const { JSDOM } = jsdom;

let documentDom;

JSDOM.fromURL(
  "https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html",
  { includeNodeLocations: true }
)
  .then((dom) => {
    documentDom = dom;
    traverseNode(getAllByTag("h3")[0]);
  })
  .catch((error) => {
    console.log(error);
  });

function getAllByTag(tag) {
  return documentDom.window.document.getElementsByTagName(tag);
}

// function traverseNode(element) {
//   // if node is null, return
//   if (!element || element.textContent.includes("Special thanks to")) {
//     return;
//   }
//   // if node has no children, print the text and move to next sibling
//   if (element.childElementCount === 0) {
//     if (element.textContent[0] === "(") {
//       const content = element.textContent.split("(")[1].split(")")[0];
//       const [id, state] = content.split(",");
//       let link;
//       if (element.tagName === "A") {
//         link = element.getAttribute("href");
//       }
//       console.log(`id: ${id}, state: ${state}, link: ${link}`);
//     }
//     // else {
//     //   if (element.textContent.length > 0) {
//     //     console.log(element.textContent);
//     //   }
//     // }
//     // find next Element to parse
//     let nextElement = element;
//     while (!nextElement.nextElementSibling) {
//       nextElement = nextElement.parentNode;
//     }
//     return traverseNode(nextElement.nextElementSibling);
//   }
//   // if node has children, traverse children
//   if (element.childElementCount > 0) {
//     if (element.textContent.length > 4) {
//       const initialElement = element.textContent.trim().split(" ");
//       if (isNaN(parseInt(initialElement)) && element.textContent.includes("(")) {
//         console.log("######################################");
//         const content = element.textContent.trim().split("(");
//         const category = content[0].trim();
//         const total = content[1].split(",")[0].trim();
//         console.log(`Category: ${category}, total: ${total}`);
//         console.log("######################################");
//       } else {
//         console.log("======================================");
//         const contentArray = element.textContent.trim().split(" ");
//         const total = contentArray[0];
//         const model = contentArray.slice(1).join(" ");
//         console.log(`Total: ${total}, model: ${model.split(":")[0]}\n`);
//       }
//     }
//     return traverseNode(element.children[0]);
//   }
// }

function traverseNode(element) {
  let nextElement = element;
  const data = {}
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
          console.log("######################################");
          const content = nextElement.textContent.trim().split("(");
          const category = content[0].trim();
          const total = content[1].split(",")[0].trim();
          console.log(`Category: ${category}, total: ${total}`);
          console.log("######################################");
        } else {
          console.log("======================================");
          const contentArray = nextElement.textContent.trim().split(" ");
          const total = contentArray[0];
          const model = contentArray.slice(1).join(" ");
          console.log(`Total: ${total}, model: ${model.split(":")[0]}\n`);
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
        console.log(`id: ${id}, state: ${state}, link: ${link}`);
      } else {
        if (nextElement.textContent.length > 0) {
          console.log(nextElement.textContent);
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
}
