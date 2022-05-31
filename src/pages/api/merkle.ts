import { subgraphUrl } from "../../Utils/constants";
import claims_data from "../../Utils/api/discount_claims.json";
import { getAddress } from "ethers/lib/utils";

export default async function handler(req: any, res: any) {
  const address = req.query.address.toLowerCase();
  const checkSumAddress = getAddress(address);
  const claims: any = claims_data.claims;

  if (checkSumAddress in claims) {
    const data = await fetch(subgraphUrl, {
      method: "POST",
      body: JSON.stringify({
        query: `query ($id: String) {
            account(id: $id) {
              claimedDiscount
            }
          }`,
        variables: {
          id: address,
        },
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const jsonData = await data.json();
    if (jsonData.claimedDiscount) {
      res.send({ hasClaim: false });
    } else {
      res.send({
        hasClaim: true,
        index: claims[checkSumAddress].index,
        proof: claims[checkSumAddress].proof,
      });
    }
  } else {
    res.send({ hasClaim: false });
  }
}
