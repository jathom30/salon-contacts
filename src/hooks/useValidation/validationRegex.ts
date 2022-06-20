export const validationRegEx = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  // credit card must contains only numbers, no white space
  'credit-card':
    /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14})$/,
  // password must contain at least one number, capital letter, lowercase letter, and special character
  // password must be at least 6 characters long
  password:
    /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/,
  // zip code must either be five numbers long or 5 numbers followed by a '-' and 4 numbers
  'zip-code': /(^\d{5}$)|(^\d{5}-\d{4}$)/,
  // cannot include country code, 10 digits with or without "-", ".", or " " between number groupings
  'phone-number': /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
}
