export const setLocal = (key, value) => {
  sessionStorage.setItem(key, value)
}
export const getLocal = (key) => {
  return sessionStorage.getItem(key)
}