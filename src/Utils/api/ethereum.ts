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
  "function tokenURI(uint256 _tokenId) public view returns (string memory)",
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

export const vineData = async (version_: number, token: number) => {
  const data = await viewVineyardContract.tokenURI(token);
  const json = JSON.parse(
    Buffer.from(data.slice(29), "base64").toString("ascii")
  );

  const { newUri, artist, version } = await gqlQuery("VINEYARD", version_);
  json["version"] = version;

  if (version_ !== -1) {
    json["animation_url"] = newUri + json["animation_url"].slice(53);
    json["fee_recipient"] = artist;
  }

  return json;
};

export const bottleData = async (version_: number, token: number) => {
  const data = await viewBottleContract.tokenURI(token);
  const json = JSON.parse(
    Buffer.from(data.slice(29), "base64").toString("ascii")
  );

  const { newUri, artist, version } = await gqlQuery("BOTTLE", version_);
  json["version"] = version;

  if (version_ !== -1) {
    json["animation_url"] = newUri + json["animation_url"].slice(53);
    json["fee_recipient"] = artist;
  }

  return json;
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
