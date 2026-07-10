export class KetalJsonRpcError extends Error {
  code: number
  data?: unknown

  constructor(message: string, code: number, data?: unknown) {
    super(message)

    this.name = 'KetalJsonRpcError'
    this.code = code
    this.data = data
  }
}

export class KetalTransportError extends Error {
  statusCode: number
  originalError?: unknown

  constructor(message: string, statusCode = 502, originalError?: unknown) {
    super(message)

    this.name = 'KetalTransportError'
    this.statusCode = statusCode
    this.originalError = originalError
  }
}

export const isKetalJsonRpcError = (error: unknown): error is KetalJsonRpcError =>
  error instanceof KetalJsonRpcError
