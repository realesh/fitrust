import gql from 'graphql-tag';

export type UpdateMHRResponse = {
  user?: {
    profile: {
      bpm: number;
    };
  };
};
export type UpdateMHRVariables = {
  userID: string;
  mhr: number;
};
export const UPDATE_MHR = gql`
  mutation updateMHR($userID: ID, $mhr: Int) {
    updateUser(data: {profile: {update: {bpm: $mhr}}}, where: {id: $userID}) {
      profile {
        bpm
      }
    }
  }
`;
