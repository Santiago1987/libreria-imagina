export default function destructureFeat(feat) {
  if (!feat) return;
  let result = {};

  if (!feat.includes("--") && feat !== "") {
    let flist = feat.split("|##|");

    for (let feat of flist) {
      let f = feat.split(":");
      if (!f[1]) break;
      let k = f[0].trim();
      let v = f[1].trim();

      //if (!(result[k] instanceof Array)) result[k] = new Array();
      //result.push({ k, v });
      result[k] = v;
    }
  }
  return result;
}

//console.log(destructureFeat("COLOR : VERDE |##| TAMANIO:GRANDE"));

//return  = { COLOR: 'VERDE', TAMANIO: 'GRANDE' };
