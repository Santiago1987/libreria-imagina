export default async function checkImage() {
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

    let data = await response.json();

    let { "": imaID } = data;
    res = imaID;
  } catch (err) {
    console.error("Errrorrrrr", err.data);
  }
  return res;
}

//console.log(await checkImage());
