try {
  // LISTA DE PRODUCTS YA GUARDADOS [{id, reference}]
  let savedProducts = await savedProductList();

  //ISTA DE PRODUCTS PARA UPDATE
  let updProductList = await productsUPD();

  //LISTA DE LOS STOCK GUARDADOS CON LOS IDS
  let stocktable = await getStockIdTable();

  //LISTA DE CATEGORIAS
  const catTableSQL = await getCategories();

  // TABLA CON TODAS LAS FEATURES Y SUS IDS
  const featuresTable = await makeFeatureTable();

  //RECORRO LOS PRODUCTOS PARA UPDATE
  for (let prod of updProductList) {
    let { crmid } = prod;
    let isSave = savedProducts.find((el) => el.reference === crmid);

    //SI EL PRODUCTO YA EXISTE SE ACTUALIZA STOCK
    if (isSave) {
      let { id, reference } = isSave;
      let { qtyinstock } = prod;
      let stock = stocktable.find((el) => el.id_product === id);

      if (stock) {
        let { id: idstock } = stock;
        let response = await updStock(idstock, +qtyinstock);
        console.log(
          "Product: " +
          id +
          " status: " +
          response.status +
          " qty: " +
          qtyinstock +
          " reference: " +
          reference
        );
      }
    }
    //SI EL PRODUCTO NO EXISTE SE INTENTA GUARDAR
    if (!isSave) {
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
      } = prod;

      //OBTENGO EL ID DEL PROVEEDOR
      let manuid = await getManufacturerID(cf_1374);
      manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

      //LISTA DE LAS FEATURES DEL PRODUCTO
      let prodFeat = destructureFeat(cf_1394);

      let featureXML = "";
      //ARMO EL XML DE LAS FEATURES CON SUS VALORES
      if (prodFeat) {
        // RECORRO LAS FEATURES DEL PRODUCTO
        for (let featName of Object.keys(prodFeat)) {
          let featval = prodFeat[featName];

          //BUSCO EN LA TABLA DE FEATURES EL ID DE LA FEATURE Y EL ID DEL VALOR
          let featureSQL = featuresTable.find((el) => el.name === featName);

          if (featureSQL) {
            let { id: idFeat, values } = featureSQL;

            //BUSCO EL ID DE LOS VALUES
            let featureValSQL = values.find((el) => el.value === featval);
            if (!featureValSQL)
              featureValSQL = values.find((el) => el.value.includes(featval));

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

      if (cat) {
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

        console.log(crmid + " " + result.status);
        if (result.status < 200 || result.status > 299) {
          console.log("product id: " + crmid);
          console.log("Razon " + (await result.text()));

        }

        if (result.ok) {

          let response = await fetch(
            `https://libreria-test.net/api/products/?display=[id]&filter[reference]=${crmid}&output_format=JSON`,
            {
              method: "GET",
              headers: {
                Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
              },
            }
          );

          let data = await response.json()
          let { products } = data
          let { id: idNewProd } = products[0]

          if (idNewProd) {
            let responseIDS = await fetch(
              `https://libreria-test.net/api/stock_availables/?display=[id]&filter[id_product]=${idNewProd}&output_format=JSON`,
              {
                method: "GET",
                headers: {
                  Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
                },
              }
            );
            data = await responseIDS.json()
            let { stock_availables } = data
            let { id: idStock } = stock_availables[0]

            if (idStock) {
              let responseSaveSto = await saveStockComplete(idStock, +qtyinstock, idNewProd);
              console.log("Guardado de stock nuevo: ", idNewProd, responseSaveSto.status)
            }
          }

        }

      }
    }

  }


} catch (err) {
  console.log("Error: ", err);
}

//--------------------------------------------------------------------
// LISTA DE PRODUCTOS YA GUARDADOS
async function savedProductList() {
  let productsIDList = await fetch(
    `https://libreria-test.net/api/products/?display=[id,reference]&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await productsIDList.json();
  let { products } = data;

  return products;
}

async function productsUPD() {
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
  let { result } = res;
  let cript = md5(result.token + "fUn6nRDdKksNaFmF");

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
  let result2 = res2.result;

  let date = new Date();
  let dateformat = date.toJSON();
  let response3 = await fetch(
    `https://dydsoft.com/imagina/webservice.php?operation=query&elementType=Products&busqueda0=${dateformat}&campo0=modifiedtime&sessionName=` +
    result2.sessionName,
    {
      method: "GET",
    }
  );

  if (!response3.ok) {
    throw new Error("Error en la api");
  }

  let res3 = await response3.json();
  let result3 = res3.result;

  return result3;
}

async function updStock(idstock, qty) {
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
              </stock_available>
              </prestashop>`,
    }
  );

  return result;
}

// STOCK ID TABLE
async function getStockIdTable() {
  let result = await fetch(
    `https://libreria-test.net/api/stock_availables?display=[id,id_product]&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await result.json();

  let { stock_availables } = data;

  return stock_availables;
}

//LISTA DE CATEGORIAS DE LA BD SQL
async function getCategories() {
  let categoriList = [];
  let result = [];
  try {
    let response = await fetch(
      `https://libreria-test.net/api/categories/?display=[id,name,id_parent,level_depth]&output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );

    let data = await response.json();
    let { categories } = data;

    for (let el of categories) {
      let { id: idcat, name, id_parent, level_depth } = el;

      categoriList.push({ id: idcat, name, id_parent, level_depth });
    }

    for (let cat of categoriList) {
      let { id, name, id_parent, level_depth } = cat;

      if (name === "Fundas") {
        result.push({
          idcat: id,
          catlist: [name.toUpperCase(), name.toUpperCase()],
        });
      }

      if (level_depth === 3) {
        // level dos
        let twocat = categoriList.find((el) => el.id === id_parent);
        let { name: twonam } = twocat;

        name = name.toUpperCase();
        twonam = twonam.toUpperCase();

        result.push({
          idcat: id,
          catlist: [twonam, name],
        });
      }

      //level 3
      if (level_depth === 4) {
        // level tres
        let threecat = categoriList.find((el) => el.id === id_parent);
        let { id_parent: idthree, name: threenam } = threecat;

        // level dos
        let twocat = categoriList.find((el) => el.id === idthree);
        let { name: twonam } = twocat;

        name = name.toUpperCase();
        threenam = threenam.toUpperCase();
        twonam = twonam.toUpperCase();

        let catlist = [twonam, threenam, name];

        result.push({
          idcat: id,
          catlist,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  return result;
}

//LISTA DE FEATURES
async function makeFeatureTable() {
  let result = [];

  // BUSCO TODAS LAS FEATURES
  let featids = await fetch(
    "https://libreria-test.net/api/product_features/?display=[id,name]&output_format=JSON",
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await featids.json();

  result = [...data.product_features];
  for (let i in result) {
    result[i] = { ...result[i], values: [] };
  }

  // BUSCO TODOS LOS VALORES POSIBLES DE LAS FEATURES
  let featValID = await fetch(
    `https://libreria-test.net/api/product_feature_values/?display=[id,id_feature,value]&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  data = await featValID.json();
  let { product_feature_values } = data;

  // RECORRO CADA VALOR DE FEATURE COMPARANDO EL ID DEL PADRE CON EL QUE TENGO EN RESULT
  for (let feat_val of product_feature_values) {
    let { id, id_feature, value } = feat_val;

    // BUSCO EL INDICE DEL PADRE EN RESULT
    let featIndx = result.findIndex((el) => el.id === id_feature);

    let { values } = result[featIndx];
    values.push({ id, value });

    result[featIndx] = { ...result[featIndx], values };

    //result = [
    //...result.slice(0, featIndx - 1),
    //{ id: id_feature, name, values },
    //...result.slice(featIndx + 1, result.length),
    //];
  }

  return result;
}

async function getManufacturerID(name) {
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

function destructureFeat(feat) {
  if (!feat) return;
  let result = {};

  if (!feat.includes("--") && feat !== "") {
    let flist = feat.split("|##|");

    for (let feat of flist) {
      let f = feat.split(":");
      if (!f[1]) break;
      let k = f[0].trim();
      let v = f[1].trim();

      //if (!(result[k] instanceof Array)) result[k] = new Array();
      //result.push({ k, v });
      result[k] = v;
    }
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

function md5(e) {
  function h(a, b) {
    var c, d, e, f, g;
    e = a & 2147483648;
    f = b & 2147483648;
    c = a & 1073741824;
    d = b & 1073741824;
    g = (a & 1073741823) + (b & 1073741823);
    return c & d
      ? g ^ 2147483648 ^ e ^ f
      : c | d
        ? g & 1073741824
          ? g ^ 3221225472 ^ e ^ f
          : g ^ 1073741824 ^ e ^ f
        : g ^ e ^ f;
  }

  function k(a, b, c, d, e, f, g) {
    a = h(a, h(h((b & c) | (~b & d), e), g));
    return h((a << f) | (a >>> (32 - f)), b);
  }

  function l(a, b, c, d, e, f, g) {
    a = h(a, h(h((b & d) | (c & ~d), e), g));
    return h((a << f) | (a >>> (32 - f)), b);
  }

  function m(a, b, d, c, e, f, g) {
    a = h(a, h(h(b ^ d ^ c, e), g));
    return h((a << f) | (a >>> (32 - f)), b);
  }

  function n(a, b, d, c, e, f, g) {
    a = h(a, h(h(d ^ (b | ~c), e), g));
    return h((a << f) | (a >>> (32 - f)), b);
  }

  function p(a) {
    var b = "",
      d = "",
      c;
    for (c = 0; 3 >= c; c++)
      (d = (a >>> (8 * c)) & 255),
        (d = "0" + d.toString(16)),
        (b += d.substr(d.length - 2, 2));
    return b;
  }
  var f = [],
    q,
    r,
    s,
    t,
    a,
    b,
    c,
    d;
  e = (function (a) {
    a = a.replace(/\r\n/g, "\n");
    for (var b = "", d = 0; d < a.length; d++) {
      var c = a.charCodeAt(d);
      128 > c
        ? (b += String.fromCharCode(c))
        : (127 < c && 2048 > c
          ? (b += String.fromCharCode((c >> 6) | 192))
          : ((b += String.fromCharCode((c >> 12) | 224)),
            (b += String.fromCharCode(((c >> 6) & 63) | 128))),
          (b += String.fromCharCode((c & 63) | 128)));
    }
    return b;
  })(e);
  f = (function (b) {
    var a,
      c = b.length;
    a = c + 8;
    for (
      var d = 16 * ((a - (a % 64)) / 64 + 1), e = Array(d - 1), f = 0, g = 0;
      g < c;

    )
      (a = (g - (g % 4)) / 4),
        (f = (g % 4) * 8),
        (e[a] |= b.charCodeAt(g) << f),
        g++;
    a = (g - (g % 4)) / 4;
    e[a] |= 128 << ((g % 4) * 8);
    e[d - 2] = c << 3;
    e[d - 1] = c >>> 29;
    return e;
  })(e);
  a = 1732584193;
  b = 4023233417;
  c = 2562383102;
  d = 271733878;
  for (e = 0; e < f.length; e += 16)
    (q = a),
      (r = b),
      (s = c),
      (t = d),
      (a = k(a, b, c, d, f[e + 0], 7, 3614090360)),
      (d = k(d, a, b, c, f[e + 1], 12, 3905402710)),
      (c = k(c, d, a, b, f[e + 2], 17, 606105819)),
      (b = k(b, c, d, a, f[e + 3], 22, 3250441966)),
      (a = k(a, b, c, d, f[e + 4], 7, 4118548399)),
      (d = k(d, a, b, c, f[e + 5], 12, 1200080426)),
      (c = k(c, d, a, b, f[e + 6], 17, 2821735955)),
      (b = k(b, c, d, a, f[e + 7], 22, 4249261313)),
      (a = k(a, b, c, d, f[e + 8], 7, 1770035416)),
      (d = k(d, a, b, c, f[e + 9], 12, 2336552879)),
      (c = k(c, d, a, b, f[e + 10], 17, 4294925233)),
      (b = k(b, c, d, a, f[e + 11], 22, 2304563134)),
      (a = k(a, b, c, d, f[e + 12], 7, 1804603682)),
      (d = k(d, a, b, c, f[e + 13], 12, 4254626195)),
      (c = k(c, d, a, b, f[e + 14], 17, 2792965006)),
      (b = k(b, c, d, a, f[e + 15], 22, 1236535329)),
      (a = l(a, b, c, d, f[e + 1], 5, 4129170786)),
      (d = l(d, a, b, c, f[e + 6], 9, 3225465664)),
      (c = l(c, d, a, b, f[e + 11], 14, 643717713)),
      (b = l(b, c, d, a, f[e + 0], 20, 3921069994)),
      (a = l(a, b, c, d, f[e + 5], 5, 3593408605)),
      (d = l(d, a, b, c, f[e + 10], 9, 38016083)),
      (c = l(c, d, a, b, f[e + 15], 14, 3634488961)),
      (b = l(b, c, d, a, f[e + 4], 20, 3889429448)),
      (a = l(a, b, c, d, f[e + 9], 5, 568446438)),
      (d = l(d, a, b, c, f[e + 14], 9, 3275163606)),
      (c = l(c, d, a, b, f[e + 3], 14, 4107603335)),
      (b = l(b, c, d, a, f[e + 8], 20, 1163531501)),
      (a = l(a, b, c, d, f[e + 13], 5, 2850285829)),
      (d = l(d, a, b, c, f[e + 2], 9, 4243563512)),
      (c = l(c, d, a, b, f[e + 7], 14, 1735328473)),
      (b = l(b, c, d, a, f[e + 12], 20, 2368359562)),
      (a = m(a, b, c, d, f[e + 5], 4, 4294588738)),
      (d = m(d, a, b, c, f[e + 8], 11, 2272392833)),
      (c = m(c, d, a, b, f[e + 11], 16, 1839030562)),
      (b = m(b, c, d, a, f[e + 14], 23, 4259657740)),
      (a = m(a, b, c, d, f[e + 1], 4, 2763975236)),
      (d = m(d, a, b, c, f[e + 4], 11, 1272893353)),
      (c = m(c, d, a, b, f[e + 7], 16, 4139469664)),
      (b = m(b, c, d, a, f[e + 10], 23, 3200236656)),
      (a = m(a, b, c, d, f[e + 13], 4, 681279174)),
      (d = m(d, a, b, c, f[e + 0], 11, 3936430074)),
      (c = m(c, d, a, b, f[e + 3], 16, 3572445317)),
      (b = m(b, c, d, a, f[e + 6], 23, 76029189)),
      (a = m(a, b, c, d, f[e + 9], 4, 3654602809)),
      (d = m(d, a, b, c, f[e + 12], 11, 3873151461)),
      (c = m(c, d, a, b, f[e + 15], 16, 530742520)),
      (b = m(b, c, d, a, f[e + 2], 23, 3299628645)),
      (a = n(a, b, c, d, f[e + 0], 6, 4096336452)),
      (d = n(d, a, b, c, f[e + 7], 10, 1126891415)),
      (c = n(c, d, a, b, f[e + 14], 15, 2878612391)),
      (b = n(b, c, d, a, f[e + 5], 21, 4237533241)),
      (a = n(a, b, c, d, f[e + 12], 6, 1700485571)),
      (d = n(d, a, b, c, f[e + 3], 10, 2399980690)),
      (c = n(c, d, a, b, f[e + 10], 15, 4293915773)),
      (b = n(b, c, d, a, f[e + 1], 21, 2240044497)),
      (a = n(a, b, c, d, f[e + 8], 6, 1873313359)),
      (d = n(d, a, b, c, f[e + 15], 10, 4264355552)),
      (c = n(c, d, a, b, f[e + 6], 15, 2734768916)),
      (b = n(b, c, d, a, f[e + 13], 21, 1309151649)),
      (a = n(a, b, c, d, f[e + 4], 6, 4149444226)),
      (d = n(d, a, b, c, f[e + 11], 10, 3174756917)),
      (c = n(c, d, a, b, f[e + 2], 15, 718787259)),
      (b = n(b, c, d, a, f[e + 9], 21, 3951481745)),
      (a = h(a, q)),
      (b = h(b, r)),
      (c = h(c, s)),
      (d = h(d, t));
  return (p(a) + p(b) + p(c) + p(d)).toLowerCase();
}

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