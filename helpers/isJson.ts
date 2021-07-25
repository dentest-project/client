const isJson = (s: string): boolean => {
  try {
    JSON.parse(s)

    return true
  } catch (e) {
    return false
  }
}

export default isJson

