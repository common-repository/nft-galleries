import {client, getErrorResponseMessage} from "spotlight/common/modules/rest-api/client"
import {AxiosResponse, CancelTokenSource} from "axios"
import {RestApi} from "spotlight/common/modules/rest-api/index"
import {Token} from "spotlight/common/modules/tokens"

export type TokenFetchResult = {
  tokens: Token[];
  total?: number;
  batching?: boolean;
}

export type TokenFetchResponse = AxiosResponse<TokenFetchResult>;

function fetchTokens(args: object, cancel?: CancelTokenSource) {
  return client.post("/tokens/feed", args, {
    cancelToken: cancel?.token,
  })
}

function importTokens(args: object, cancel?: CancelTokenSource) {
  return client.post("/tokens/import", args, {
    cancelToken: cancel?.token,
  })
}

export const tokens = {
  events: {
    import: {
      start: "snft/tokens/import/start",
      end: "snft/tokens/import/end",
      success: "snft/tokens/import/success",
      fail: "snft/tokens/import/fail",
    },
    fetch: {
      start: "snft/tokens/fetch/start",
      end: "snft/tokens/fetch/end",
      success: "snft/tokens/fetch/success",
      fail: "snft/tokens/fetch/fail",
    },
    ON_IMPORT_START: "snft/api/import/start",
    ON_IMPORT_SUCCESS: "snft/api/import/success",
    ON_IMPORT_FAIL: "snft/api/import/fail",
    ON_IMPORT_END: "snft/api/import/end",
  },
  async get(options, from = 0, num = 0, cancel?: CancelTokenSource, autoImport?: boolean): Promise<TokenFetchResponse> {
    autoImport = autoImport ?? RestApi.config.autoImportMedia

    document.dispatchEvent(new CustomEvent(tokens.events.fetch.start))

    try {
      // Fetch the tokens
      let response = await fetchTokens({options, from, num}, cancel)

      // If can import and an import is needed
      if (autoImport && response?.data?.needImport) {
        // Import the tokens
        const importResponse = await tokens.import(options)
        // Fetch again
        response = await fetchTokens({options, from, num})
        // Add the batching flag from the import response to the fetch response
        response.data.batching = importResponse.data?.batching ?? false
      }

      document.dispatchEvent(new CustomEvent(tokens.events.fetch.success))
      document.dispatchEvent(new CustomEvent(tokens.events.fetch.end))

      return response
    } catch (error) {
      const message = getErrorResponseMessage(error)
      document.dispatchEvent(new ErrorEvent(tokens.events.fetch.fail, {message}))
      document.dispatchEvent(new CustomEvent(tokens.events.fetch.end))
      throw error
    }
  },
  async import(options, cancel?: CancelTokenSource): Promise<AxiosResponse> {
    document.dispatchEvent(new CustomEvent(tokens.events.import.start))

    try {
      const response = await importTokens({options}, cancel)

      if (!response.data?.success) {
        throw {response}
      }

      document.dispatchEvent(new CustomEvent(tokens.events.import.success, {
        detail: response.data,
      }))
      document.dispatchEvent(new CustomEvent(tokens.events.import.end))

      return response
    } catch (error) {
      const message = getErrorResponseMessage(error)
      document.dispatchEvent(new ErrorEvent(tokens.events.import.fail, {message}))
      document.dispatchEvent(new CustomEvent(tokens.events.import.end))
      throw error
    }
  },
}
