import axios from 'axios'
import { KetalJsonRpcError, KetalTransportError } from './errors'
import type {
  JsonRpcFailureResponse,
  JsonRpcRequest,
  JsonRpcSuccessResponse
} from './types'

const JSON_RPC_VERSION = '2.0'

const createRequestId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object'

const isJsonRpcSuccessResponse = <TResult>(value: unknown): value is JsonRpcSuccessResponse<TResult> =>
  isRecord(value) && value.jsonrpc === JSON_RPC_VERSION && 'result' in value

const isJsonRpcFailureResponse = (value: unknown): value is JsonRpcFailureResponse =>
  isRecord(value) &&
  value.jsonrpc === JSON_RPC_VERSION &&
  isRecord(value.error) &&
  typeof value.error.code === 'number' &&
  typeof value.error.message === 'string'

const assertMatchingResponseId = (requestId: string, responseId: JsonRpcSuccessResponse<unknown>['id']): void => {
  if (responseId !== requestId) {
    throw new KetalTransportError('Ketal returned a JSON-RPC response for another request')
  }
}

export const callKetalMethod = async <TParams extends object, TResult>(
  method: string,
  params: TParams
): Promise<TResult> => {
  const request: JsonRpcRequest<TParams> = {
    jsonrpc: JSON_RPC_VERSION,
    id: createRequestId(),
    method,
    params
  }

  try {
    const response = await axios.post<unknown>(KETAL_URL, request, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (isJsonRpcFailureResponse(response.data)) {
      const { error } = response.data

      throw new KetalJsonRpcError(error.message, error.code, error.data)
    }

    if (!isJsonRpcSuccessResponse<TResult>(response.data)) {
      throw new KetalTransportError('Ketal returned an invalid JSON-RPC response')
    }

    assertMatchingResponseId(request.id, response.data.id)

    return response.data.result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new KetalTransportError(error.message, error.response?.status ?? 502, error)
    }

    throw error
  }
}
