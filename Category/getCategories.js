async function getCategories() {
  let categoriList = [];
  let result = [];
  try {
    let response = await fetch(
      `https://libreria-test.net/api/categories/?display=[id,name,id_parent,level_depth]&output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );

    let data = await response.json();
    let { categories } = data;

    for (let el of categories) {
      let { id: idcat, name, id_parent, level_depth } = el;

      categoriList.push({ id: idcat, name, id_parent, level_depth });
    }

    for (let cat of categoriList) {
      let { id, name, id_parent, level_depth } = cat;

      if (name === "Fundas") {
        result.push({
          idcat: id,
          catlist: [name.toUpperCase(), name.toUpperCase()],
        });
      }

      if (level_depth === 3) {
        // level dos
        let twocat = categoriList.find((el) => el.id === id_parent);
        let { name: twonam } = twocat;

        name = name.toUpperCase();
        twonam = twonam.toUpperCase();

        result.push({
          idcat: id,
          catlist: [twonam, name],
        });
      }

      //level 3
      if (level_depth === 4) {
        // level tres
        let threecat = categoriList.find((el) => el.id === id_parent);
        let { id_parent: idthree, name: threenam } = threecat;

        // level dos
        let twocat = categoriList.find((el) => el.id === idthree);
        let { name: twonam } = twocat;

        name = name.toUpperCase();
        threenam = threenam.toUpperCase();
        twonam = twonam.toUpperCase();

        let catlist = [twonam, threenam, name];

        result.push({
          idcat: id,
          catlist,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  return result;
}

//let result = await getCategories();
//console.log(result.slice(0, 100));
//console.log(result.slice(100, 200));
export default getCategories;
