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

      let {
        crmid,
        qtyinstock,
        cf_1372,
        unit_price,
        description,
        productname,
        weight,
        cf_1374,
        cf_1376,
        cf_1375,
        cf_1395,
        cf_1394,
      } = product;

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

          let { values } = featureSQL;

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

        // CATEGORIES
        //ARMO UNA ARRAY CON LAS JERARQUIAS
        let catNames = [cf_1376, cf_1375];
        if (
          cf_1395 !== "" &&
          cf_1395 !== " " &&
          cf_1395 !== undefined &&
          !cf_1395.includes("---")
        )
          catNames[2] = cf_1395;

        // CONS LOS NOMBRES BUSCO LOS IDS DE LA BD SQL
        let cat = catTableSQL.find((el) => {
          let { catlist } = el;
          return (
            catlist[1] === catNames[1] &&
            catlist[2] === catNames[2] &&
            catlist[3] === catNames[3]
          );
        });

        // SI OBETENGO AL CATEGORIA GUARDO EL PRODUCTO
        if (cat) {
          let categoriID = cat.idcat;

          let saveProdXML = `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <product>
              <id_manufacturer>${manuid}</id_manufacturer>
              <id_supplier></id_supplier>
              <id_category_default>${cf_1375}</id_category_default>
              <new>1></new>
              <id_default_combination></id_default_combination>
              <id_tax_rules_group></id_tax_rules_group>
              <type>standard</type>
              <id_shop_default>1</id_shop_default>
              <reference>${crmid}</reference>
              <supplier_reference></supplier_reference>
              <ean13>${cf_1372}</ean13>
              <state>1</state>
              <product_type></product_type>
              <price>${unit_price}</price>
              <unit_price>${unit_price}</unit_price>
              <active>1</active>
              <meta_description>
                <language id="2"><![CDATA[${metaDescription}]]></language>
              </meta_description>
              <meta_keywords>
                <language id="2"></language>
              </meta_keywords>
              <meta_title>
                <language id="2"><![CDATA[${title}]]></language>
              </meta_title>
              <link_rewrite>
                <language id="2"></language>
              </link_rewrite>
              <name>
                <language id="2"><![CDATA[${productname}]]></language>
              </name>
              <description>
                <language id="2"><![CDATA[${description}]]></language>
              </description>
              <description_short>
                <language id="2"><![CDATA[${description}]]></language>
              </description_short>
              <associations>
                <categories>
                  <category>
                    <id>${categoriID}</id>
                  </category>
                </categories>
                <product_features>
                ${featureXML}
              </product_features>
              </associations>
              <weight>${weight}</weight>
            </product>
          </prestashop>`;

          console.log(saveProdXML);
        }
      }
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}

console.log(await saveProducts());
