
import { Contract, providers } from "ethers";
import {
  VineyardAddress,
  BottleAddress,
  providerUrl,
  subgraphUrl,
} from "../constants";

const abi = [
  "function artists(uint version) public view returns(address)",
  "function sellerFee() public view returns(uint16)",
];

const vineAbi = [
  "function getTokenAttributes(uint _tokenId) public view returns(uint16[] memory attributes)",
  "function xp(uint _tokenID) public view returns(uint)",
  "function currentStreak(uint256 _tokenId) public view returns (uint16)",
  ...abi,
];

const bottleAbi = [
  "function bottleAge(uint256 _tokenID) public view returns (uint256)",
  "function attributes(uint _tokenID, uint index) public view returns(uint8)",
  "function bottleEra(uint256 _tokenID) public view returns (string)",
  ...abi,
];

const viewProvider = new providers.JsonRpcProvider(providerUrl);
const viewVineyardContract = new Contract(
  VineyardAddress,
  vineAbi,
  viewProvider
);
const viewBottleContract = new Contract(BottleAddress, bottleAbi, viewProvider);

export const vineData = async (version: number, token: number) => {
  const { newUri, artist } = await gqlQuery("VINEYARD", version);
  const data = await Promise.all([
    viewVineyardContract.getTokenAttributes(token),
    viewVineyardContract.xp(token),
    viewVineyardContract.currentStreak(token),
    newUri,
    artist,
    viewVineyardContract.sellerFee(),
  ]);

  return data;
};

export const bottleData = async (version: number, token: number) => {
  const { newUri, artist } = await gqlQuery("BOTTLE", version);
  const data = await Promise.all([
    viewBottleContract.attributes(token, 0),
    viewBottleContract.attributes(token, 1),
    viewBottleContract.attributes(token, 2),
    viewBottleContract.attributes(token, 3),
    viewBottleContract.bottleAge(token),
    viewBottleContract.bottleEra(token),
    newUri,
    artist,
    viewBottleContract.sellerFee(),
  ]);

  return data;
};

const gqlQuery = async (type: string, version: number) => {
  let body;
  if (version === -1) {
    body = {
      query: `
      query GetUri($type: String!) {
        newUris(
          orderBy: version
          orderDirection: desc
          first: 1
          where: { completed: true, type: $type }
        ) {
          newUri
          artist
          version
        }
      }
    `,
      variables: {
        type,
      },
    };
  } else {
    body = {
      query: `
      query GetUri($type: String!, $version: Int!) {
        newUris(
          first: 1
          where: { completed: true, type: $type, version: $version }
        ) {
          newUri
          artist
          version
        }
      }
    `,
      variables: {
        type,
        version,
      },
    };
  }
  const data = await fetch(subgraphUrl, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });

  const jsonData = await data.json();

  return jsonData?.data?.newUris[0];
};
