export default async function saveStock(idstock, qty) {
  if (!idstock) return 500;
  if (!qty) return 500;
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
  if (!result.ok) {
    throw new Error("Error in stock creations, status: ", result.status);
  }
  return result;
}

export async function getStockIdTable() {
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

export async function saveStockComplete(idstock, qty, idprod) {
  if (!idstock) return 500;
  if (!qty) return 500;

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

  if (!result.ok) {
    console.log(result);
    console.log("Error in stock creations:", idstock, qty, idprod);

    throw new Error("Error in stock creations, status: ", result);
  }
  return result;
}
