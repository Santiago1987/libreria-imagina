async function makeFeatureTable() {
  let result = [];

  // BUSCO TODAS LAS FEATURES
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
    // BUSCO EL NOMBRE DE CADA FEATURE PARA MACHEAR DEPUES
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

    //ARMO LISTA DE NOMBRE Y LA ID DE LA FEATURE
    result.push({ id, name, values: [] });
  }

  // BUSCO TODOS LOS VALORES POSIBLES DE LAS FEATURES
  let featValID = await fetch(
    `https://libreria-test.net/api/product_feature_values?output_format=JSON`,
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
  for (let idobj of product_feature_values) {
    let { id: featvalID } = idobj;

    let featValues = await fetch(
      `https://libreria-test.net/api/product_feature_values/${featvalID}?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );

    data = await featValues.json();

    let { product_feature_value } = data;

    let { id, id_feature, value } = product_feature_value;

    // BUSCO EL INDICE DEL PADRE EN RESULT
    let featIndx = result.findIndex((el) => el.id === id_feature);
    console.log(featIndx);

    let { values, name } = result[featIndx];
    values.push({ id, value });

    result[featIndx] = { id: id_feature, name, values };

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
