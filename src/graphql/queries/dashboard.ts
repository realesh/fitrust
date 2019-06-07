import gql from 'graphql-tag';

export type UserDashboardData = {
  name: string;
  points: number;
  stepsGoal: number;
  waterGoal: number;
  goalWorkout: number;
  goalIntake: number;
  intakeValue: number;
  workoutValue: number;
  createdAt: string;
  updatedAt: string;
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
        name
        stepsGoal
        waterGoal
        goalWorkout
        goalIntake
        points
        intakeValue
        workoutValue
        createdAt
        updatedAt
      }
    }
  }
`;

export type UpdateIntakeGoalResponse = {
  user?: {
    profile: {
      goalIntake: number;
      goalWorkout: number;
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
      data: {profile: {update: {goalIntake: $intake, goalWorkout: $burnout}}}
      where: {id: $userID}
    ) {
      profile {
        goalIntake
        goalWorkout
      }
    }
  }
`;

export type ResetDailyResponse = {
  user?: {
    profile: {
      intakeValue: number;
      workoutValue: number;
    };
  };
};
export type ResetDailyVariables = {
  userID: string;
  resetValue: number;
};
export const RESET_DAILY_GOAL = gql`
  mutation updateIntake($userID: ID, $resetValue: Int) {
    updateUser(
      data: {
        profile: {update: {intakeValue: $resetValue, workoutValue: $resetValue}}
      }
      where: {id: $userID}
    ) {
      profile {
        intakeValue
        workoutValue
        # NEW
        waterValue
        todayStepClaimed
        todaywaterClaimed
      }
    }
  }
`;
