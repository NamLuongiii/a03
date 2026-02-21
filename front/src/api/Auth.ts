/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  DtoRequestChangePassword,
  DtoResetPassword,
  DtoVerifyOTP,
  ModelsAccount,
  TypesCommonResponse,
  TypesLoginRequest,
  TypesSignUpDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags auth
   * @name AskResetPasswordCreate
   * @summary send otp to email ask change password
   * @request POST:/auth/ask-reset-password
   */
  askResetPasswordCreate = (
    request: DtoRequestChangePassword,
    params: RequestParams = {},
  ) =>
    this.http.request<any, any>({
      path: `/auth/ask-reset-password`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name LoginCreate
   * @summary Login user by name
   * @request POST:/auth/login
   */
  loginCreate = (login: TypesLoginRequest, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/auth/login`,
      method: "POST",
      body: login,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name GetAuth
   * @summary Get current user info
   * @request GET:/auth/me
   * @secure
   */
  getAuth = (params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/auth/me`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name ResetPasswordCreate
   * @summary change password with the singed token
   * @request POST:/auth/reset-password
   */
  resetPasswordCreate = (
    reset_password: DtoResetPassword,
    params: RequestParams = {},
  ) =>
    this.http.request<any, any>({
      path: `/auth/reset-password`,
      method: "POST",
      body: reset_password,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name SignupCreate
   * @summary create a user
   * @request POST:/auth/signup
   */
  signupCreate = (user: TypesSignUpDto, params: RequestParams = {}) =>
    this.http.request<
      TypesCommonResponse & {
        data?: ModelsAccount;
      },
      any
    >({
      path: `/auth/signup`,
      method: "POST",
      body: user,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name VerifyOtpCreate
   * @summary Verify OTP
   * @request POST:/auth/verify-OTP
   */
  verifyOtpCreate = (verifyOTP: DtoVerifyOTP, params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/auth/verify-OTP`,
      method: "POST",
      body: verifyOTP,
      type: ContentType.Json,
      ...params,
    });
}
