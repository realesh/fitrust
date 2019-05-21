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
  avatarUrl: string;
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
        avatarUrl
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

export type UpdateProfileResponse = {
  user?: {
    profile: {
      name: string;
    };
  };
};
export type UpdateProfileVariables = {
  userID: string;
  name: string;
  first: string;
  middle: string;
  last: string;
  avatarUrl: string;
};
export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $userID: ID
    $name: String
    $first: String
    $middle: String
    $last: String
    $avatarUrl: String
  ) {
    updateUser(
      data: {
        profile: {
          update: {
            name: $name
            titleFirst: $first
            titleMiddle: $middle
            titleLast: $last
            avatarUrl: $avatarUrl
          }
        }
      }
      where: {id: $userID}
    ) {
      profile {
        name
      }
    }
  }
`;

export type ChangePasswordResponse = {
  user?: {
    id: string;
  };
};
export type ChangePasswordVariables = {
  userID: string;
  newPassword: string;
  oldPassword: string;
};
export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $userID: String!
    $newPassword: String!
    $oldPassword: String!
  ) {
    changePassword(
      id: $userID
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      id
    }
  }
`;

export type BadgeItemRaw = {
  name: string;
  desc: string;
  imageUrl: string;
};
export type BadgesListData = {
  unlocked: number;
  lockedBadges: Array<BadgeItemRaw>;
  userBadges: Array<BadgeItemRaw>;
};
export type BadgesListResponse = {
  badgesList?: BadgesListData;
};
export type BadgesListVariables = {
  userID: string;
};
export const BADGES_LIST = gql`
  query badgesList($userID: String!) {
    badgesList(id: $userID) {
      unlocked
      userBadges {
        name
        imageUrl
        desc
      }
      lockedBadges {
        name
        imageUrl
        desc
      }
    }
  }
`;
