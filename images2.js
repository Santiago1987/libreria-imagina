import FormData from "form-data";
import axios from "axios";
import fs from "node:fs";

const formData = new FormData();
const filePath = `./imagenes/432.jpg`;

const imageBuffer = fs.readFileSync(filePath);

formData.append("image", imageBuffer, "image.jpg");
const leng = formData.getLengthSync();

axios
  .post(`https://libreria-test.net/api/images/products/1`, formData, {
    headers: {
      Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      "Content-Length": leng,
    },
  })
  .then((res) => console.log(res.status.data))
  .catch((err) => console.log(err.data));
//console.log(432, "result.status.data", i);
