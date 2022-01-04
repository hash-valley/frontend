import { vineMetadata } from "../../Utils/api/vine";
import { vineData } from "../../Utils/api/ethereum";

export default async function handler(req: any, res: any) {
  const version = Number(req.query.version);
  const token = Number(req.query.token);

  const data = await vineData(version, token);
  const metadata = vineMetadata(
    data[0][0],
    data[0][1],
    data[0][2],
    data[0][3],
    Number(data[1]),
    Number(data[2]),
    data[3],
    data[4],
    data[5],
    token
  );

  res.send(metadata);
}
