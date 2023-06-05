import { FC, useContext, useEffect, useState } from "react";
import {
  Page,
  TokenFrame,
  Spaced,
  CenteredSelect,
  BreakWords,
  FailText,
  SuccessText,
} from "../Styles/Components";
import { DAY, ipfs_gateway } from "../Utils/constants";
import styled from "styled-components";
import Select from "rc-select";
import { support, retort, complete } from "../Utils/votableUri";
import { getEns, hours, minutes, seconds } from "../Utils/utils";
import { BigNumber } from "ethers";
import { useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { ModalContext } from "../Hooks/ModalProvider";

const PaddedSuccess = styled(SuccessText)`
  margin: 0.8rem 0 1.6rem 0;
`;

const PaddedFail = styled(FailText)`
  margin: 0.8rem 0 1.6rem 0;
`;

interface BarProps {
  color: string;
  votesFor: BigNumber;
  votesAgainst: BigNumber;
  totalVotes: BigNumber;
}

const Bar = styled.div<BarProps>`
  float: left;
  height: 10px;
  background-color: ${(props) => (props.color == "green" ? "green" : "red")};
  width: ${(props) =>
    props.color == "green"
      ? Math.round(Number(props.votesFor.mul(100).div(props.totalVotes)))
      : Math.round(Number(props.votesAgainst.mul(100).div(props.totalVotes)))}%;
  border-radius: ${(props) =>
    props.color == "green"
      ? props.votesAgainst.eq(0)
        ? "5px"
        : "0"
      : props.votesFor.eq(0)
      ? "5px"
      : "0"};

  border-top-left-radius: ${(props) => (props.color == "green" ? "5px" : "")};
  border-bottom-left-radius: ${(props) => (props.color == "green" ? "5px" : "")};

  border-top-right-radius: ${(props) => (props.color == "red" ? "5px" : "")};
  border-bottom-right-radius: ${(props) => (props.color == "red" ? "5px" : "")};
`;

const Tally = styled.h3`
  margin-top: 0.8rem;
`;

const Container = styled.div`
  margin-top: 20px;
  position: relative;
  display: inline-block;
  background-color: inherit;
  width: 80%;
`;

const Countdown = styled.div`
  font-size: 1rem;
  margin-bottom: 1.2rem;
  font-weight: 500;
`;

interface CouncilTypes {
  newUris: any;
  bottles: any;
  vineyards: any;
}

interface VoteBarTypes {
  votesFor: BigNumber;
  votesAgainst: BigNumber;
  completed: Boolean;
}

const VoteBar: FC<VoteBarTypes> = ({ votesFor, votesAgainst, completed }) => {
  const totalVotes = votesFor.add(votesAgainst);
  return (
    <>
      <Container>
        {votesFor.gt(0) && (
          <Bar
            color="green"
            votesAgainst={votesAgainst}
            votesFor={votesFor}
            totalVotes={totalVotes}
          />
        )}
        {votesAgainst.gt(0) && (
          <Bar
            color="red"
            votesAgainst={votesAgainst}
            votesFor={votesFor}
            totalVotes={totalVotes}
          />
        )}
      </Container>
      <Tally>
        For: {votesFor.toString()}, Against: {votesAgainst.toString()}
        {" - "}
        <i>
          {votesFor.gt(votesAgainst)
            ? completed
              ? "Succeeded"
              : "Winning!"
            : completed
            ? "Failed"
            : "Losing!"}
        </i>
      </Tally>
    </>
  );
};

const defaultUri = (uri: string) => ipfs_gateway + uri.substring(7) + "/?seed=" + "0-0-0-0-0"; //TODO: actual values

const bottleUri = (uri: string, bottle: any) =>
  ipfs_gateway +
  uri.substring(7) +
  "/?seed=" +
  `${bottle.attributes[0]}-${bottle.attributes[1]}-${bottle.attributes[2]}-${bottle.attributes[3]}`;

const vineyardUri = (uri: string, vineyard: any) =>
  ipfs_gateway +
  uri.substring(7) +
  "/?seed=" +
  vineyard.location +
  "-" +
  Math.abs(vineyard.elevation) +
  "-" +
  (vineyard.elevation < 0 ? "1" : "0") +
  "-" +
  vineyard.soil +
  "-" +
  vineyard.xp;

const Outcome: FC<any> = ({ uri }) => {
  return (
    <>
      <TokenFrame src={defaultUri(uri.newUri)} frameBorder="0" />
      <br />
      <VoteBar
        votesFor={BigNumber.from(uri.votesFor)}
        votesAgainst={BigNumber.from(uri.votesAgainst)}
        completed={uri.completed}
      />
      <div>
        <b>New URI:</b> {uri.newUri}
      </div>
      <div>
        <b>New Artist:</b> {uri.artist}
      </div>
      <br />
    </>
  );
};

const InProgress: FC<any> = ({ uri, bottles, vineyards }) => {
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();
  const [bottleId, setBottleId] = useState("Token ID #");
  const [viewId, setViewId] = useState("Select a token to preview");
  const [timeStatus, setTimeStatus] = useState(0);
  const [viewUri, setViewUri] = useState(defaultUri(uri.newUri));

  const now = Date.now() / 1000;
  const voteEnds = parseInt(uri.startTimestamp) + 1.5 * DAY;
  const completedAt = parseInt(uri.startTimestamp) + 2 * DAY;

  const passing = BigNumber.from(uri.votesFor).gt(BigNumber.from(uri.votesAgainst));

  const filteredBottles = bottles.filter((bottle: any) => !uri.votes.includes(bottle.tokenId));

  const [ensData, setEns] = useState<null | string>();
  getEns(uri.artist).then((x) => {
    if (x) setEns(x);
  });

  const { openModal, closeModal }: any = useContext(ModalContext);

  const sendSupport = async () => {
    openModal();
    const tx = await support(signer, Number(bottleId), uri.type);
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Support proposal with bottle ${Number(bottleId)}`,
    });

    await tx.wait();
    closeModal();
  };

  const sendRetort = async () => {
    openModal();
    const tx = await retort(signer, Number(bottleId), uri.type);
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: `Retort proposal with bottle ${Number(bottleId)}`,
    });

    await tx.wait();
    closeModal();
  };

  const sendComplete = async () => {
    openModal();
    const tx = await complete(signer, uri.type);
    if (!tx) {
      closeModal();
      return;
    }
    addRecentTransaction({ hash: tx.hash, description: "Complete proposal" });

    await tx.wait();
    closeModal();
  };

  const previewFrame = (event: any) => {
    setViewId(vineyards[event].tokenId);
    if (uri.type == "VINEYARD") setViewUri(vineyardUri(uri.newUri, vineyards[event]));
    if (uri.type == "BOTTLE") setViewUri(bottleUri(uri.newUri, bottles[event]));
  };

  // timer
  useEffect(() => {
    let countdown: number = -1;
    if (voteEnds > now) {
      countdown = Math.round(voteEnds - now);
    } else if (voteEnds < now && now < completedAt) {
      countdown = Math.round(completedAt - now);
    }
    let myInterval = setInterval(() => {
      if (countdown === 0) {
        clearInterval(myInterval);
      } else {
        setTimeStatus(countdown--);
      }
    }, 1000);
    return () => clearInterval(myInterval);
  }, []);

  return (
    <>
      <TokenFrame src={viewUri} frameBorder="0" />
      <br />
      <CenteredSelect value={viewId} onChange={previewFrame}>
        {uri.type == "BOTTLE"
          ? bottles.map((bottle: any, idx: number) => (
              <Select.Option key={bottle.tokenId} value={idx}>
                Token ID {bottle.tokenId}
              </Select.Option>
            ))
          : vineyards.map((vine: any, idx: number) => (
              <Select.Option key={vine.tokenId} value={idx}>
                Token ID {vine.tokenId}
              </Select.Option>
            ))}
      </CenteredSelect>
      <br />
      <VoteBar
        votesFor={BigNumber.from(uri.votesFor)}
        votesAgainst={BigNumber.from(uri.votesAgainst)}
        completed={uri.completed}
      />

      {completedAt > now && (
        <Countdown>
          Ending in {hours(timeStatus)}:{minutes(timeStatus)}:{seconds(timeStatus)}
        </Countdown>
      )}

      <BreakWords>
        <b>New URI:</b> {uri.newUri}
      </BreakWords>
      <BreakWords>
        <b>New Artist:</b> {ensData === undefined ? "..." : ensData === null ? uri.artist : ensData}
      </BreakWords>
      <div>
        {voteEnds > now ? (
          <>
            <CenteredSelect value={bottleId} onChange={(event: any) => setBottleId(event)}>
              {filteredBottles.map((bottle: any) => (
                <Select.Option key={bottle.tokenId} value={bottle.tokenId}>
                  Token ID {bottle.tokenId}
                </Select.Option>
              ))}
            </CenteredSelect>

            <Spaced
              type="primary"
              shape="round"
              onClick={sendSupport}
              disabled={bottleId == "Token ID #"}
            >
              Support
            </Spaced>
            <Spaced
              danger
              type="default"
              shape="round"
              onClick={sendRetort}
              disabled={bottleId == "Token ID #"}
            >
              Retort
            </Spaced>
          </>
        ) : completedAt > now ? (
          passing ? (
            <Spaced type="primary" shape="round" onClick={sendComplete}>
              Finalize
            </Spaced>
          ) : (
            <PaddedFail>Proposal Failed</PaddedFail>
          )
        ) : !uri.completed ? (
          passing ? (
            <PaddedFail>Proposal passed but was never enacted</PaddedFail>
          ) : (
            <PaddedFail>Proposal Failed</PaddedFail>
          )
        ) : (
          <PaddedSuccess>Proposal Enacted</PaddedSuccess>
        )}
      </div>
    </>
  );
};

const Council: FC<CouncilTypes> = ({ newUris, bottles, vineyards }) => {
  const timeNow = Date.now() / 1000;
  return (
    <Page>
      {newUris
        .filter((uri: any) => !(uri.votesFor === "0" && uri.votesAgainst === "0"))
        .map((uri: any) => (
          <div key={uri.startTimestamp}>
            {uri.completed ||
            (timeNow > parseInt(uri.startTimestamp) + 172800 &&
              BigNumber.from(uri.votesAgainst).gt(BigNumber.from(uri.votesFor))) ? (
              <Outcome uri={uri} />
            ) : (
              <InProgress uri={uri} bottles={bottles} vineyards={vineyards} />
            )}
            <hr />
          </div>
        ))}
    </Page>
  );
};

export default Council;
