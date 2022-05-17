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
          // isNaN(parseInt(initialElement)) &&
          nextElement.textContent.includes("(") &&
          nextElement.tagName === "H3"
        ) {
          const content = nextElement.textContent.trim().split("(");
          const category = content[0].trim();
          const total = content[1].split(",")[0].trim();
          console.log(`Category: ${category}, total: ${total}`);
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
      // some category titles don't have
      if (
        nextElement.textContent.includes("(") &&
        nextElement.tagName === "H3"
      ) {
        const content = nextElement.textContent.trim().split("(");
        const category = content[0].trim();
        const total = content[1].split(",")[0].trim();
        console.log(`Category: ${category}, total: ${total}`);
        mostRecentCategory = category;
      }
      if (nextElement.textContent[0] === "(") {
        const content = nextElement.textContent.split("(")[1].split(")")[0];
        let [id, state, possibleState] = content.split(",");
        if (possibleState) {
          const [id2, id3] = state.split(" and ");
          const event = possibleState?.trim();
          let link;
          if (nextElement.tagName === "A") {
            link = nextElement.getAttribute("href");
          }
          data = [
            ...data,
            {
              id: parseId,
              oryxId: id,
              country: "ru",
              category: conversionCategory[mostRecentCategory],
              model: mostRecentModel,
              event,
              imageUrl: link,
            },
          ];
          parseId++;
          data = [
            ...data,
            {
              id: parseId,
              oryxId: id2,
              country: "ru",
              category: conversionCategory[mostRecentCategory],
              model: mostRecentModel,
              event,
              imageUrl: link,
            },
          ];
          parseId++;
          data = [
            ...data,
            {
              id: parseId,
              oryxId: id3,
              country: "ru",
              category: conversionCategory[mostRecentCategory],
              model: mostRecentModel,
              event,
              imageUrl: link,
            },
          ];
        } else {
          const event = state?.trim();
          let link;
          if (nextElement.tagName === "A") {
            link = nextElement.getAttribute("href");
          }
          if (id.includes("and")) {
            const [id1, id2] = id.split(" and ");
            data = [
              ...data,
              {
                id: parseId,
                oryxId: id1,
                country: "ru",
                category: conversionCategory[mostRecentCategory],
                model: mostRecentModel,
                event,
                imageUrl: link,
              },
            ];
            parseId++;
            data = [
              ...data,
              {
                id: parseId,
                oryxId: id2,
                country: "ru",
                category: conversionCategory[mostRecentCategory],
                model: mostRecentModel,
                event,
                imageUrl: link,
              },
            ];
          } else {
            // console.log(data)
            // console.log(mostRecentCategory)
            // console.log(mostRecentModel)
            data = [
              ...data,
              {
                id: parseId,
                oryxId: id,
                country: "ru",
                category: conversionCategory[mostRecentCategory],
                model: mostRecentModel,
                event,
                imageUrl: link,
              },
            ];
          }
        }
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

const conversionCategory = {
  Tanks: "tank",
  "Armoured Fighting Vehicles": "armoured_fighting_vehicle",
  "Infantry Fighting Vehicles": "infrantry_fighting_vehicle",
  "Armoured Personnel Carriers": "armoured_personnel_carrier",
  "Mine-Resistant Ambush Protected": "mrap_vehicle",
  "Infantry Mobility Vehicles": "infantry_mobility_vehicle",
  "Command Posts And Communications Stations":
    "command_posts_communications_station",
  "Engineering Vehicles And Equipment": "engineering_vehicle_and_equipment",
  "Towed Artillery": "towed_artillery",
  "Heavy Mortars": "heavy_mortar",
  "Self-Propelled Artillery": "self_propelled_artillery",
  "Multiple Rocket Launchers": "multiple_rocket_launcher",
  "Anti-Aircraft Guns": "anti_aircraft_gun",
  "Self-Propelled Anti-Aircraft Guns": "self_propelled_anti_aircraft_gun",
  "Surface-To-Air Missile Systems": "surface_to_air_missile_system",
  Radars: "radar_and_communication_equipment",
  "Jammers And Deception Systems": "jammer_and_deception_system",
  Aircraft: "aircraft",
  Helicopters: "helicopter",
  "Unmanned Aerial Vehicles": "uav",
  "Naval Ships": "naval_ship",
  "Logistics Trains": "logistics_train",
  "Trucks, Vehicles and Jeeps": "truck_vehicle__jeep",
};
