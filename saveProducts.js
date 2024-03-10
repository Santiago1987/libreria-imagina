import { getBigJson } from "./getBigJson.js";
import getCategories from "./Category/getCategories.js";
import getManufacturerID from "./Manufacturer/getManufacturerID.js";
import makeFeatureTable from "./Features/makeFeatureTable.js";
import destructureFeat from "./Features/destructureFeat.js";
import savedProductList from "./savedProductList.js";

async function saveProducts() {
  try {
    // JSON GIGANTE CON TODOS LOS ARTICULOS
    const bigjson = await getBigJson();

    // CATEGORIES CON ID DE SQL
    const catTableSQL = await getCategories();

    // TABLA CON TODAS LAS FEATURES Y SUS IDS
    const featuresTable = await makeFeatureTable();

    //PRODUCTOS QUE YA FUERON GUARDADOS
    const savedProducts = await savedProductList();
    console.log("EMPIEZA EL LOOP");
    for (let i = 12103; i < 13000; i++) {
      let product = bigjson[i];
      if (!product) return;
      console.log(i);
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
          let featureSQL = featuresTable.find((el) => el.name === featName);

          if (!featureSQL)
            throw new Error("Ningun Feature name coincidio ptm: " + i);

          let { id: idFeat, values } = featureSQL;

          //BUSCO EL ID DE LOS VALUES
          let featureValSQL = values.find((el) => el.value === featval);
          if (!featureValSQL) {
            //console.log(featureSQL, featval);
            throw new Error("Ningun Feature value name coincidio ptm: " + i);
          }
          let { id: idvalue } = featureValSQL;

          // UNA VEZ OBTENIDOS LOS 2 IDS ARMO EL XML DE LAS FEATURES
          featureXML =
            featureXML +
            `<product_feature>
              <id><![CDATA[${idFeat}]]></id>
              <id_feature_value><![CDATA[${idvalue}]]></id_feature_value>
              </product_feature>`;
        }
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
            catlist[0] == catNames[0] &&
            catlist[1] == catNames[1] &&
            catlist[2] == catNames[2]
          );
        });

        //CHECK IF PRODUCT IS ALREADY SAVED
        let alreadyDB = savedProducts.find((el) => crmid === el.reference);

        // SI OBETENGO AL CATEGORIA GUARDO EL PRODUCTO
        if (cat && !alreadyDB) {
          let categoriID = cat.idcat;

          //ACOMODO DE LOS DATOS

          productname = htmlEntities(productname).replaceAll(";", "");
          description = htmlEntities(description)
            .replaceAll(";", "")
            .replaceAll("<", "'")
            .replaceAll(">", "'");

          cf_1375 = 2; //ESTAN MAL LAS CATEGORIAS

          if (!Number(cf_1372)) cf_1372 = ""; // EAN QUE SON PALABRAS
          if (!Number(weight)) weight = "";

          let title = productname //acá y en description en vez de reemplazar los caracteres podés aplicar la función decodeHtml(param)
            ? productname
              .toLowerCase()
              .split(" ")
              .map((el) => {
                if (!el[0]) return el;
                return el[0].toUpperCase() + el.slice(1);
              })
              .toString()
              .replaceAll(",", " ")
            : "";

          let metaDescription = description.slice(0, 500);
          cf_1372 = cf_1372.length > 13 ? "" : cf_1372;

          let saveProdXML = `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <product>
              <id_manufacturer><![CDATA[${manuid}]]></id_manufacturer>
              <id_supplier></id_supplier>
              <id_category_default><![CDATA[${cf_1375}]]></id_category_default>
              <new>1></new>
              <id_default_combination></id_default_combination>
              <id_tax_rules_group></id_tax_rules_group>
              <type>standard</type>
              <id_shop_default>1</id_shop_default>
              <reference><![CDATA[${crmid}]]></reference>
              <supplier_reference></supplier_reference>
              <ean13><![CDATA[${cf_1372}]]></ean13>
              <state>1</state>
              <product_type></product_type>
              <price><![CDATA[${unit_price}]]></price>
              <unit_price><![CDATA[${unit_price}]]></unit_price>
              <active>1</active>
              <available_for_order>1</available_for_order>
              <show_price>1</show_price>
              <minimal_quantity>1</minimal_quantity>
              <unity><![CDATA[Por unidad]]></unity>
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
                    <id><![CDATA[${categoriID}]]></id>
                  </category>
                </categories>
                <product_features>
                  ${featureXML}
                </product_features>
              </associations>
              <weight><![CDATA[${weight}]]></weight>
            </product>
          </prestashop>`;

          let result = await fetch("https://libreria-test.net/api/products", {
            method: "POST",
            headers: {
              Authorization:
                "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
            },
            body: saveProdXML,
          });

          console.log(i + " " + crmid + " " + result.status);
          if (result.status < 200 || result.status > 299) {
            console.log("Ultimo id " + i + " product id: " + crmid);
            console.log("Razon " + (await result.text()));
            return;
          }
        }
      }
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}

await saveProducts();

function htmlEntities(str) {
  return String(str)
    .replaceAll("&ntilde;", "ñ")
    .replaceAll("&Ntilde;", "Ñ")
    .replaceAll("&amp;", "&")
    .replaceAll("&Ntilde;", "Ñ")
    .replaceAll("&ntilde;", "ñ")
    .replaceAll("&Ntilde;", "Ñ")
    .replaceAll("&Agrave;", "À")
    .replaceAll("&Aacute;", "Á")
    .replaceAll("&Acirc;", "Â")
    .replaceAll("&Atilde;", "Ã")
    .replaceAll("&Auml;", "Ä")
    .replaceAll("&Aring;", "Å")
    .replaceAll("&AElig;", "Æ")
    .replaceAll("&Ccedil;", "Ç")
    .replaceAll("&Egrave;", "È")
    .replaceAll("&Eacute;", "É")
    .replaceAll("&Ecirc;", "Ê")
    .replaceAll("&Euml;", "Ë")
    .replaceAll("&Igrave;", "Ì")
    .replaceAll("&Iacute;", "Í")
    .replaceAll("&Icirc;", "Î")
    .replaceAll("&Iuml;", "Ï")
    .replaceAll("&ETH;", "Ð")
    .replaceAll("&Ntilde;", "Ñ")
    .replaceAll("&Ograve;", "Ò")
    .replaceAll("&Oacute;", "Ó")
    .replaceAll("&Ocirc;", "Ô")
    .replaceAll("&Otilde;", "Õ")
    .replaceAll("&Ouml;", "Ö")
    .replaceAll("&Oslash;", "Ø")
    .replaceAll("&Ugrave;", "Ù")
    .replaceAll("&Uacute;", "Ú")
    .replaceAll("&Ucirc;", "Û")
    .replaceAll("&Uuml;", "Ü")
    .replaceAll("&Yacute;", "Ý")
    .replaceAll("&THORN;", "Þ")
    .replaceAll("&szlig;", "ß")
    .replaceAll("&agrave;", "à")
    .replaceAll("&aacute;", "á")
    .replaceAll("&acirc;", "â")
    .replaceAll("&atilde;", "ã")
    .replaceAll("&auml;", "ä")
    .replaceAll("&aring;", "å")
    .replaceAll("&aelig;", "æ")
    .replaceAll("&ccedil;", "ç")
    .replaceAll("&egrave;", "è")
    .replaceAll("&eacute;", "é")
    .replaceAll("&ecirc;", "ê")
    .replaceAll("&euml;", "ë")
    .replaceAll("&igrave;", "ì")
    .replaceAll("&iacute;", "í")
    .replaceAll("&icirc;", "î")
    .replaceAll("&iuml;", "ï")
    .replaceAll("&eth;", "ð")
    .replaceAll("&ntilde;", "ñ")
    .replaceAll("&ograve;", "ò")
    .replaceAll("&oacute;", "ó")
    .replaceAll("&ocirc;", "ô")
    .replaceAll("&otilde;", "õ")
    .replaceAll("&ouml;", "ö")
    .replaceAll("&oslash;", "ø")
    .replaceAll("&ugrave;", "ù")
    .replaceAll("&uacute;", "ú")
    .replaceAll("&ucirc;", "û")
    .replaceAll("&uuml;", "ü")
    .replaceAll("&yacute;", "ý")
    .replaceAll("&thorn;", "þ")
    .replaceAll("&yuml;", "ÿ")
    .replaceAll("&iexcl;", "¡")
    .replaceAll("&quot;", '"')
    .replaceAll("&ordm;", "º")
    .replaceAll("&Ordm;", "º")
    .replaceAll("=", " igual ")
    .replaceAll("}", "")
    .replaceAll("#", "");
}
