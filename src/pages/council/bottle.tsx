import { useEffect } from "react";
import { useWallet } from "use-wallet";
import Council from "../../Components/Council";
import { useQuery } from "@apollo/client";
import { NEW_URI } from "../../Utils/queries";
import { Page, BigLink } from "../../Styles/Components";
import Link from "next/link";

const BottleBoard = () => {
  const wallet = useWallet();
  const { loading, error, data } = useQuery(NEW_URI, {
    variables: {
      type: "BOTTLE",
      address: wallet.account?.toString().toLowerCase(),
    },
    pollInterval: 10000,
  });

  return loading ? (
    <Page>
      <h4>
        <i>Loading...</i>
      </h4>
    </Page>
  ) : data?.newUris.length ? (
    <Council
      newUris={data.newUris}
      bottles={data.bottles || []}
      vineyards={data.vineyards || []}
    />
  ) : (
    <Page>
      <h2>
        <i>No Proposals have been made yet for Bottle Art</i>
      </h2>
      <br />
      <Link href="/council/new">
        <BigLink>Make one now!</BigLink>
      </Link>
    </Page>
  );
};

export default BottleBoard;