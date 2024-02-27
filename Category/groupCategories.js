import { getBigJson } from "../getBigJson.js";

export default async function groupCategories() {
  let res = [];
  try {
    const bigjson = await getBigJson();

    for (let prod of bigjson) {
      let { crmid, cf_1376, cf_1375, cf_1395 } = prod;

      //cf_1376 = cf_1376 === 'LIBRO' ? 'LIBROS' : cf_1376

      let name = [cf_1376, cf_1375]
      if (cf_1395 !== '' && cf_1395 !== ' ' && cf_1395 !== undefined && !cf_1395.includes("---")) name[2] = cf_1395

      if (cf_1376 === "LIBROS") res.push({ idprod: crmid, name });
    }
  } catch (err) {
    console.log(err);
  }

  return res;
}

console.log("AAAAAAAAAAAA", await groupCategories());
