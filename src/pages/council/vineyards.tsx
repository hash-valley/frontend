import Council from "../../Components/Council";
import { useQuery } from "@apollo/client";
import { NEW_URI } from "../../Utils/queries";
import { Page, BigLink } from "../../Styles/Components";
import Link from "next/link";
import { useAccount } from "wagmi";
import { constants } from "ethers";
import LoadingSpinner from "../../Components/LoadingSpinner";

const VineBoard = () => {
  const { address } = useAccount();
  const { loading, data } = useQuery(NEW_URI, {
    variables: {
      type: "VINEYARD",
      address: address?.toString().toLowerCase() ?? constants.AddressZero,
    },
    pollInterval: 10000,
  });

  return loading ? (
    <Page>
      <h4>
        <LoadingSpinner />
      </h4>
    </Page>
  ) : data?.newUris.length > 1 ? (
    <Council newUris={data.newUris} bottles={data.bottles || []} vineyards={data.vineyards || []} />
  ) : (
    <Page>
      <h2>
        <i>No Proposals have been made yet for Vineyard Art</i>
      </h2>
      <br />
      <Link href="/council/new" passHref>
        <BigLink>Make one now!</BigLink>
      </Link>
    </Page>
  );
};

export default VineBoard;
