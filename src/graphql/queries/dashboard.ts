import gql from 'graphql-tag';

export type UserDashboardData = {
  points: number;
  stepsGoal: number;
  waterGoal: number;
  intakeWorkout: number;
  goalIntake: number;
};
export type UserDashboardResponse = {
  user?: {
    profile: {
      points: number;
      stepsGoal: number;
      waterGoal: number;
      intakeWorkout: number;
      goalIntake: number;
    };
  };
};
export type UserDashboardVariables = {
  userID: string;
};
export const USER_DASHBOARD = gql`
  query user($userID: ID) {
    user(where: {id: $userID}) {
      profile {
        stepsGoal
        waterGoal
        intakeWorkout
        goalIntake
        points
      }
    }
  }
`;
