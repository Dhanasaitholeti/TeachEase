export default function generateResponse(
  success: boolean,
  message: string,
  payload?: any
) {
  return {
    success,
    message,
    payload,
  };
}
