const getImage = async (id) => {
  try {
    let result = await fetch(`https://dydsoft.com/imagina/portal/mostrar_foto.php?id=${id}`, {
      method: 'GET'
    })

    return result.blob()
  } catch (err) {
    console.log("Error: ", err)
    return undefined
  }

}

async function saveImage(prodID) {
  try {
    let image = getImage(prodID)
    if (!image) return

    const formData = new FormData()
    formData.append("image", image)


    let result = await fetch(`https://libreria-test.net/api/images/products/${prodID}`, {
      method: 'POST'
    })

  } catch (err) {
    console.log("Error: ", err)
    return undefined
  }
}

const formData = new FormData()
formData.append("image", getImage(1))

