import { notification } from "antd";
import {
  ApplicationPaths,
  QueryParameterNames,
} from "../api-authorization/ApiAuthorizationConstants";
import authService from "../api-authorization/AuthorizeService";

export class AuthorizedApiBase {
  protected transformOptions = async (
    options: RequestInit
  ): Promise<RequestInit> => {
    const token = await authService.getAccessToken();

    options.headers = {
      ...options.headers,
      Pragma: "no-cache",
      Authorization: `Bearer ${token}`,
    };
    return Promise.resolve(options);
  };

  protected transformResult = (
    url_: string,
    _response: Response,
    callback: (_response: Response) => any
  ): any => {
    if (_response.status === 401) {
      const redirectUrl = `${ApplicationPaths.Login}?${
        QueryParameterNames.ReturnUrl
      }=${encodeURI(window.location.href)}`;

      window.location.href = redirectUrl;

      return Promise.reject(_response);
    } else if (_response.status === 403) {
      _response.json().then((_responseText) => {
        notification.error({
          message: _responseText.title,
          description: _responseText.detail,
        });
      });
      return Promise.reject(_response);
    } else if (_response.status === 500) {
      _response.json().then((_responseText) => {
        console.log(_responseText);
        notification.error({
          message: _responseText.title,
          description: _responseText.detail,
        });
      });
    } else if (_response.status === 404) {
      _response.json().then((_responseText) => {
        console.log(_responseText);
        notification.error({
          message: _responseText.title,
          description: _responseText.detail,
        });
      });
    } else if (_response.status === 400) {
      _response.json().then((_responseText) => {
        console.log(_responseText);
        notification.error({
          message: _responseText.title,
          description: _responseText.detail,
        });
      });
    } else {
      return callback(_response);
    }
    return callback(_response);
  };
}
