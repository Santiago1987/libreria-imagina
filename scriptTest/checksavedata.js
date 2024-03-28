import { getBigJson } from "../getBigJson.js";
import getCategories from "../Category/getCategories.js";
import getManufacturerID from "../Manufacturer/getManufacturerID.js";
import makeFeatureTable from "../Features/makeFeatureTable.js";
import destructureFeat from "../Features/destructureFeat.js";
import savedProductList from "../savedProductList.js";

async function checksavedata() {
    try {
        // JSON GIGANTE CON TODOS LOS ARTICULOS
        const bigjson = await getBigJson();

        // CATEGORIES CON ID DE SQL
        const catTableSQL = await getCategories();

        // TABLA CON TODAS LAS FEATURES Y SUS IDS
        const featuresTable = await makeFeatureTable();

        //PRODUCTOS QUE YA FUERON GUARDADOS
        const savedProducts = await savedProductList();
        console.log("EMPIEZA EL LOOP");
        for (let i = 0; i < 15000; i++) {
            let product = bigjson[i];
            if (!product) return;
            //console.log(i);
            let {
                crmid,
                qtyinstock,
                cf_1372,
                unit_price,
                description,
                productname,
                weight,
                cf_1374,
                cf_1376,
                cf_1375,
                cf_1395,
                cf_1394,
                fotosid
            } = product;

            //OBTENGO EL ID DEL PROVEEDOR
            let manuid = await getManufacturerID(cf_1374);
            manuid ??= 1; // valor por defecto en caso de que no ecuentre nada

            //LISTA DE LAS FEATURES DEL PRODUCTO
            let prodFeat = destructureFeat(cf_1394);

            let featureXML = "";
            //ARMO EL XML DE LAS FEATURES CON SUS VALORES
            if (prodFeat) {
                // RECORRO LAS FEATURES DEL PRODUCTO
                for (let featName of Object.keys(prodFeat)) {
                    let featval = prodFeat[featName];

                    //BUSCO EN LA TABLA DE FEATURES EL ID DE LA FEATURE Y EL ID DEL VALOR
                    let featureSQL = featuresTable.find((el) => el.name === featName);

                    if (featureSQL) {
                        let { id: idFeat, values } = featureSQL;

                        //BUSCO EL ID DE LOS VALUES
                        let featureValSQL = values.find((el) => el.value === featval);
                        if (!featureValSQL)
                            featureValSQL = values.find((el) => el.value.includes(featval));

                        if (featureValSQL) {
                            let { id: idvalue } = featureValSQL;

                            // UNA VEZ OBTENIDOS LOS 2 IDS ARMO EL XML DE LAS FEATURES
                            featureXML =
                                featureXML +
                                `<product_feature>
                  <id><![CDATA[${idFeat}]]></id>
                  <id_feature_value><![CDATA[${idvalue}]]></id_feature_value>
                  </product_feature>`;
                        }
                    }
                }
            }
            // CATEGORIES
            //ARMO UNA ARRAY CON LAS JERARQUIAS
            let catNames = [cf_1376, cf_1375];
            if (
                cf_1395 !== "" &&
                cf_1395 !== " " &&
                cf_1395 !== undefined &&
                !cf_1395.includes("---")
            )
                catNames[2] = cf_1395;

            // CONS LOS NOMBRES BUSCO LOS IDS DE LA BD SQL
            let cat = catTableSQL.find((el) => {
                let { catlist } = el;
                return (
                    catlist[0] == catNames[0] &&
                    catlist[1] == catNames[1] &&
                    catlist[2] == catNames[2]
                );
            });

            if (!cat && catNames[0] == "FUNDAS") {
                cat = catTableSQL.find((el) => {
                    let { catlist } = el;
                    return (
                        catlist[0] == "FUNDAS"
                    );
                });
            }

            //CHECK IF PRODUCT IS ALREADY SAVED
            let alreadyDB = savedProducts.find((el) => crmid === el.reference);

            if (cat && !alreadyDB) {
                // SI OBETENGO AL CATEGORIA GUARDO EL PRODUCTO
                let categoriID = cat.idcat;

                console.log(cat, product)
                return
            }

            if (alreadyDB) {
                console.log("YA ESTA EB BD", crmid)
            }
            if (!cat && !alreadyDB) console.log("No category", catNames, crmid, i)
        }
    } catch (err) {
        console.error("ERRORRR :", err);
    }
}

await checksavedata();

//GUARDADO COMPLETO DE STOCK
async function saveStockComplete(idstock, qty, idprod) {
    let result = await fetch(
        `https://libreria-test.net/api/stock_availables/${idstock}`,
        {
            method: "PATCH",
            headers: {
                Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
            },
            body: `<?xml version="1.0" encoding="UTF-8"?>
                    <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
                    <stock_available>
                        <id><![CDATA[${idstock}]]></id>
                        <quantity><![CDATA[${qty}]]></quantity>
                        <id_product><![CDATA[${idprod}]]></id_product>
                        <depends_on_stock><![CDATA[0]]></depends_on_stock>
                        <out_of_stock><![CDATA[0]]></out_of_stock>
                        <id_shop><![CDATA[1]]></id_shop>
                        <id_product_attribute><![CDATA[0]]></id_product_attribute>
                    </stock_available>
                </prestashop>`,
        }
    );
    return result;
}

//ID DE UN PRODUCTO EN ESPECIFICO
async function getProductID(ref) {
    let result = await fetch(
        `https://libreria-test.net/api/products?display=[id,reference]&filter[reference]=${ref}&output_format=JSON`,
        {
            method: "GET",
            headers: {
                Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
            },
        }
    );

    let data = await result.json();

    let { products } = data;
    let { id } = products[0];

    return id;
}

//ID DEL STOCK DE UN PRODUCTO EN ESPECIFICO
async function getStockProductID(idprod) {
    let result = await fetch(
        `https://libreria-test.net/api/stock_availables?display=[id]&filter[id_product]=${idprod}&output_format=JSON`,
        {
            method: "GET",
            headers: {
                Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
            },
        }
    );

    let data = await result.json();

    let { stock_availables } = data;
    let { id } = stock_availables[0];

    return id;
}

//GUARDADO DE IMAGENES
async function saveImages(reference, idProd, isFotoid = false) {
    let url = "";

    if (!isFotoid) {
        url = `https://dydsoft.com/imagina/portal/ver_foto.php?id=${reference}`;
    }
    if (isFotoid) {
        url = `https://dydsoft.com/imagina/portal/mostrar_foto.php?id=${reference}`;
    }

    let result = await fetch(url);
    let blob = await result.blob();
    blob.name = reference + ".jpeg";
    blob.lastModified = new Date();

    const imgfile = new File([blob], reference + ".jpeg", {
        type: blob.type,
    });
    const formData = new FormData();
    formData.append("image", imgfile);
    //console.log("data", data);

    //la unica manera que funciono de conseguir el puto size
    const response = new Response(formData);
    let blb = await response.blob();
    let size = blb.size;

    fetch(`https://libreria-test.net/api/images/products/${idProd}`, {
        method: "POST",
        headers: {
            Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
            "Content-Length": size,
        },
        body: formData,
    })
        .then((res) => {
            console.log("saveImages", idProd, res.status);
            //res.text().then((tx) => console.log(tx));
            return res;
        })
        .catch((err) => console.log("saveImages", idProd, err));
}

function htmlEntities(str) {
    return String(str)
        .replaceAll("&ntilde;", "ñ")
        .replaceAll("&Ntilde;", "Ñ")
        .replaceAll("&amp;", "&")
        .replaceAll("&Ntilde;", "Ñ")
        .replaceAll("&ntilde;", "ñ")
        .replaceAll("&Ntilde;", "Ñ")
        .replaceAll("&Agrave;", "À")
        .replaceAll("&Aacute;", "Á")
        .replaceAll("&Acirc;", "Â")
        .replaceAll("&Atilde;", "Ã")
        .replaceAll("&Auml;", "Ä")
        .replaceAll("&Aring;", "Å")
        .replaceAll("&AElig;", "Æ")
        .replaceAll("&Ccedil;", "Ç")
        .replaceAll("&Egrave;", "È")
        .replaceAll("&Eacute;", "É")
        .replaceAll("&Ecirc;", "Ê")
        .replaceAll("&Euml;", "Ë")
        .replaceAll("&Igrave;", "Ì")
        .replaceAll("&Iacute;", "Í")
        .replaceAll("&Icirc;", "Î")
        .replaceAll("&Iuml;", "Ï")
        .replaceAll("&ETH;", "Ð")
        .replaceAll("&Ntilde;", "Ñ")
        .replaceAll("&Ograve;", "Ò")
        .replaceAll("&Oacute;", "Ó")
        .replaceAll("&Ocirc;", "Ô")
        .replaceAll("&Otilde;", "Õ")
        .replaceAll("&Ouml;", "Ö")
        .replaceAll("&Oslash;", "Ø")
        .replaceAll("&Ugrave;", "Ù")
        .replaceAll("&Uacute;", "Ú")
        .replaceAll("&Ucirc;", "Û")
        .replaceAll("&Uuml;", "Ü")
        .replaceAll("&Yacute;", "Ý")
        .replaceAll("&THORN;", "Þ")
        .replaceAll("&szlig;", "ß")
        .replaceAll("&agrave;", "à")
        .replaceAll("&aacute;", "á")
        .replaceAll("&acirc;", "â")
        .replaceAll("&atilde;", "ã")
        .replaceAll("&auml;", "ä")
        .replaceAll("&aring;", "å")
        .replaceAll("&aelig;", "æ")
        .replaceAll("&ccedil;", "ç")
        .replaceAll("&egrave;", "è")
        .replaceAll("&eacute;", "é")
        .replaceAll("&ecirc;", "ê")
        .replaceAll("&euml;", "ë")
        .replaceAll("&igrave;", "ì")
        .replaceAll("&iacute;", "í")
        .replaceAll("&icirc;", "î")
        .replaceAll("&iuml;", "ï")
        .replaceAll("&eth;", "ð")
        .replaceAll("&ntilde;", "ñ")
        .replaceAll("&ograve;", "ò")
        .replaceAll("&oacute;", "ó")
        .replaceAll("&ocirc;", "ô")
        .replaceAll("&otilde;", "õ")
        .replaceAll("&ouml;", "ö")
        .replaceAll("&oslash;", "ø")
        .replaceAll("&ugrave;", "ù")
        .replaceAll("&uacute;", "ú")
        .replaceAll("&ucirc;", "û")
        .replaceAll("&uuml;", "ü")
        .replaceAll("&yacute;", "ý")
        .replaceAll("&thorn;", "þ")
        .replaceAll("&yuml;", "ÿ")
        .replaceAll("&iexcl;", "¡")
        .replaceAll("&quot;", '"')
        .replaceAll("&ordm;", "º")
        .replaceAll("&Ordm;", "º")
        .replaceAll("=", " igual ")
        .replaceAll("}", "")
        .replaceAll("#", "");
}
