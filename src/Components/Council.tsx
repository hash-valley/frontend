import { BigNumber } from "@ethersproject/bignumber";
import { FC, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { Page, TokenFrame, Spaced, CenteredSelect } from "../Styles/Components";
import { ipfs_gateway } from "../Utils/constants";
import styled from "styled-components";
import Select from "rc-select";
import {
  bottleSupport,
  bottleRetort,
  bottleFinalize,
} from "../Utils/bottleContract";
import {
  vineSupport,
  vineRetort,
  vineFinalize,
} from "../Utils/vineyardContract";
import { hours, minutes, seconds } from "../Utils/utils";

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
  border-bottom-left-radius: ${(props) =>
    props.color == "green" ? "5px" : ""};

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

const defaultUri = (uri: string) =>
  ipfs_gateway + uri + "/?seed=" + "0-0-0-0-0"; //TODO: actual values

const bottleUri = (uri: string, bottle: any) =>
  ipfs_gateway + uri + "/?seed=" + "1-0-0-0-0"; //TODO: actual values

const vineyardUri = (uri: string, vineyard: any) =>
  ipfs_gateway +
  uri +
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
  const wallet = useWallet();
  const [bottleId, setBottleId] = useState("Token ID #");
  const [viewId, setViewId] = useState("Select a token to preview");
  const [timeStatus, setTimeStatus] = useState(0);
  const [viewUri, setViewUri] = useState(defaultUri(uri.newUri));

  const now = Date.now() / 1000;
  const voteEnds = parseInt(uri.startTimestamp) + 36 * 60 * 60;
  const completedAt = parseInt(uri.startTimestamp) + 48 * 60 * 60;

  const filteredBottles = bottles.filter(
    (bottle: any) => !uri.votes.includes(bottle.tokenId)
  );

  const support = () => {
    if (uri.type == "VINEYARD") {
      vineSupport(wallet, Number(bottleId));
    } else if (uri.type == "BOTTLE") {
      bottleSupport(wallet, Number(bottleId));
    }
  };

  const retort = () => {
    if (uri.type == "VINEYARD") {
      vineRetort(wallet, Number(bottleId));
    } else if (uri.type == "BOTTLE") {
      bottleRetort(wallet, Number(bottleId));
    }
  };

  const finalize = () => {
    if (uri.type == "VINEYARD") {
      vineFinalize(wallet);
    } else if (uri.type == "BOTTLE") {
      bottleFinalize(wallet);
    }
  };

  const previewFrame = (event: any) => {
    setViewId(vineyards[event].tokenId);
    if (uri.type == "VINEYARD")
      setViewUri(vineyardUri(uri.newUri, vineyards[event]));
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
      <Countdown>
        Ending in {hours(timeStatus)}:{minutes(timeStatus)}:
        {seconds(timeStatus)}
      </Countdown>
      <div>
        <b>New URI:</b> {uri.newUri}
      </div>
      <div>
        <b>New Artist:</b> {uri.artist}
      </div>
      <div>
        {voteEnds > now ? (
          <>
            <CenteredSelect
              value={bottleId}
              onChange={(event: any) => setBottleId(event)}
            >
              {filteredBottles.map((bottle: any) => (
                <Select.Option key={bottle.tokenId} value={bottle.tokenId}>
                  Token ID {bottle.tokenId}
                </Select.Option>
              ))}
            </CenteredSelect>

            <Spaced
              type="default"
              shape="round"
              onClick={support}
              disabled={bottleId == "Token ID #"}
            >
              Support
            </Spaced>
            <Spaced
              danger
              type="default"
              shape="round"
              onClick={retort}
              disabled={bottleId == "Token ID #"}
            >
              Retort
            </Spaced>
          </>
        ) : completedAt > now ? (
          <Spaced type="default" shape="round" onClick={finalize}>
            Finalize
          </Spaced>
        ) : null}
      </div>
    </>
  );
};

const Council: FC<CouncilTypes> = ({ newUris, bottles, vineyards }) => {
  return (
    <Page>
      {newUris.map((uri: any) => (
        <>
          {uri.completed ||
          (Date.now() / 1000 > parseInt(uri.startTimestamp) + 172800 &&
            BigNumber.from(uri.votesAgainst).gt(
              BigNumber.from(uri.votesFor)
            )) ? (
            <Outcome uri={uri} />
          ) : (
            <InProgress uri={uri} bottles={bottles} vineyards={vineyards} />
          )}
          <hr />
        </>
      ))}
    </Page>
  );
};

export default Council;