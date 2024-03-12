import axios from "axios";
let idstock = 13050;
let qty = 2;
let idprod = 3;

/*let result = await fetch(
  `https://libreria-test.net/api/stock_availables/${idstock}`,
  {
    method: "PUT",
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
    body: `<?xml version="1.0" encoding="UTF-8"?>
                <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
                <stock_available>
                    <id><![CDATA[${idstock}]]></id>
                    <quantity><![CDATA[${qty}]]></quantity>
                    <id_product><![CDATA[${idprod}]]></id_product>
                    <depends_on_stock>0</depends_on_stock>
                    <out_of_stock>0</out_of_stock>
                    <id_shop>1</id_shop>
                </stock_available>
            </prestashop>`,
  }
);

console.log(result.status);*/
let body = `<?xml version="1.0" encoding="UTF-8"?>
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
            </prestashop>`;

await axios
  .put(`https://libreria-test.net/api/stock_availables/${idstock}`, body, {
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    },
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));
