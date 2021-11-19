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
      streak
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
