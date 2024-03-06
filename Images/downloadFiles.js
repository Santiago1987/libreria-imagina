const fs = require("fs");
const { mkdir } = require("fs/promises");
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require("path");
const downloadFile = (async (url, fileName) => {
    const res = await fetch(url);
    if (!fs.existsSync("downloads")) await mkdir("downloads"); //Optional if you already have downloads directory
    const destination = path.resolve("./downloads", fileName);
    const fileStream = fs.createWriteStream(destination, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
});

import { getBigJson } from "../getBigJson.js";
import savedProductList from "../savedProductList.js"
async function downloadFiles() {
    try {
        const bigjson = await getBigJson();
        const savedProducts = await savedProductList()

        for (let prod of savedProducts) {
            let { id, reference } = prod
            let produdct = bigjson.find(el => el.crmid == reference)
            if (!produdct) throw new Error("el producto no esta en el bigjson")

            let { fotosid } = produdct

            if (!fotosid) {
                let url = `https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`
                await downloadFile(url, id + '-' + reference)
            }

            if (fotosid) {
                let fotolist = fotosid.split(",")

                for (let el of fotolist) {
                    let url = `https://dydsoft.com/imagina/portal/mostrar_foto.php?id=${el}`
                    await downloadFile(url, id + '-' + reference)
                }
            }




        }


    } catch (err) {
        console.error("ERRORRR :", err);
    }

}



await downloadFile("<url_to_fetch>", "<fileName>")