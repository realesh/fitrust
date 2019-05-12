import gql from 'graphql-tag';
import {UserLeaderboard} from '../../scenes/Leaderboard/data/LeaderboardDataFixtures';

export type LeaderboardResponse = {
  profiles: Array<UserLeaderboard>;
};
export type LeaderboardVariables = {};
export const LEADERBOARD_LIST = gql`
  query profiles {
    profiles(orderBy: points_DESC) {
      name
      points
      avatarUrl
    }
  }
`;

export type UserLeaderboardData = {
  name: string;
  points: number;
  avatarUrl: string;
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
      }
    }
  }
`;
