export default async function savedProductList() {
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

//let res = await savedProductList()

