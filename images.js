//getAllImagesID()
const getImage = async (id) => {
  try {
    /*fetch(`https://dydsoft.com/imagina/portal/ver_foto.php?id=432`)
      .then((response) => response.blob())
      .then((blob) => {
        const objectURL = URL.createObjectURL(blob);
        console.log(objectURL);
        //image.src = objectURL;
      });*/

    let response = await fetch(
      `https://dydsoft.com/imagina/portal/ver_foto.php?id=432`
    );
    let blob = await response.blob("image/jpg");
    //const objectURL = URL.createObjectURL(blob);

    /*let response = await fetch(
      "https://dydsoft.com/imagina/portal/ver_foto.php?id=432"
    );
    let reader = response.body.getReader();
    let read = await reader.read();
    let val = btoa(String.fromCharCode.apply(null, read.value));
    let base64 = "data:image/png;base64," + val;

    console.log(base64);*/

    const formData = new FormData();
    formData.append("image", blob);

    const res = await fetch("https://libreria-test.net/api/images/products/1", {
      method: "POST",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
      body: formData,
    });
    console.log(res.status);
    console.log(await res.text());

    /*fetch("https://dydsoft.com/imagina/portal/ver_foto.php?id=432")
      .then((response) => response.body.getReader())
      .then((response) => response.read())
      .then((array) => btoa(String.fromCharCode.apply(null, array.value)))
      .then((partialBase64) => "data:image/png;base64," + partialBase64)
      .then((fullBase64) => {
        console.log(fullBase64);

        const formData = new FormData();
        formData.append("image", fullBase64);



      });*/
  } catch (err) {
    console.log("Error: ", err);
    return undefined;
  }
};

await getImage();
