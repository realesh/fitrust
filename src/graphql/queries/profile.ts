import gql from 'graphql-tag';

export type Badge = {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
};

export type UserProfileData = {
  name: string;
  dob: string;
  titleFirst: string;
  titleMiddle: string;
  titleLast: string;
  points: number;
  badges: Array<Badge>;
  bmi: number;
};
export type UserProfileResponse = {
  user?: {
    profile: UserProfileData;
  };
};
export type UserProfileVariables = {
  userID: string;
};
export const USER_PROFILE = gql`
  query user($userID: ID) {
    user(where: {id: $userID}) {
      profile {
        name
        dob
        titleFirst
        titleMiddle
        titleLast
        points
        badges {
          id
          name
          desc
          imageUrl
        }
        bmi
      }
    }
  }
`;

export type UpdateBMIResponse = {
  user?: {
    profile: {
      bmi: number;
    };
  };
};
export type UpdateBMIVariables = {
  userID: string;
  bmi: number;
};
export const UPDATE_BMI = gql`
  mutation updateBMI($userID: ID, $bmi: Int) {
    updateUser(data: {profile: {update: {bmi: $bmi}}}, where: {id: $userID}) {
      profile {
        bmi
      }
    }
  }
`;
