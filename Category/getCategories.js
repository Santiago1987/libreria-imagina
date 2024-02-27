async function getCategories() {
  let categoriList = [];
  let result = [];
  try {
    let response = await fetch(
      `https://libreria-test.net/api/categories?output_format=JSON`,
      {
        method: "GET",
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        },
      }
    );

    let categorisID = await response.json();
    let { categories } = categorisID;

    for (let el of categories) {
      let { id } = el;

      response = await fetch(
        `https://libreria-test.net/api/categories/${id}?output_format=JSON`,
        {
          method: "GET",
          headers: {
            Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
          },
        }
      );

      let data = await response.json();
      let { category } = data;
      let { id: idcat, name, id_parent, level_depth } = category;

      categoriList.push({ id: idcat, name, id_parent, level_depth });
    }

    for (let cat of categoriList) {
      let { id, name, id_parent, level_depth } = cat;

      if (name === "FUNDAS") {
        result.push({ idcat: id, catlist: name });
      }

      if (level_depth === 3) {
        // level dos
        let twocat = categoriList.find((el) => el.id === id_parent);
        let { name: twonam } = twocat;

        name = name.toUpperCase();
        twonam = twonam.toUpperCase();

        if (twonam === "LIBROS") {
          result.push({
            idcat: id,
            catlist: [twonam, name],
          });
        }
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

        let catlist = [twonam, threenam, name]


        result.push({
          idcat: id,
          catlist
        });


      }
    }
  } catch (err) {
    console.error(err);
  }

  return result;
}
//console.log(await getCategories());
export default getCategories;
