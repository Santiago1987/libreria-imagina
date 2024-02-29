// GET EL ID DEL MANUFACTURER A PARTIR DEL NAME
export default async function getManufacturerID(name) {
  //NAME QUE TIENE & Y DESTRUYEN LOS QUERY PARAM
  if (name.includes("CONCEPTS &")) return 14;
  if (name.includes("KATE &")) return 109;
  if (name.includes("--")) return "";

  let result = await fetch(
    `https://libreria-test.net/api/manufacturers?filter[name]=${name}&output_format=JSON`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic NVJYNzYxSTNBUDJTRkxSNTZDNUM4REFUU1RKRzFFVEw6",
      },
    }
  );
  let data = await result.json();
  let { manufacturers } = data;
  if (!manufacturers) return 0;
  let { id } = manufacturers[0];

  return id;
}
