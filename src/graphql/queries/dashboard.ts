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
    profile: UserDashboardData;
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

export type UpdateIntakeGoalResponse = {
  user?: {
    profile: {
      goalIntake: number;
      intakeWorkout: number;
    };
  };
};
export type UpdateIntakeGoalVariables = {
  userID: string;
  intake: number;
  burnout: number;
};
export const UPDATE_INTAKE_GOAL = gql`
  mutation updateIntake($userID: ID, $intake: Int, $burnout: Int) {
    updateUser(
      data: {profile: {update: {goalIntake: $intake, intakeWorkout: $burnout}}}
      where: {id: $userID}
    ) {
      profile {
        goalIntake
        intakeWorkout
      }
    }
  }
`;
