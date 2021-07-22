// @ts-ignore
import { Logger } from '/opt/Shared/Logger/Logger'

exports.handler = async (event) => {
  let message: string = 'Hello, World3!'
  Logger.log(message)

  const response = {
    statusCode: 200,
    body: JSON.stringify(message),
  }
  return response
}
