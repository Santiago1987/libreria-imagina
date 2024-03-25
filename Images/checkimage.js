export default async function checkImage() {
  let res = [];
  try {
    for (let i = 1; i < 20000; i++) {
      let response = await fetch(
        `https://libreria-test.net/api/images/products/${i}?output_format=JSON`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
          },
        }
      );
      if (!response.status > 299) throw new Error("Imagen not found");
      let data = await response.json();

      let { "": imaID } = data;
      let { id: id_product } = imaID[0];
      let { id: id_image } = imaID[1];

      res.push({ id_product, id_image });
    }
  } catch (err) {
    console.error("FIN");
    return res;
  }
  return res;
}

//console.log(await checkImage());

export async function checkImageXML() {
  let res = [];
  try {
    let response = await fetch(
      `https://libreria-test.net/api/images/products?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );
    let data = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "application/xml");

    console.log("xml", xml);
  } catch (err) {
    console.error(err);
  }
}

console.log(await checkImageXML());
