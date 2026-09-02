export type JsonRpcId = string | number | null

export interface JsonRpcRequest<TParams> {
  jsonrpc: '2.0'
  id: string
  method: string
  params?: TParams
}

export interface JsonRpcErrorPayload {
  code: number
  message: string
  data?: unknown
}

export interface JsonRpcSuccessResponse<TResult> {
  jsonrpc: '2.0'
  id: JsonRpcId
  result: TResult
}

export interface JsonRpcFailureResponse {
  jsonrpc: '2.0'
  id: JsonRpcId
  error: JsonRpcErrorPayload
}
