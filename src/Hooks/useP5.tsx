import { useEffect, useState } from "react";
import {
  viewVineyardContract
} from "../Utils/vineyardContract"
import {
  viewBottleContract
} from "../Utils/bottleContract"
import { ipfs_gateway } from "../Utils/constants"

const decodeData = (uri: string) => {
  const data = uri.substring(uri.indexOf(',')+1)
  const decoded = atob(data)
  const image = JSON.parse(decoded).image
  return ipfs_gateway + image.substring(7)
}

export const useUri = (props: any) => {
  const { tokenId } = props
  const [uri, setUri] = useState("")

  useEffect(() => {
    const fetchImg = async () => {
      let fullUri
      if (props.vine) {
        fullUri = await viewVineyardContract.tokenURI(tokenId)
      } else {
        fullUri = await viewBottleContract.tokenURI(tokenId)
      }
      const imageUri = decodeData(fullUri)
      setUri(imageUri)
    }
    fetchImg()
  }, [tokenId]);

  return uri
}