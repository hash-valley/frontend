import { useState } from "react";
import { useWallet } from "use-wallet";
import { Page, CenteredSelect } from "../../Styles/Components";
import { Input, Button } from "antd";
import { useQuery } from "@apollo/client";
import { GET_BOTTLES, VINE_URIS, BOTTLE_URIS } from "../../Utils/queries";
import Select from "rc-select";
import styled from "styled-components";
import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "@ethersproject/address";
import { suggest } from "../../Utils/votableUri";

const ProposalInput = styled(Input)`
  max-width: 32rem;
`;

const Error = styled.p`
  color: red;
`;

const NewProposal = () => {
  const wallet = useWallet();
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
  const bottleData = useQuery(GET_BOTTLES, {
    variables: {
      address: wallet.account?.toString().toLowerCase(),
    },
  });

  const vineUriData = useQuery(VINE_URIS);
  const bottleUriData = useQuery(BOTTLE_URIS);

  const nineDays = 777600;
  const thirtySixHours = 36 * 60 * 60;
  const fortyEightHours = 48 * 60 * 60;

  const verifyCooldown = (uri: any): boolean => {
    if (uri.votesFor === "0" && uri.votesAgainst === "0") {
      return true;
    }
    const rn = Date.now() / 1000;
    if (uri.completed && uri.startTimestamp + nineDays < rn) {
      return true;
    }
    if (
      !uri.completed &&
      BigNumber.from(uri.votesAgainst).gt(uri.votesFor) &&
      uri.startTimestamp + thirtySixHours < rn
    ) {
      return true;
    }
    if (
      !uri.completed &&
      BigNumber.from(uri.votesFor).gt(uri.votesAgainst) &&
      uri.startTimestamp + fortyEightHours < rn
    ) {
      return true;
    }
    return false;
  };

  const sendProposal = () => {
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
      pType == "Vineyards" &&
      vineUriData.data.newUris.length > 0 &&
      !verifyCooldown(vineUriData.data.newUris[0])
    ) {
      errors = true;
      setVineCooldown(true);
    } else {
      setVineCooldown(false);
      setBottleCooldown(false);
    }
    if (
      pType == "Bottles" &&
      bottleUriData.data.newUris.length > 0 &&
      !verifyCooldown(bottleUriData.data.newUris[0])
    ) {
      errors = true;
      setBottleCooldown(true);
    } else {
      setBottleCooldown(false);
      setVineCooldown(false);
    }

    if (!errors) {
      if (pType == "Vineyards") {
        suggest(wallet, Number(bottleId), cid, address, "VINEYARD");
      } else if (pType == "Bottles") {
        suggest(wallet, Number(bottleId), cid, address, "BOTTLE");
      }
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
        placeholder="i.e. ipfs://QmVXLRguzqMfDN59BrGpHKdCXK3Fj7mYHcVEY8aKn3JehQ"
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
      <CenteredSelect value={pType} onChange={(event: any) => setPType(event)}>
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
      {wallet.account ? (
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
