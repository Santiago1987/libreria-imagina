import savedProductList from "../savedProductList.js"
import { getStockIdTable, saveStockComplete } from "./savestock.js"

const savedProducts = await savedProductList()
const stockIdTable = await getStockIdTable()

for (let prod of savedProducts) {
    let { id } = prod
    let isPresent = stockIdTable.find(el => el.id_product === id)

    if (isPresent) console.log(id)
}