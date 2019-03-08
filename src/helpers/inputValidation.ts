export function validateEmail(email: string) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateUsername(username: string) {
  // TODO: fetch api and check if username already exist
  return username !== '' && username.length >= 6;
}

export function validatePassword(password: string) {
  let lowerCase = /[a-z]/;
  let upperCase = /[A-Z]/;
  let number = /[0-9]/;
  // check if password has at least 1 uppercase, lowercase, number, and 8 letters
  let valid =
    number.test(password) &&
    lowerCase.test(password) &&
    upperCase.test(password) &&
    password.length >= 6;
  return valid;
}

export function validateText(text: string) {
  return text !== '';
}
