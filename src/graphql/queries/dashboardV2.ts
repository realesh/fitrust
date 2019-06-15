import gql from 'graphql-tag';

export type UpdateWaterResponse = {
  user?: {
    profile: {
      waterValue: number;
    };
  };
};
export type UpdateWaterVariables = {
  userID: string;
  water: number;
};
export const UPDATE_WATER = gql`
  mutation updateWater($userID: ID, $water: Int) {
    updateUser(
      data: {profile: {update: {waterValue: $water}}}
      where: {id: $userID}
    ) {
      profile {
        waterValue
      }
    }
  }
`;

export type ClaimWaterResponse = {
  claimWaterGoal?: {
    total: number;
  };
};
export type ClaimWaterVariables = {
  userID: string;
};
export const CLAIM_WATER = gql`
  mutation claimWater($userID: String!) {
    claimWaterGoal(id: $userID) {
      total
    }
  }
`;

export type ClaimStepResponse = {
  claimStepsGoal?: {
    total: number;
  };
};
export type ClaimStepVariables = {
  userID: string;
};
export const CLAIM_STEP = gql`
  mutation claimStep($userID: String!) {
    claimStepsGoal(id: $userID) {
      total
    }
  }
`;
