import md5 from "./md5.js";

fetch(
  "https://dydsoft.com/imagina/webservice.php?operation=getchallenge&username=integracion",
  {
    method: "GET",
  }
)
  .then((res) => res.json())
  .then((data) => {
    let { result } = data;
    console.log("data", data);
    let cript = md5(result.token + "fUn6nRDdKksNaFmF");
    console.log("crypt", cript);
    fetch(
      "https://dydsoft.com/imagina/webservice.php?operation=login&username=integracion&accessKey=" +
        cript,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((dat) => {
        let { result } = dat;
        console.log("No hay plata", dat);

        fetch(
          "https://dydsoft.com/imagina/webservice.php?operation=query&elementType=Products&busqueda0=%&campo0=crmid&sessionName=" +
            result.sessionName,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .then((dat) => {
            let { result } = dat;
            let category = new Set();
            let supp = new Set();
            let feat = new Set();

            for (let product of result) {
              let { cf_1375, cf_1374, cf_1394, crmid } = product;
              if (crmid == 46384) console.log(product);
              //category.add(cf_1375);
              //supp.add(cf_1374);
              //feat.add(cf_1394);
            }
            //console.log("features", feat);
            //console.log("category", category);
            //console.log("supp", supp);
          });
      });
  })
  .catch((err) => console.error("error", err));

// JSON a XML
/*var xml = XDocument.Load(JsonReaderWriterFactory.CreateJsonReader(
    Encoding.ASCII.GetBytes(jsonString), new XmlDictionaryReaderQuotas()));*/
