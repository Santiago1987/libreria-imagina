import getCategories from "./getCategories.js";
import groupCategories from "./groupCategories.js";

const catfrombd = await getCategories();
const catfromjson = await groupCategories();

let prodok = [];
let proderr = [];

let conts = 0;
let cont = 0;

for (let prod of catfromjson) {
  let { idprod, name } = prod;

  //if (name === "LIBRO") cont = cont + 1;
  //if (name === "LIBROS") conts = conts + 1;

  let cat = catfrombd.find((el) => {
    let { catlist } = el
    return catlist[1] === name[1] && catlist[2] === name[2] && catlist[3] === name[3]

  });

  if (!cat) proderr.push({ idprod, name })
  if (cat) prodok.push({ idprod, name })
}

//console.log("Poductos ok: " + prodok.length);
//console.log(prodok);

console.log("Poductos error: " + proderr.length);
console.log(proderr);

//console.log(catfrombd);
//console.log(catfromjson);
