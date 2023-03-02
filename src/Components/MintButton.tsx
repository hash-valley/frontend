import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useCurrSeason } from "../Hooks/useCurrSeason";
import { BigNumber, constants, utils } from "ethers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@apollo/client";
import { FREE_MINT_QUERY } from "../Utils/queries";
import { DECIMALS } from "../Utils/constants";
import { formatUnits } from "ethers/lib/utils";

const Centered = styled.div`
  margin: auto;
  margin-left: calc(50% - 67px);
`;

const BonusText = styled.div`
  margin: auto;
  max-width: 275px;
  background: linear-gradient(to right, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MintButton = () => {
  const { status, address } = useAccount();
  const router = useRouter();
  const protocol = useCurrSeason();
  const [minted, setMinted] = useState(0);
  const [max, setMax] = useState(Infinity);
  const [price, setPrice] = useState("0.0");
  const [canMint, setCanMint] = useState(false);

  const { loading, data, refetch } = useQuery(FREE_MINT_QUERY, {
    variables: {
      userAddress: address?.toLowerCase() ?? "",
    },
  });

  useEffect(() => {
    async function reload() {
      await protocol.update();
      await refetch();
    }
    reload();
  }, [router.query.slug]);

  useEffect(() => {
    if (protocol.bottle && max === Infinity) {
      setMinted(protocol.mintedVineyards);
      setPrice(utils.formatEther(protocol.currentPrice));
      setMax(protocol.maxVineyards);
    }
    if (!loading) {
      setCanMint(
        protocol.mintedVineyards >= 1500 ||
          data.account === null ||
          data?.account?.vineyards.length < 5
      );
    }
  }, [protocol, data]);

  return (
    <>
      <h3>
        {minted} / {max} vineyards minted
      </h3>
      {minted < 1500 ? (
        <h3>
          <p>
            {1500 - minted} free vineyards remaining then 0.01 {constants.EtherSymbol}
          </p>
          <p>-</p>
          <i>You&apos;ve claimed {data?.account?.vineyards.length ?? 0} / 5 free vineyards</i>
        </h3>
      ) : (
        minted < max && (
          <h3>
            <p>
              {price} {constants.EtherSymbol}
            </p>
            <i>Price increases 0.01 {constants.EtherSymbol} every 1000 mints</i>
          </h3>
        )
      )}
      {minted >= 4000 && <BonusText>Bonus: 5000 $GRAPE, 5000 $VINEGAR</BonusText>}
      <br />
      <br />
      {minted < max ? (
        <>
          {status === "connected" ? (
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => router.push(`/mint`)}
              disabled={!canMint}
            >
              Mint
            </Button>
          ) : (
            <Centered>
              <ConnectButton />
            </Centered>
          )}
        </>
      ) : (
        <h2>All Vineyards have been minted!</h2>
      )}
      {minted >= max && BigNumber.from(data?.account?.giveawayBalance ?? 0).gte(DECIMALS) && (
        <Button type="primary" shape="round" size="large" onClick={() => router.push(`/mint`)}>
          Use VIP Token ({formatUnits(data.account.giveawayBalance)})
        </Button>
      )}
    </>
  );
};

export default MintButton;
