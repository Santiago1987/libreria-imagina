import fs from 'node:fs'
import FormData from 'form-data';
import axios from 'axios';

const getImage = async () => {
  try {

    const formData = new FormData();
    const filePath = `./downloads/432.jpg`;

    const imageBuffer = fs.readFileSync(filePath)

    const fileStream = fs.createReadStream(filePath);

    formData.append("image", imageBuffer, "432.jpg");
    const leng = formData.getLengthSync()

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
