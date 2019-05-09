export default function parseGraphQLError(error: Error) {
  let graphqlError = error.message;
  let errorMessage = graphqlError
    .split(' ')
    .slice(2)
    .join(' ');
  return errorMessage;
}
