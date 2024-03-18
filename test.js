import md5 from "./md5.js";
async function getProd() {
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
  let { result } = res;
  let cript = md5(result.token + "fUn6nRDdKksNaFmF");

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
  let result2 = res2.result;

  let response3 = await fetch(
    `https://dydsoft.com/imagina/webservice.php?operation=query&elementType=Products&busqueda0=${364}&campo0=crmid&sessionName=` +
      result2.sessionName,
    {
      method: "GET",
    }
  );

  if (!response3.ok) {
    throw new Error("Error en la api");
  }

  let res3 = await response3.json();
  let result3 = res3.result;

  return result3;
}

console.log(await getProd());
