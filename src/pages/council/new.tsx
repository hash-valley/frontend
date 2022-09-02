import { useEffect, useState } from "react";
import { Page, CenteredSelect } from "../../Styles/Components";
import { Input, Button } from "antd";
import { useQuery } from "@apollo/client";
import { GET_BOTTLES, VINE_URIS, BOTTLE_URIS } from "../../Utils/queries";
import Select from "rc-select";
import styled from "styled-components";
import { suggest } from "../../Utils/votableUri";
import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { useAccount, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { DAY } from "../../Utils/constants";
import { useRouter } from "next/router";
import { pinHashToIPFS } from "../../Utils/pinata";

const ProposalInput = styled(Input)`
  max-width: 32rem;
`;

const Error = styled.p`
  color: red;
`;

const NewProposal = () => {
  const wallet = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();
  const addRecentTransaction = useAddRecentTransaction();
  const [cid, setCid] = useState("");
  const [address, setAddress] = useState("");
  const [bottleId, setBottleId] = useState("Token ID #");
  const [pType, setPType] = useState("Vineyards");
  const [open, setOpen] = useState(true);
  const [cidError, setCidError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [bottleError, setBottleError] = useState(false);
  const [vineCooldown, setVineCooldown] = useState(false);
  const [bottleCooldown, setBottleCooldown] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const bottleData = useQuery(GET_BOTTLES, {
    variables: {
      address: wallet?.address?.toString().toLowerCase(),
    },
  });

  const vineUriData = useQuery(VINE_URIS);
  const bottleUriData = useQuery(BOTTLE_URIS);

  const nineDays = 9 * DAY;
  const thirtySixHours = 1.5 * DAY;
  const fortyEightHours = 2 * DAY;

  useEffect(() => setShowButton(true), []);

  const verifyCooldown = (uri: any): boolean => {
    if (uri.votesFor === "0" && uri.votesAgainst === "0") {
      return true;
    }

    const rn = Date.now() / 1000;
    const startTimestamp = Number(uri.startTimestamp);
    if (uri.completed && startTimestamp + nineDays < rn) {
      return true;
    }
    if (
      !uri.completed &&
      BigNumber.from(uri.votesAgainst).gt(uri.votesFor) &&
      startTimestamp + thirtySixHours < rn
    ) {
      return true;
    }
    if (
      !uri.completed &&
      BigNumber.from(uri.votesFor).gt(uri.votesAgainst) &&
      startTimestamp + fortyEightHours < rn
    ) {
      return true;
    }
    return false;
  };

  const sendProposal = async () => {
    setOpen(false);
    let errors = false;
    if (cid == "") {
      errors = true;
      setCidError(true);
    } else {
      setCidError(false);
    }
    if (!isAddress(address)) {
      errors = true;
      setAddressError(true);
    } else {
      setAddressError(false);
    }
    if (bottleId == "Token ID #") {
      errors = true;
      setBottleError(true);
    } else {
      setBottleError(false);
    }
    if (
      pType === "Vineyards" &&
      vineUriData.data.newUris.length > 0 &&
      !verifyCooldown(vineUriData.data.newUris[0])
    ) {
      errors = true;
      setVineCooldown(true);
    } else {
      setVineCooldown(false);
    }
    if (
      pType === "Bottles" &&
      bottleUriData.data.newUris.length > 0 &&
      !verifyCooldown(bottleUriData.data.newUris[0])
    ) {
      errors = true;
      setBottleCooldown(true);
    } else {
      setBottleCooldown(false);
    }

    if (!errors) {
      let tx;
      toast.info(
        "Pinning to IPFS (artwork may take a few minutes to appear on the council page)"
      );
      if (pType == "Vineyards") {
        await pinHashToIPFS(
          cid,
          "VINEYARD-" + address,
          "VINEYARD",
          wallet?.address!
        );
        tx = await suggest(signer, Number(bottleId), cid, address, "VINEYARD");
      } else if (pType == "Bottles") {
        await pinHashToIPFS(
          cid,
          "BOTTLE-" + address,
          "BOTTLE",
          wallet?.address!
        );
        tx = await suggest(signer, Number(bottleId), cid, address, "BOTTLE");
      }
      addRecentTransaction({
        hash: tx.hash,
        description: `Create ${pType} proposal with bottle ${Number(bottleId)}`,
      });
      await tx.wait();
      toast.success("Success!");
      router.push(`/council/${pType.toLowerCase()}`);
    }
  };

  return (
    <Page>
      <h2>New Proposal</h2>
      <br />
      <p>
        Enter the cid your script is hosted at{" "}
        <i>(if its on IPFS please make sure this is functional and pinned!)</i>
      </p>
      <ProposalInput
        placeholder="i.e. ipfs://QmVobcYpvpNfS84yEwZtjuuAFabf3nL4Gso8MyDa4QGWzu"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
      />
      <Error hidden={open || !cidError}>Invalid cid</Error>
      <br />
      <br />
      <p>Enter an address to receive secondary market royalties</p>
      <ProposalInput
        id="address"
        placeholder="0x..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Error hidden={open || !addressError}>Invalid address</Error>
      <br />
      <br />
      <p>
        Select the token id of the bottle to vote with (higher age carries more
        weight)
      </p>
      <CenteredSelect
        value={bottleId}
        onChange={(event: any) => setBottleId(event)}
      >
        {bottleData?.data?.bottles.map((bottle: any) => (
          <Select.Option key={bottle.tokenId} value={bottle.tokenId}>
            Token ID {bottle.tokenId}
          </Select.Option>
        ))}
      </CenteredSelect>
      <Error hidden={open || !bottleError}>
        Please select a bottle to vote with. If there are none available you may
        need to wait a few days before trying again.
      </Error>
      <br />
      <br />
      <p>Is this for Vineyards or Bottles?</p>
      <CenteredSelect
        value={pType}
        onChange={(event: any) => {
          setPType(event);
          setVineCooldown(false);
          setBottleCooldown(false);
        }}
      >
        <Select.Option key="vine" value="Vineyards">
          Vineyards
        </Select.Option>
        <Select.Option key="bottle" value="Bottles">
          Bottles
        </Select.Option>
      </CenteredSelect>
      <Error hidden={open || !vineCooldown}>
        Too soon to make a new Vineyard proposal
      </Error>
      <Error hidden={open || !bottleCooldown}>
        Too soon to make a new Bottle proposal
      </Error>
      <br />
      <br />
      {showButton && wallet?.address ? (
        <Button type="primary" shape="round" onClick={sendProposal}>
          Submit
        </Button>
      ) : (
        <p>Please connect your wallet to continue</p>
      )}
    </Page>
  );
};

export default NewProposal;
