import gql from 'graphql-tag';

export type UpdateWorkoutResponse = {
  user?: {
    profile: {
      workoutValue: number;
    };
  };
};
export type UpdateWorkoutVariables = {
  userID: string;
  workout: number;
};
export const UPDATE_WORKOUT = gql`
  mutation updateWorkout($userID: ID, $workout: Int) {
    updateUser(
      data: {profile: {update: {workoutValue: $workout}}}
      where: {id: $userID}
    ) {
      profile {
        workoutValue
      }
    }
  }
`;
