/*import products from "./todos_los_productos.json" assert {
    type: 'json'
}

let {result} = products

let feat = new Set()

for(let product of result){
    let {cf_1394} =product
    feat.add(cf_1394)
}

console.log(feat)*/

/*async function getFeatureIds() {
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
let test = await getFeatureIds();
console.log(test);*/

/*fetch("https://libreria-test.net/api/categories", {
  method: "POST",
  headers: {
    Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
  },
  body: `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
<category>
    <name>
        <language id="1"><![CDATA[1]]></language>
    </name>
    <link_rewrite>
        <language id="1"><![CDATA[1]]></language>
    </link_rewrite>
    <description>
        <language id="1"><![CDATA[my awesome category description]]></language>
    </description>
    <active>1</active>
    <id_parent>1</id_parent>
</category>
</prestashop>`,
})
  .then((res) => console.log("res", res.statusText))
  .catch((err) => console.error("error", err));*/

/*
//CREADO DE PRODUCTOS  
let id_manufacurer = 1;
let cf_1375 = 1;
let cf_1372 = 9789874927736;
let productcode = "h0000013250";
let unit_price = 1;
let description = "SRATEST3";
let productname = "SRATEST NAME3";
let cf_1376 = "descripcion corta";
let weight = 123;

let result = await fetch("https://libreria-test.net/api/products", {
  method: "POST",
  headers: {
    Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
  },
  body: `<?xml version="1.0" encoding="UTF-8"?>
            <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
            <product>
              <id_manufacturer>${id_manufacurer}</id_manufacturer>
              <id_supplier></id_supplier>
              <id_category_default>${cf_1375}</id_category_default>
              <new>1></new>
              <id_default_combination></id_default_combination>
              <id_tax_rules_group></id_tax_rules_group>
              <type>standard</type>
              <id_shop_default>1</id_shop_default>
              <reference>${productcode}</reference>
              <supplier_reference></supplier_reference>
              <ean13>${cf_1372}</ean13>
              <state>1</state>
              <product_type></product_type>
              <price>${unit_price}</price>
              <unit_price>${unit_price}</unit_price>
              <active>1</active>
              <meta_description>
                <language id="2">${description}</language>
              </meta_description>
              <meta_keywords>
                <language id="2"></language>
              </meta_keywords>
              <meta_title>
                <language id="2">${productname}</language>
              </meta_title>
              <link_rewrite>
                <language id="2"></language>
              </link_rewrite>
              <name>
                <language id="2">${productname}</language>
              </name>
              <description>
                <language id="2">${description}</language>
              </description>
              <description_short>
                <language id="2">${cf_1376}</language>
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

console.log(result.status);
console.log(await result.text());*/

/*async function getCategoryId() {
  let result = [];
  let featids = await fetch(
    "https://libreria-test.net/api/categories?output_format=JSON",
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await featids.json();
  let { categories } = data;

  for (let idcat of categories) {
    let response = await fetch(
      `https://libreria-test.net/api/categories/${idcat.id}?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );
    data = await response.json();

    let { id, name } = data.category;
    result.push({ id, name });
  }

  return result;
}

console.log(await getCategoryId());*/

/*async function getManufID() {
  let result = [];
  let featids = await fetch(
    "https://libreria-test.net/api/manufacturers?output_format=JSON",
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await featids.json();
  let { manufacturers } = data;

  for (let idman of manufacturers) {
    let response = await fetch(
      `https://libreria-test.net/api/manufacturers/${idman.id}?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );
    data = await response.json();

    let { id, name } = data.manufacturer;
    result.push({ id, name });
  }

  return result;
}

console.log(await getManufID());*/

import producList from "./todos_los_productos.json" assert { type: "json" };

let { result } = producList;

console.log(result.find(el => el.productid === 38))

let res = await saveProduct(result[7936]);

//console.log(result[5212]);
console.log(res.status);
//console.log(await res.text());

async function saveProduct(product) {
  let {
    cf_1375,
    cf_1372,
    unit_price,
    description,
    productname,
    cf_1374,
    cf_1376,
    weight,
    productid,
  } = product;

  let manuid = await getManufID(cf_1374);

  cf_1375 = 1; //ESTAN MAL LAS CATEGORIAS
  description = description
    .slice(0, 300)
    .replaceAll("&", "")
    .replaceAll("#", "")
    .replaceAll(";", "")
    .replaceAll("=", "")
    .replaceAll("}", "")
    .replaceAll("{", "")
    .replaceAll(">", "")
    .replaceAll("<", "")

  //.replaceAll("+", ""); // DESCRIOCIONES DEMASIADO LARGAS
  if (!Number(cf_1372)) cf_1372 = ""; // EAN QUE SON PALABRAS
  productname = productname
    .replaceAll("#", "")
    .replaceAll("&", "")
    .replaceAll(";", "")
    .replaceAll("=", "")
    .replaceAll("}", "")
    .replaceAll("{", "")
    .replaceAll(">", "")
    .replaceAll("<", "")
  //.replaceAll("\r\n", "")
  //.replaceAll("+", ""); //caracteres invalidos

  //console.log("ASDSDASDSASADS", description);

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
                <language id="2">${description}</language>
              </meta_description>
              <meta_keywords>
                <language id="2"></language>
              </meta_keywords>
              <meta_title>
                <language id="2">${productname}</language>
              </meta_title>
              <link_rewrite>
                <language id="2"></language>
              </link_rewrite>
              <name>
                <language id="2">${productname}</language>
              </name>
              <description>
                <language id="2">${description}</language>
              </description>
              <description_short>
                <language id="2">${cf_1376}</language>
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

  if (name.includes("CONCEPTS &")) return 14
  if (name.includes("KATE &")) return 109
  if (name.includes("--")) return ""

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
  let { id } = manufacturers[0];

  return id;
}

