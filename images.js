import fs from 'node:fs'
import FormData from 'form-data';
import axios from 'axios';

const getImage = async (id) => {
  try {

    const formData = new FormData();
    const filePath = `./downloads/432.jpg`;
    //const stats = fs.statSync(filePath);
    //const fileSizeInBytes = stats.size;

    const imageBuffer = fs.readFileSync(filePath)

    const fileStream = fs.createReadStream(filePath);

    formData.append("image", imageBuffer, "432.jpg");
    const leng = formData.getLengthSync()

    /*const res = await fetch("https://libreria-test.net/api/images/products/1", {
      method: "POST",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        "Content-Length": leng,
        "Content-Type": "application/json"
      },
      body: formData,
    });
    console.log(res.status);
    console.log(await res.text());*/

    axios.post("https://libreria-test.net/api/images/products/1", formData, {
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
        "Content-Length": leng,
      }
    }).then((response) => {
      console.log(response.status);
    })
      .catch((error) => {
        console.error(error.response.data);
      });

  } catch (err) {
    console.log("Error: ", err);
    return undefined;
  }
};

await getImage();
