import { vineData } from "../../Utils/api/ethereum";

export default async function handler(req: any, res: any) {
  const version = Number(req.query.version ?? -1);
  const token = Number(req.query.token);

  const data = await vineData(version, token);

  res.send(data);
}
