import { getBigJson } from "../getBigJson.js";
import savedProductList from "../savedProductList.js";
import saveStock from "./savestock.js";
import { getStockIdTable, saveStockComplete } from "./savestock.js";

async function stock() {
  //let result = []
  try {
    const bigjson = await getBigJson();
    const savedProducts = await savedProductList();
    const stockIdTable = await getStockIdTable();

    for (let prod of savedProducts) {
      let { id, reference } = prod;

      let stockID = stockIdTable.find((el) => el.id_product === id);

      if (stockID) {
        let { id: id_stock } = stockID;

        let produdct = bigjson.find((el) => el.crmid == reference);

        if (!produdct) console.error("NO SE PUDIO ", el.crmid, reference);
        if (produdct) {
          let { qtyinstock } = produdct;

          //result.push({ id_stock, qtyinstock: +qtyinstock })
          let result = await saveStockComplete(id_stock, +qtyinstock, id);
          console.log(
            "Product: " +
              id +
              " status: " +
              result.status +
              " qty: " +
              qtyinstock
          );
        }
      }
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
  return;
}
await stock();
