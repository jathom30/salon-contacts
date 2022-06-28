export const passwordStrength = (password: string)  => {
  const longEnough = password.length >= 6
  const includesLetters = /[a-zA-Z]/g.test(password)
  const includesNumbers = /\d/.test(password)
  const includesSpecialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)

  const cases = [includesLetters, includesNumbers, includesSpecialCharacters]

  if (!longEnough) {
    return 0
  }

  const score = cases.reduce((total, c) => {
    if (c) {
      return total += 1
    }
    return total
  }, 0)

  return score
}