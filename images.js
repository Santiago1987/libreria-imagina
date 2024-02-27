import { getBigJson } from './getBigJson.js'

const getAllImagesID = async () => {
    try {
        let productJson = await getBigJson();

        if (!productJson) throw new Error("Error en la api")

        let images = []

        for (let product of productJson) {
            let { fotosid, productid } = product;
            images.push({ productid, fotosid })
        }
        console.log(images)

    } catch (err) {
        console.error("Error: ", err)
    }
}

//getAllImagesID()

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

async function saveImage(prodID, imaID) {
    let result = undefined
    try {
        let image = await getImage(imaID)
        console.log("image", image)
        if (!image) return

        const formData = new FormData()
        formData.append("image", image)


        result = await fetch(`https://libreria-test.net/api/images/products/${prodID}`, {
            method: 'POST',
            body: formData
        })


    } catch (err) {
        console.log("Error: ", err)
        result = undefined
    }
    return result
}

let res = await saveImage(1, 99)
console.log("text", await res.text())
console.log("text", await res.status)