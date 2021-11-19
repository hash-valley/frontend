import { bottleMetadata } from "../../Utils/api/bottle";
import { bottleData } from "../../Utils/api/ethereum";

export default async function handler(req: any, res: any) {
  const version = Number(req.query.version);
  const token = Number(req.query.token);

  const data = await bottleData(version, token);
  const metadata = bottleMetadata(...data);

  res.send(metadata);
}
