import Axios, { Method, AxiosInstance } from 'axios';

const backendUrl = 'http://localhost:8080';

class ApiClient {
  private axios: AxiosInstance;

  private async req<T>(
    method: Method,
    url: string,
    headers?: any,
    body?: any,
    params?: any,
  ): Promise<T> {
    const res = (
      await this.axios.request({ method, url, data: body, params, headers })
    ).data;

    console.log('REQUEST RESPONSE:', res);

    return res;
  }

  constructor() {
    this.axios = Axios.create({
      baseURL: backendUrl,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export const API = new ApiClient();
