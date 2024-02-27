import getFeaturesList from "./getFeaturesList.js";

async function saveFeatureKey() {
  let featureList = await getFeaturesList();

  for (let key in featureList) {
    try {
      let res = await fetch("https://libreria-test.net/api/product_features", {
        method: "POST",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
        body: `<?xml version="1.0" encoding="UTF-8"?>
          <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
          <product_feature>
              <name>
                <language id="2">${key}</language>
              </name>
            </product_feature>
          </prestashop>`,
      });

      console.log(key + " " + res.status);
    } catch (err) {
      console.error(err);
    }
  }
  console.log("FEATURE KEYS SAVED");
}

saveFeatureKey();
