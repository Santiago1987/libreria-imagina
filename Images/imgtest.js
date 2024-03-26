//const axios = require('axios/dist/browser/axios.cjs'); // browser
//const axios = require("axios/dist/node/axios.cjs");
let reference = 410;
let result = await fetch(
  `https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`
);

let blob = await result.blob();
blob.name = reference + ".jpeg";
blob.lastModified = new Date();

const imgfile = new File([blob], reference + ".jpeg", {
  type: blob.type,
});

const formData = new FormData();
formData.append("image", imgfile);
//console.log("data", data);

//la unica manera que funciono de conseguir el puto size
const response = new Response(formData);
let blb = await response.blob();
let size = blb.size;

fetch(`https://libreria-test.net/api/images/products/1`, {
  method: "POST",
  headers: {
    Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
    "Content-Length": size,
  },
  body: formData,
})
  .then((res) => {
    console.log(res.status);
    res.text().then((tx) => console.log(tx));
  })
  .catch((err) => console.log(err));

/*let reference = 364;
fetch(`https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`).then(
  (response) => {
    response.text().then((res) => console.log(res));
    console.log("Body");
    console.log("Type", response.type);
    console.log("Type", response.url);
  }
);*/
