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
    for (let i = 11948; i < 15000; i++) {
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
        fotosid
      } = product;

      //OBTENGO EL ID DEL PROVEEDOR
      let manuid = await getManufacturerID(cf_1374);
      manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

      //LISTA DE LAS FEATURES DEL PRODUCTO
      let prodFeat = destructureFeat(cf_1394);

      let featureXML = "";
      //ARMO EL XML DE LAS FEATURES CON SUS VALORES
      if (prodFeat) {
        // RECORRO LAS FEATURES DEL PRODUCTO
        for (let feat of prodFeat) {
          let { k, v } = feat

          //BUSCO EN LA TABLA DE FEATURES EL ID DE LA FEATURE Y EL ID DEL VALOR
          let featureSQL = featuresTable.find((el) => el.name === k);
          if (featureSQL) {
            let { id: idFeat, values } = featureSQL;

            //BUSCO EL ID DE LOS VALUES
            let featureValSQL = values.find((el) => el.value === v);
            if (!featureValSQL)
              featureValSQL = values.find((el) => el.value.includes(v));
            if (featureValSQL) {
              let { id: idvalue } = featureValSQL;

              // UNA VEZ OBTENIDOS LOS 2 IDS ARMO EL XML DE LAS FEATURES
              featureXML =
                featureXML +
                `<product_feature>
                      <id><![CDATA[${idFeat}]]></id>
                      <id_feature_value><![CDATA[${idvalue}]]></id_feature_value>
                </product_feature>`;
            }

          }

        }
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

      //SI PERTENECE A FUNDAS BUSCO SOLO LA PRIMERA
      if (!cat && catNames[0] == "FUNDAS") {
        cat = catTableSQL.find((el) => {
          let { catlist } = el;
          return (
            catlist[0] == "FUNDAS"
          );
        });
      }

      //CHECK IF PRODUCT IS ALREADY SAVED
      let alreadyDB = savedProducts.find((el) => crmid === el.reference);

      if (cat && !alreadyDB) {
        // SI OBETENGO AL CATEGORIA GUARDO EL PRODUCTO
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
              <id_category_default><![CDATA[${categoriID}]]></id_category_default>
              <new>1></new>
              <id_default_combination></id_default_combination>
              <id_tax_rules_group></id_tax_rules_group>
              <type>standard</type>
              <id_shop_default>1</id_shop_default>
              <reference><![CDATA[${crmid}]]></reference>
              <supplier_reference></supplier_reference>
              <ean13><![CDATA[${cf_1372}]]></ean13>
              <state>1</state>
              <product_type><![CDATA[standard]]></product_type>
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
            Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
          },
          body: saveProdXML,
        });

        if (result.status < 200 || result.status > 299) {
          console.log("Ultimo id " + i + " product id: " + crmid);
          console.log("Razon " + (await result.text()));
          return;
        }

        //--------------------------------------STOCK--------------------------------------
        // SI EL GUARDADO FUE BIEN ACTUALIZO STOCK
        //OBTENGO EL ID DEL PRODUCTO NUEVO
        let idprodNew = await getProductID(crmid);
        //ID DEL STOCK
        let idProdStock = await getStockProductID(idprodNew);
        if (idProdStock) {
          //GUARDADO DE STOCK
          let responseStock = await saveStockComplete(
            idProdStock,
            +qtyinstock,
            idprodNew
          );

          if (!responseStock.ok)
            console.error("Producto: ", idprodNew, crmid, "stock no actualizado");
        }

        //--------------------------------------IMAGENES--------------------------------------
        if (!fotosid) {
          await saveImages(crmid, idprodNew, false);
        }

        if (fotosid) {
          let fotolist = fotosid.split(",");
          for (let el of fotolist) {
            await saveImages(el, idprodNew, true);
          }
        }
        console.log(i + " " + crmid);
      }

      if (alreadyDB) console.log("YA ESTA EB BD", crmid, i)
      if (!cat && !alreadyDB) console.log("No category", catNames, crmid, i)
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}

await saveProducts();

//GUARDADO COMPLETO DE STOCK
async function saveStockComplete(idstock, qty, idprod) {
  let result = await fetch(
    `https://libreria-test.net/api/stock_availables/${idstock}`,
    {
      method: "PATCH",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
                <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
                <stock_available>
                    <id><![CDATA[${idstock}]]></id>
                    <quantity><![CDATA[${qty}]]></quantity>
                    <id_product><![CDATA[${idprod}]]></id_product>
                    <depends_on_stock><![CDATA[0]]></depends_on_stock>
                    <out_of_stock><![CDATA[0]]></out_of_stock>
                    <id_shop><![CDATA[1]]></id_shop>
                    <id_product_attribute><![CDATA[0]]></id_product_attribute>
                </stock_available>
            </prestashop>`,
    }
  );
  return result;
}

//ID DE UN PRODUCTO EN ESPECIFICO
async function getProductID(ref) {
  let result = await fetch(
    `https://libreria-test.net/api/products?display=[id,reference]&filter[reference]=${ref}&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await result.json();

  let { products } = data;
  let { id } = products[0];

  return id;
}

//ID DEL STOCK DE UN PRODUCTO EN ESPECIFICO
async function getStockProductID(idprod) {
  let result = await fetch(
    `https://libreria-test.net/api/stock_availables?display=[id]&filter[id_product]=${idprod}&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await result.json();

  let { stock_availables } = data;
  if (!stock_availables) return undefined
  let { id } = stock_availables[0];

  return id;
}

//GUARDADO DE IMAGENES
async function saveImages(reference, idProd, isFotoid = false) {
  let url = "";

  if (!isFotoid) {
    url = `https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`;
  }
  if (isFotoid) {
    url = `https://dydsoft.com/imagina/portal/mostrar_foto.php?id=${reference}`;
  }

  let result = await fetch(url);
  let blob = await result.blob();
  blob.name = reference + ".jpeg";
  blob.lastModified = new Date();

  const imgfile = new File([blob], reference + ".jpeg", {
    type: blob.type,
  });
  const formData = new FormData();
  formData.append("image", imgfile);
  //console.log("data", data);

  //la unica manera que funciono de conseguir el puto size
  const response = new Response(formData);
  let blb = await response.blob();
  let size = blb.size;

  fetch(`https://libreria-test.net/api/images/products/${idProd}`, {
    method: "POST",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      "Content-Length": size,
    },
    body: formData,
  })
    .then((res) => {
      console.log("saveImages", idProd, res.status);
      //res.text().then((tx) => console.log(tx));
      return res;
    })
    .catch((err) => console.log("saveImages", idProd, err));
}

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
