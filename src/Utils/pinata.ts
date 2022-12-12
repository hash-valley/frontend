import axios from "axios";
// import basePathConverter from "base-path-converter";

export const pinHashToIPFS = (
  hashToPin: string,
  name: string,
  type: string,
  creator: string
) => {
  if (hashToPin.length === 53) {
    hashToPin = hashToPin.substring(7);
  }
  const data = JSON.stringify({
    hashToPin,
    pinataMetadata: {
      name,
      keyvalues: {
        type,
        creator,
      },
    },
  });
  const url = "https://api.pinata.cloud/pinning/pinByHash";

  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY!,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
      },
    })
    .then(function (response) {
      //handle response here
      return response.data;
    })
    .catch(function (error) {
      //handle error here
      console.log(error);
    });
};
