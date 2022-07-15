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

export const pinFileToIPFS = (file: any, type: string, creator: string) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", file);

  //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
  //metadata is optional
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      type,
      creator,
    },
  });
  data.append("pinataMetadata", metadata);

  return axios
    .post(url, data, {
      maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data;`, // boundary=${data._boundary}`,
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_KEY ?? "",
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY ?? "",
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

// export const pinDirectoryToIPFS = async () => {
//   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//   const src = "RELATIVE PATH TO DIRECTORY TO UPLOAD";
//   var status = 0;
//   try {
//     const { dirs, files } = await rfs.read(src);
//     let data = new FormData();
//     for (const file of files) {
//       data.append(`file`, file, basePathConverter(src, file));
//     }
//     const response = await axios.post(url, {
//       headers: {
//         "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
//         Authorization: "Bearer JWT FROM PINATA API KEYS",
//       },
//       body: data,
//     }).on("uploadProgress", (progress) => {
//       console.log(progress);
//     });

//     console.log(JSON.parse(response.body));
//   } catch (error) {
//     console.log(error);
//   }
// };
