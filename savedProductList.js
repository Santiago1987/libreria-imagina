export default async function savedProductList() {
  let result = [];
  let productsIDList = await fetch(
    `https://libreria-test.net/api/products?output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );

  let data = await productsIDList.json();
  let { products } = data;

  for (let prodID of products) {
    let { id } = prodID;
    let productBD = await fetch(
      `https://libreria-test.net/api/products/${id}?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );

    data = await productBD.json();
    let { product } = data;
    let { reference } = product;

    result.push({ id, reference });
    console.log(`Product cargado: ${id}`);
  }

  return result;
}

console.log(await savedProductList());
