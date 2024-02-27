import getFeatureIds from "./getFeaturesID.js";
import getFeaturesList from "./getFeaturesList.js";

async function saveFeaturevalue() {
  try {
    let featureList = await getFeaturesList();
    let featuresID = await getFeatureIds();

    for (let feat in featureList) {
      let feature = featuresID.find((el) => el.name === feat);

      if (feature) {
        for (let val of featureList[feat].values()) {
          let result = await fetch(
            "https://libreria-test.net/api/product_feature_values",
            {
              method: "POST",
              headers: {
                Authorization:
                  "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
              },
              body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
              <product_feature_value>
                <id_feature>${feature.id}</id_feature>
                <value>
                  <language id="2">${val}</language>
                </value>
              </product_feature_value>
            </prestashop>`,
            }
          );

          console.log(result.status);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

await saveFeaturevalue();
