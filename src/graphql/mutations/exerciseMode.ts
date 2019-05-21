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
