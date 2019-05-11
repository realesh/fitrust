import gql from 'graphql-tag';

export type RegisterUserResponse = {
  registerUser: {
    id: string;
    name: string;
    token: string;
  };
};
export type RegisterUserVariables = {
  username: string;
  password: string;
  dob: string;
  name: string;
};
export const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $password: String!
    $dob: String!
    $name: String!
  ) {
    registerUser(
      username: $username
      password: $password
      dob: $dob
      name: $name
    ) {
      id
      token
      name
    }
  }
`;

export type LoginUserResponse = {
  loginUser: {
    id: string;
    name: string;
    token: string;
  };
};
export type LoginUserVariables = {
  username: string;
  password: string;
};
export const LOGIN_USER = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
      token
      name
    }
  }
`;

export type VerifyTokenResponse = {
  verifyToken: {
    id: string;
    name: string;
  };
};
export type VerifyTokenVariables = {
  token: string;
};
export const VERIFY_TOKEN = gql`
  query verifyToken($token: String!) {
    verifyToken(token: $token) {
      id
      name
    }
  }
`;
