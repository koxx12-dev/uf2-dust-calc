import { Bundlee } from "bundlee";

const bundlee = new Bundlee()

//data bundle
const bundle = await bundlee.bundle(Deno.cwd(), "data")
await Deno.writeTextFile("bundles/data.json", JSON.stringify(bundle))