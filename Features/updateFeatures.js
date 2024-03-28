import savedProductList from "../savedProductList.js";
import { getBigJson } from "../getBigJson.js";
import makeFeatureTable from "./makeFeatureTable.js";
import destructureFeat from "./destructureFeat.js";

(async () => {
    try {
        //PRODUCTOS QUE YA FUERON GUARDADOS
        const savedProducts = await savedProductList();
        // JSON GIGANTE CON TODOS LOS ARTICULOS
        const bigjson = await getBigJson();
        // TABLA CON TODAS LAS FEATURES Y SUS IDS
        const featuresTable = await makeFeatureTable();

        for (let i = 0; i < 100; i++) {
            let prod = savedProducts[i]
            let { id, reference } = prod


            let product = bigjson.find(el => el.crmid == reference)

            if (product) {
                let { cf_1394 } = product
                let featureXML = "";

                let prodFeat = destructureFeat(cf_1394);
                if (prodFeat) {
                    for (let feat of prodFeat) {
                        let { k, v } = feat

                        //BUSCO EN LA TABLA DE FEATURES EL ID DE LA FEATURE Y EL ID DEL VALOR
                        let featureSQL = featuresTable.find((el) => el.name === k);
                        if (featureSQL) {
                            let { id: idFeat, values } = featureSQL;

                            //BUSCO EL ID DE LOS VALUES
                            let featureValSQL = values.find((el) => el.value === v);
                            if (!featureValSQL)
                                featureValSQL = values.find((el) => el.value.includes(v));
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
                console.log(featureXML);
                if (featureXML !== "") {
                    let saveProdXML = `<?xml version="1.0" encoding="UTF-8"?>
                                    <prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <id><![CDATA[${id}]]></id>
                                        <product_features>
                                            ${featureXML}
                                        </product_features>
                                    </prestashop>`;

                    let result = await fetch(`https://libreria-test.net/api/product_features/${id}`, {
                        method: "PUT",
                        headers: {
                            Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
                        },
                        body: saveProdXML,
                    });
                    if (result.ok) console.log("Producto: ", id, "actualizado", i)
                    if (!result.ok) {
                        console.log("Ultimo id ", id, i);
                        console.log("Razon " + (await result.text()));
                        return;
                    }
                }
            }

        }
    } catch (err) {
        console.error(err)
    }
})()