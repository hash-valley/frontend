import { gql } from "@apollo/client";

export const VINEPROTOCOL_QUERY = gql`
  query GetVineyardProtocol {
    vineProtocol(id: "0") {
      gameStarted
      startTime
      maxVineyards
      mintedVineyards
      currentPrice
      cellar
      vinegar
      vineyard
      giveaway
      bottle
    }
  }
`;

export const FREE_MINT_QUERY = gql`
  query GetAccount($userAddress: Bytes!) {
    account(id: $userAddress) {
      vineyards {
        tokenId
      }
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
      bottles(orderBy: tokenId, orderDirection: asc) {
        tokenId
        attributes
        inCellar
        canEnterCellar
        spoiled
      }
      vineyards(orderBy: tokenId, orderDirection: asc) {
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

export const MINT_QUERY = gql`
  query GetUri {
    newUris(
      orderBy: version
      orderDirection: desc
      first: 1
      where: { completed: true, type: VINEYARD }
    ) {
      newUri
      version
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
    newUris(
      orderBy: version
      orderDirection: desc
      where: { completed: true, type: VINEYARD }
    ) {
      newUri
      version
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
    newUris(
      orderBy: version
      orderDirection: desc
      where: { completed: true, type: BOTTLE }
    ) {
      newUri
      version
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
    bottles(where: { owner: $address, inCellar: false }) {
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

export const ALCHEMY_DEFENSE_QUERY = gql`
  query Alchemy($address: Bytes!, $timestamp: BigInt!) {
    vineyards(where: { witherDeadline_gt: $timestamp, owner: $address }) {
      tokenId
      witherDeadline
      location
      elevation
      soil
      xp
    }
    account(id: $address) {
      id
      vinegarBalance
      grapeBalance
    }
  }
`;

export const ALCHEMY_VITALIZE_QUERY = gql`
  query Alchemy($address: Bytes!) {
    vineyards(where: { vitalized: false, owner: $address }) {
      tokenId
      location
      elevation
      soil
      xp
    }
    account(id: $address) {
      id
      vinegarBalance
      grapeBalance
    }
  }
`;

export const ALCHEMY_WITHER_QUERY = gql`
  query Alchemy($address: Bytes!) {
    vineyards(where: { witherDeadline: 0, owner_not: $address }) {
      tokenId
      location
      elevation
      soil
      xp
    }
    account(id: $address) {
      id
      vinegarBalance
      grapeBalance
    }
  }
`;
