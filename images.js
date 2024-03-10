import fs from 'node:fs'
import FormData from 'form-data';
import axios from 'axios';

const saveImage = async () => {

  try {
    const files = fs.readdirSync('./downloads')

    for (let i = 2942; i < 4000; i++) {

      let image = files[i]
      if (!files[i]) return
      let id = image.split("-")[0]

      const formData = new FormData();
      const filePath = `./downloads/${image}`;

      const imageBuffer = fs.readFileSync(filePath)

      //const fileStream = fs.createReadStream(filePath);

      formData.append("image", imageBuffer, "pepito.jpg");
      const leng = formData.getLengthSync()
      //console.log(image)
      let result = await axios.post(`https://libreria-test.net/api/images/products/${id}`, formData, {
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
          "Content-Length": leng,
        }
      })
      console.log(id, result.status, i);
      if (result.status > 299) return


      /*axios.post(`https://libreria-test.net/api/images/products/${id}`, formData, {
        headers: {
          Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
          "Content-Length": leng,
        }
      }).then((response) => {
        console.log(id, response.status, i);
      })
        .catch((error) => {
          console.error(error.response.data);
          console.error("Error en linea: ", i);
          error = true
        });*/


    }

  } catch (err) {
    console.log("Error: ", err.message);
    return undefined;
  }
};

await saveImage();

