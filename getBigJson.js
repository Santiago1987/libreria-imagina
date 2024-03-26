import md5 from "./md5.js";
export const getBigJson = async () => {
  let result3 = undefined;
  try {
    let response = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=getchallenge&username=integracion",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error en la api");
    }

    let res = await response.json();
    if (!res.success) {
      throw new Error("Error en la api");
    }

    let { result } = res;
    console.log("data", res);
    let cript = md5(result.token + "fUn6nRDdKksNaFmF");
    console.log("crypt", cript);

    let response2 = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=login&username=integracion&accessKey=" +
        cript,
      {
        method: "GET",
      }
    );

    if (!response2.ok) {
      throw new Error("Error en la api");
    }

    let res2 = await response2.json();
    if (!res2.success) {
      throw new Error("Error en la api");
    }

    let result2 = res2.result;
    console.log("No hay plata", result2);

    let response3 = await fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=query&elementType=Products&busqueda0=%&campo0=crmid&sessionName=" +
        result2.sessionName,
      {
        method: "GET",
      }
    );

    if (!response3.ok) {
      throw new Error("Error en la api");
    }

    let res3 = await response3.json();

    if (!res3.success) {
      throw new Error("Error en la api");
    }

    result3 = res3.result;
  } catch (err) {
    console.error("Error: ", err);
  }
  return result3;
};
