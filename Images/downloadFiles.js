import fs from "node:fs";
import { mkdir } from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import path from "node:path";

import { getBigJson } from "../getBigJson.js";
import savedProductList from "../savedProductList.js";
import checkImage from "./checkimage.js";

const downloadFile = async (url, fileName) => {
  const res = await fetch(url);
  if (!fs.existsSync("downloads")) mkdir("downloads"); //Optional if you already have downloads directory
  const destination = path.resolve("./downloads", fileName);
  const fileStream = fs.createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};

async function downloadFiles() {
  try {
    const bigjson = await getBigJson();
    const savedProducts = await savedProductList();
    const idProdImg = await checkImage();

    for (let i = 0; i < savedProducts.length; i++) {
      let { id, reference } = savedProducts[i];
      let isInBd = idProdImg.find((el) => el.id === id);
      if (!isInBd) {
        let produdct = bigjson.find((el) => el.crmid == reference);
        if (!produdct) throw new Error("el producto no esta en el bigjson");

        let { fotosid } = produdct;

        if (!fotosid) {
          let url = `https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`;
          if (!fs.existsSync(`downloads/${id + "-" + reference + ".jpg"}`)) {
            await downloadFile(url, id + "-" + reference + ".jpg");
            console.log(id);
          }
        }

        if (fotosid) {
          let fotolist = fotosid.split(",");

          for (let el of fotolist) {
            let url = `https://dydsoft.com/imagina/portal/mostrar_foto.php?id=${el}`;
            if (!fs.existsSync(`downloads/${id + "-" + el + ".jpg"}`)) {
              await downloadFile(url, id + "-" + el + ".jpg");
              console.log(id);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("ERRORRR :", err);
  }
}

await downloadFiles();
