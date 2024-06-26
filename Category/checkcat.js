import getCategories from "./getCategories.js";
import groupCategories from "./groupCategories.js";
import savedProductList from "../savedProductList.js";

const catfrombd = await getCategories();
const catfromjson = await groupCategories();
const savedProducts = await savedProductList();

//console.log("catfromjson", catfromjson)

let prodok = [];
let proderr = [];

let conts = 0;
let cont = 0;

let catl = new Set()

for (let prod of catfrombd) {
  let { catlist } = prod;

  let last = catlist[2] ? "-" + catlist[2] : ""
  if (catlist[0] === "REGALERIA") {
    catl.add(catlist[0] + "-" + catlist[1] + last)
  }
}

for (let prod of catfromjson) {
  let { idprod, name } = prod;

  //if (name === "LIBRO") cont = cont + 1;
  //if (name === "LIBROS") conts = conts + 1;
  let alreadyDB = savedProducts.find((el) => idprod === el.reference);

  if (!alreadyDB) {
    let cat = catfrombd.find((el) => {
      let { catlist } = el;
      return (
        catlist[0] == name[0] && catlist[1] == name[1] && catlist[2] == name[2]
      );
    });
    if (name[0] === "REGALERIA" && !cat && false) {
      //console.log(name[0], name[1], name[2])
      let last = name[2] ? "-" + name[2] : ""
      catlist.add(name[0] + "-" + name[1] + last)

    }
    //if (!cat) proderr.push({ idprod, name });
    //if (cat) prodok.push({ idprod, name });
  }
}
console.log(catl)

//console.log("Poductos ok: " + prodok.length);
//console.log(prodok);

//console.log("Poductos error: " + proderr.length);
//console.log(proderr);

//console.log(catfrombd);
//console.log(catfromjson);
