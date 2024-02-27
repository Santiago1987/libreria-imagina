import { getBigJson } from "../getBigJson.js";

const getFeaturesList = async () => {
  let result = {};

  let res = [];

  try {
    const products = await getBigJson();

    for (let product of products) {
      let { cf_1394 } = product;

      if (!cf_1394.includes("--") && cf_1394 !== "") {
        let flist = cf_1394.split("|##|");

        for (let feat of flist) {
          let f = feat.split(":");
          if (!f[1]) break;
          let k = f[0].trim();
          let v = f[1].trim();

          if (!(result[k] instanceof Array)) result[k] = new Array();
          result[k].push(v);
        }
      }
    }

    for (let key of Object.keys(result)) {
      res[key] = new Set(result[key]);
    }
  } catch (err) {
    console.error(err);
  }

  return res;
};

export default getFeaturesList;
