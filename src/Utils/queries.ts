import { gql } from "@apollo/client";

export const VINEPROTOCOL_QUERY = gql`
  query GetVineyardProtocol {
    vineProtocol(id: "0") {
      gameStarted
      maxVineyards
      mintedVineyards
    }
  }
`;

export const GIVEAWAY_QUERY = gql`
  query GetAccount($userAddress: Bytes!) {
    account(id: $userAddress) {
      giveawayBalance
      giveawayAllowance
    }
  }
`;

export const ACCOUNT_QUERY = gql`
  query GetAccount($userAddress: Bytes!) {
    account(id: $userAddress) {
      bottles {
        tokenId
        attributes
        inCellar
        canEnterCellar
        spoiled
      }
      vineyards {
        tokenId
        xp
        soil
        seasonsPlanted
        seasonsHarvested
        sprinklerExpires
        bottles {
          id
        }
        elevation
        location
      }
      vinegarBalance
    }
  }
`;

export const VINEYARD_QUERY = gql`
  query GetVineyard($id: String!) {
    vineyard(id: $id) {
      tokenId
      soil
      elevation
      location
      xp
      sprinklerExpires
      owner {
        id
      }
      bottles {
        id
      }
      seasonsHarvested
    }
  }
`;

export const BOTTLE_QUERY = gql`
  query GetBottle($id: String!) {
    bottle(id: $id) {
      tokenId
      stakedAt
      withdrawnAt
      attributes
      inCellar
      canEnterCellar
      spoiled
      burnt
      from {
        id
      }
      owner {
        id
        vinegarBalance
      }
      rejuvenateCost
      rejuvenatedFrom {
        id
      }
      rejuvenatedTo {
        id
      }
    }
  }
`;

export const GET_BOTTLES = gql`
  query GetBottles($address: Bytes!) {
    bottles(where: { owner: $address }) {
      tokenId
    }
  }
`;

export const BOTTLE_URIS = gql`
  query BottleUris {
    newUris(
      orderBy: startTimestamp
      orderDirection: desc
      first: 1
      where: { type: BOTTLE }
    ) {
      startTimestamp
      completed
      votesFor
      votesAgainst
    }
  }
`;

export const VINE_URIS = gql`
  query VineUris {
    newUris(
      orderBy: startTimestamp
      orderDirection: desc
      first: 1
      where: { type: VINEYARD }
    ) {
      startTimestamp
      completed
      votesFor
      votesAgainst
    }
  }
`;

export const NEW_URI = gql`
  query GetUri($type: String!, $address: Bytes!) {
    newUris(
      where: { type: $type }
      orderBy: startTimestamp
      orderDirection: desc
    ) {
      type
      startTimestamp
      votesFor
      votesAgainst
      artist
      newUri
      votes
      completed
    }
    bottles(where: { owner: $address }) {
      tokenId
      attributes
    }
    vineyards(where: { owner: $address }) {
      tokenId
      location
      elevation
      soil
      xp
    }
  }
`;
