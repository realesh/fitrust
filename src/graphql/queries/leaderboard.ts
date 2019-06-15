import gql from 'graphql-tag';

export type LeaderboardResponse = {
  profiles: Array<UserLeaderboardData>;
};
export type LeaderboardVariables = {};
export const LEADERBOARD_LIST = gql`
  query profiles {
    profiles(orderBy: points_DESC) {
      name
      points
      avatarUrl
      badges {
        imageUrl
      }
      titleFirst
      titleMiddle
      titleLast
    }
  }
`;

export type BadgesImage = {
  imageUrl: 'string';
};

export type UserLeaderboardData = {
  name: string;
  points: number;
  avatarUrl: string;
  titleFirst: string;
  titleMiddle: string;
  titleLast: string;
  badges: Array<BadgesImage>;
};
export type UserLeaderboardResponse = {
  user?: {
    profile: UserLeaderboardData;
  };
};
export type UserLeaderboardVariables = {
  userID: string;
};
export const USER_LEADERBOARD_PROFILE = gql`
  query user($userID: ID) {
    user(where: {id: $userID}) {
      profile {
        name
        points
        avatarUrl
        badges {
          imageUrl
        }
        titleFirst
        titleMiddle
        titleLast
      }
    }
  }
`;
