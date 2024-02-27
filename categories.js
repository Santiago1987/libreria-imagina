import { getBigJson } from './getBigJson.js'

const getAllCategories = async () => {
    try {
        let productJson = await getBigJson();

        if (!productJson) throw new Error("Error en la api")

        let category = new Set();

        for (let product of productJson) {
            let { cf_1375 } = product;
            category.add(cf_1375);
        }
        console.log(category)

    } catch (err) {
        console.error("Error: ", err)
    }
}

getAllCategories()