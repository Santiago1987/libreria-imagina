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
    console.log(data);

    let { id, name } = data.product_feature;
    result.push({ id, name });
  }

  return result;
}

export default getFeatureIds;
