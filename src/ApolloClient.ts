import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://ec2-52-221-179-3.ap-southeast-1.compute.amazonaws.com:4000/',
});

export default client;
