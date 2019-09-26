import * as Hapi from 'hapi'
import * as Joi from 'joi'
import { verifyUser } from '@auth/features/verifyUser/service'
import {
  storeUserInformation,
  generateAndSendVerificationCode
} from '@auth/features/authenticate/service'
import { generateNonce } from '@auth/features/verifyCode/service'
import { unauthorized } from 'boom'

interface IVerifyUserPayload {
  mobile: string
}

interface IVerifyUserResponse {
  nonce: string
  mobile: string
}

export default async function verifyUserHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<IVerifyUserResponse> {
  const payload = request.payload as IVerifyUserPayload
  let result

  try {
    result = await verifyUser(payload.mobile)
  } catch (err) {
    throw unauthorized()
  }
  const nonce = generateNonce()
  await storeUserInformation(nonce, result.userId, result.scope, result.mobile)

  await generateAndSendVerificationCode(nonce, result)

  const respose: IVerifyUserResponse = {
    mobile: result.mobile,
    nonce
  }
  return respose
}

export const requestSchema = Joi.object({
  mobile: Joi.string()
})

export const responseSchema = Joi.object({
  nonce: Joi.string(),
  mobile: Joi.string()
})
