import md5 from "./md5.js";
import fs from "node:fs/promises";

const getData = async () => {
  try {
    let response = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=getchallenge&username=integracion",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error en la api");
    }

    let res = await response.json();
    if (!res.success) {
      throw new Error("Error en la api");
    }

    let { result } = res;
    console.log("data", res);
    let cript = md5(result.token + "fUn6nRDdKksNaFmF");
    console.log("crypt", cript);

    let response2 = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=login&username=integracion&accessKey=" +
        cript,
      {
        method: "GET",
      }
    );

    if (!response2.ok) {
      throw new Error("Error en la api");
    }

    let res2 = await response2.json();
    if (!res2.success) {
      throw new Error("Error en la api");
    }

    let result2 = res2.result;
    console.log("No hay plata", result2);

    let response3 = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=query&elementType=Products&busqueda0=%&campo0=crmid&sessionName=" +
        result2.sessionName,
      {
        method: "GET",
      }
    );

    if (!response3.ok) {
      throw new Error("Error en la api");
    }

    let res3 = await response3.json();

    if (!res3.success) {
      throw new Error("Error en la api");
    }

    let result3 = res3.result;

    let category = new Set();
    let supp = new Set();
    let feat = new Set();

    /*for (let product of result3) {
      let {
        cf_1375,
        cf_1374,
        cf_1394,
        id_manufacurer,
        cf_1372,
        productcode,
        unit_price,
        description,
        productname,
        cf_1376,
        weight,
      } = product;

      //category.add(cf_1375);
      //supp.add(cf_1374);
      //feat.add(cf_1394);
    }*/

    //let feturesObj = getFeatureList(feat);
    let errorList = [];

    for (let i = 0; i < 100; i++) {
      let product = result3[i];
      if (!product) return;

      let manuid = await getManufID(product.cf_1374);

      manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

      try {
        if (product.productid !== 364) return;
        let res = await saveProduct({ ...product, manuid });
        if (!res.ok) {
          console.log("Ultimo id " + i);
          console.log("Razon " + (await res.text()));
          return;
        }

        let { productid, qtyinstock } = product;
        let prodId = await getProdid(productid);
        let stockID = await getStockId(prodId);

        let restk = await saveStock(stockID, qtyinstock);

        console.log(
          i + " " + restk.status + " " + ((i - 1097) * 100) / 9000 + "%"
        );

        if (restk.status < 200 || restk.status > 299) {
          console.log("Ultimo id " + i + "product id: " + productid);
          onsole.log("Razon " + (await restk.text()));
          errorList.push(i + " " + manuid + " ");
          return;
        }
        //FALTA SACAR LOS IDS DE MANUFACTUR,CATEGORIA Y DEMACES
        //console.log(res.status);
        //console.log(await res.text());
        //console.log("-----------------------------");
      } catch (err) {
        console.error(err);
        console.log("Ultimo id " + i);
        return;
      }
    }
    for (let index of errorList) {
      console.log(index);
      try {
        await fs.writeFile(
          "archivo.txt",
          String(index),
          { flag: "a" },
          (err) => {
            if (err) throw err;
          }
        );
      } catch (err) {
        console.log("error al crear archivo", err);
      }
    }
    //console.log("features", feat);
    //console.log("category", category);
    //console.log("supp", supp);

    //console.log("INICIO DE GUARDADO EN DB");
    //GUARDADO DE SUPPL
    /*
    try {
    for (let sup of supp) {
      await saveManuf(sup);
    } catch (err) {
      console.error(err)

    }
    console.log("Supplier creation complete");
    */

    /*try {
      //GUARDADO DE FEATURES
      console.log("INICIO DE GUARDADO DE FEATURES");
      let feturesObj = getFeatureList(feat);

      let keys = Object.keys(feturesObj);
      for (let k of keys) {
        await saveFeatureKey(k);
      }

      let featureList = await getFeatureIds();
      console.log("INICIO DE GUARDADO DE FEATURES VALUES");
      for (let k of keys) {
        let feature = featureList.find((el) => el.name === k);

        if (feature) {
          let valueList = feturesObj[k];

          for (let val of valueList) {
            let result = await saveFeaturevalue(feature.id, val);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }*/
  } catch (err) {
    console.error("Error: ", err);
  }
};

getData();

async function saveManuf(value) {
  if (value.includes("-")) return;

  let result = await fetch("https://libreria-test.net/api/manufacturers", {
    method: "POST",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <manufacturer>
                <name>${value}</name>
                <active>1</active>
            </manufacturer>
            </prestashop>`,
  });

  if (!result.ok)
    throw new Error("Error in category creations, status: ", result.status);
}

async function saveCategory(value) {
  //if (value.includes("-")) return;
  let result = await fetch("https://libreria-test.net/api/categories", {
    method: "POST",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
                <category>
                    <name>
                        <language id="1">1</language>
                    </name>
                    <link_rewrite>
                        <language id="1">1</language>
                    </link_rewrite>
                    <description>
                        <language id="1">${value}</language>
                    </description>
                    <active>1</active>
                    <id_parent>1</id_parent> //acá el parent id es 2 (la categoría raíz)
                </category>
            </prestashop>`,
  });
  if (!result.ok)
    throw new Error("Error in category creations, status: ", result.status);
}

function getFeatureList(features) {
  let result = {};

  for (let feat of features) {
    if (!feat.includes("--") && feat !== "") {
      let flist = feat.split("|##|");

      flist.forEach((el) => {
        let f = el.split(":");
        let k = f[0].trim();
        let v = f[1].trim();

        if (!(result[k] instanceof Array)) result[k] = new Array();

        result[k].push(v);
      });
    }
  }

  return result;
}

async function saveFeatureKey(value) {
  let result = await fetch("https://libreria-test.net/api/product_features", {
    method: "POST",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>
          <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
          <product_feature>
              <name>
                <language id="2">${value}</language>
              </name>
            </product_feature>
          </prestashop>`,
  });
  if (!result.ok)
    throw new Error("Error in category creations, status: ", result.status);
}

//LISTA DE FEATURES CON ID Y NOMBRE
async function getFeatureIds() {
  let result = [];
  let featids = await fetch(
    "https://libreria-test.net/api/product_features?output_format=JSON",
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await featids.json();
  let { product_features } = data;

  for (let idfeat of product_features) {
    let response = await fetch(
      `https://libreria-test.net/api/product_features/${idfeat.id}?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );
    data = await response.json();

    let { id, name } = data.product_feature;
    result.push({ id, name });
  }

  return result;
}

async function saveFeaturevalue(idfeature, value) {
  let result = await fetch(
    "https://libreria-test.net/api/product_feature_values",
    {
      method: "POST",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
              <product_feature_value>
                <id_feature>${idfeature}</id_feature>
                <value>
                  <language id="2">${value}</language>
                </value>
              </product_feature_value>
            </prestashop>`,
    }
  );
  if (!result.ok) {
    throw new Error(
      "Error in Feature value creations, status: ",
      result.status
    );
  }
  return result;
}

async function saveProduct(product) {
  let {
    cf_1375,
    manuid,
    cf_1372,
    unit_price,
    description,
    productname,
    cf_1384,
    weight,
    productid,
  } = product;

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

  //console.log("product", product)

  let result = await fetch("https://libreria-test.net/api/products", {
    method: "POST",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>
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
              <reference>${productid}</reference>
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
                    <id>${cf_1375}</id>
                  </category>
                </categories>
              </associations>
              <weight>${weight}</weight>
            </product>
          </prestashop>`,
  });

  return result;
}

// GET EL ID DEL MANUFACTURER A PARTIR DEL NAME
async function getManufID(name) {
  //NAME QUE TIENE & Y DESTRUYEN LOS QUERY PARAM
  if (name.includes("CONCEPTS &")) return 14;
  if (name.includes("KATE &")) return 109;
  if (name.includes("--")) return "";

  let result = await fetch(
    `https://libreria-test.net/api/manufacturers?filter[name]=${name}&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );
  let data = await result.json();
  let { manufacturers } = data;
  if (!manufacturers) return 0;
  let { id } = manufacturers[0];

  return id;
}

//OBETENER EL ID DEL PRODUCTO EN BASE A LA REFERENCIA
async function getProdid(reference) {
  let result = await fetch(
    `https://libreria-test.net/api/products?filter[reference]=${reference}&display=[id]&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );
  if (!result.ok) {
    throw new Error("Error in Get product id, status: ", result.status);
  }

  let res = await result.json();

  let { products } = res;

  if (!products) return undefined;

  let { id } = products[0];

  return id;
}

//OBTENER EL ID DE LA TABLA DE STOCK PARA DEPUES GRABAR EL STOCK...
async function getStockId(prodid) {
  let result = await fetch(
    `https://libreria-test.net/api/stock_availables?filter[id_product]=${prodid}&display=[id]&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );
  if (!result.ok) {
    throw new Error("Error in Stock ID, status: ", result.status);
  }

  let res = await result.json();

  let { stock_availables } = res;

  if (!stock_availables) return undefined;

  let { id } = stock_availables[0];

  return id;
}

async function saveStock(prodid, qty) {
  if (!prodid) return 201;
  if (!qty) return 201;
  let result = await fetch(
    `https://libreria-test.net/api/stock_availables/${prodid}`,
    {
      method: "PATCH",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
      body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <stock_available>
              <id>${prodid}</id>
              <quantity>${qty}</quantity>
            </stock_available>
            </prestashop>`,
    }
  );
  if (!result.ok) {
    throw new Error("Error in stock creations, status: ", result.status);
  }
  return result;
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
