import { isKetalJsonRpcError, whoAmI, WhoAmIErrorCode } from '~/api/ketal'
import type { Session } from '~/types'

export default defineEventHandler(async (event): Promise<Session> => {
  const authorization = getHeader(event, 'authorization')

  if (!authorization) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const config = useRuntimeConfig(event)

  try {
    return await whoAmI({
      authorization,
      baseUrl: config.public.ketalUrl as string,
    })
  } catch (error) {
    if (
      isKetalJsonRpcError(error) &&
      error.code === WhoAmIErrorCode.AccessDenied
    ) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to retrieve the authenticated user',
      cause: error,
    })
  }
})
