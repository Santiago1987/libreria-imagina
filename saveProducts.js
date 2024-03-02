import { getBigJson } from "./getBigJson.js";
import getCategories from "./Category/getCategories.js";
import getManufacturerID from "./Manufacturer/getManufacturerID.js";
import makeFeatureTable from "./Features/makeFeatureTable.js";
import destructureFeat from "./Features/destructureFeat.js";

async function saveProducts() {
  try {
    // JSON GIGANTE CON TODOS LOS ARTICULOS
    const bigjson = await getBigJson();

    // CATEGORIES CON ID DE SQL
    const catTableSQL = await getCategories();

    // TABLA CON TODAS LAS FEATURES Y SUS IDS
    const featuresTable = await makeFeatureTable();

    for (let i = 0; i < 100; i++) {
      let product = bigjson[i];
      if (!product) return;

      let { productid, qtyinstock, cf_1374, cf_1394 } = product;

      //OBTENGO EL ID DEL PROVEEDOR
      let manuid = await getManufacturerID(cf_1374);
      manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

      //LISTA DE LAS FEATURES DEL PRODUCTO
      let prodFeat = await destructureFeat(cf_1394);

      let featureXML = "";
      //ARMO EL XML DE LAS FEATURES CON SUS VALORES
      if (prodFeat) {
        // RECORRO LAS FEATURES DEL PRODUCTO
        for (let featName of Object.keys(prodFeat)) {
          let featval = prodFeat[featName];

          //BUSCO EN LA TABLA DE FEATURES EL ID DE LA FEATURE Y EL ID DEL VALOR
          let featureSQL = featuresTable.find((el) => el.name === featkey);

          if (!featureSQL) throw new Error("Ningun Feature name coincidio ptm");

          let { id: idFeat, values } = featureSQL;

          //BUSCO EL ID DE LOS VALUES
          let featureValSQL = values.find((el) => el.name === featval);
          if (!featureValSQL)
            throw new Error("Ningun Feature value name coincidio ptm");
        }

        let { id: idvalue } = featureValSQL;

        // UNA VEZ OBTENIDOS LOS 2 IDS ARMO EL XML DE LAS FEATURES
        featureXML =
          featureXML +
          `<product_feature>
              <id><![CDATA[{{${idFeat}}}]]></id>
              <id_feature_value><![CDATA[{{${idvalue}}}]]></id_feature_value>
            </product_feature>`;
      }
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}
