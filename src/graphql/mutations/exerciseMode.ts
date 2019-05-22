import gql from 'graphql-tag';

export type ExerciseTypeEnum = 'Peak' | 'Fat Burn' | 'Cardio';

export type UpdateCouponResponse = {
  exerciseCoupons?: {
    id: string;
  };
};
export type UpdateCouponVariables = {
  userID: string;
  type: ExerciseTypeEnum;
  duration: number;
  startTime: string;
  finishTime: string;
  date: string;
};
export const UPDATE_COUPONS = gql`
  mutation updateCoupons(
    $userID: ID
    $type: String!
    $duration: Int!
    $startTime: String!
    $finishTime: String!
    $date: String!
  ) {
    updateUser(
      data: {
        profile: {
          update: {
            exerciseCoupons: {
              create: {
                type: $type
                duration: $duration
                startTime: $startTime
                finishTime: $finishTime
                date: $date
              }
            }
          }
        }
      }
      where: {id: $userID}
    ) {
      profile {
        name
        exerciseCoupons {
          id
        }
      }
    }
  }
`;

export type ExerciseCoupon = {
  id: string;
  type: ExerciseTypeEnum;
  duration: number;
  startTime: string;
  finishTime: string;
  date: string;
};
export type UserCouponsResponse = {
  user?: {
    profile?: {
      bpm: number;
      dob: string;
      exerciseCoupons: Array<ExerciseCoupon>;
    };
  };
};
export type UserCouponsVariables = {
  userID: string;
};
export const USER_COUPONS = gql`
  query userCoupons($userID: ID) {
    user(where: {id: $userID}) {
      profile {
        bpm
        dob
        exerciseCoupons {
          id
          type
          duration
          startTime
          finishTime
          date
        }
      }
    }
  }
`;

export type DeleteCouponResponse = {
  deleteExerciseCoupon?: {
    id: string;
  };
  updateUser?: {
    profile: {
      points: number;
    };
  };
};
export type DeleteCouponVariables = {
  userID: string;
  couponID: string;
  addPoints: number;
};
export const DELETE_COUPON = gql`
  mutation deleteCoupon($userID: ID, $couponID: ID, $addPoints: Int!) {
    deleteExerciseCoupon(where: {id: $couponID}) {
      id
    }
    updateUser(
      data: {profile: {update: {points: $addPoints}}}
      where: {id: $userID}
    ) {
      profile {
        points
      }
    }
  }
`;
