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

//console.log(await makeFeatureTable());

export default makeFeatureTable;

//ESTRUCTURE DEL JSON result = [{id: feature,
//                              name:nombre de feature,
//                              values:[{id: value,
//                                       name: value name}
//                                       ,...] }
//                              ,...]
