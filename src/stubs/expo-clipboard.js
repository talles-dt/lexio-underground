export async function getStringAsync() {
  return navigator.clipboard.readText();
}
export function setString(text) {
  navigator.clipboard.writeText(text);
}
export function setStringAsync(text) {
  return navigator.clipboard.writeText(text);
}
