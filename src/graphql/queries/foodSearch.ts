import gql from 'graphql-tag';

export type UpdateIntakeResponse = {
  user?: {
    profile: {
      intakeValue: number;
    };
  };
};
export type UpdateIntakeVariables = {
  userID: string;
  intake: number;
};
export const UPDATE_INTAKE = gql`
  mutation updateIntake($userID: ID, $intake: Int) {
    updateUser(
      data: {profile: {update: {intakeValue: $intake}}}
      where: {id: $userID}
    ) {
      profile {
        intakeValue
      }
    }
  }
`;
