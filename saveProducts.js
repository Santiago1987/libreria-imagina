import { getBigJson } from "./getBigJson.js";
import getCategories from "./Category/getCategories.js";
import getManufacturerID from "./Manufacturer/getManufacturerID.js";

async function saveProducts() {
  try {
    const bigjson = await getBigJson();

    const catFromSQL = await getCategories();

    for (let i = 0; i < 100; i++) {
      let product = bigjson[i];
      if (!product) return;

      let { productid, qtyinstock, cf_1374 } = product;

      let manuid = await getManufacturerID(cf_1374);
      manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

      //falta feature y el resto
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}
