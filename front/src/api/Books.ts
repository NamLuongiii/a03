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

import type {
    AuthorsDetailData,
    AuthorsDetailParams,
    BooksCreateData,
    BooksDetailData,
    BooksDetailParams,
    BooksListData,
    CategoriesListData,
    CommentsCreateParams,
    DtoCommentDto,
    DtoRatingDto,
    FeaturedListData,
    FeaturedListParams,
    RatingsCreateParams,
} from "./data-contracts";
import {ContentType, HttpClient, type RequestParams} from "./http-client";

export class Books<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags books
   * @name BooksList
   * @summary Get all books
   * @request GET:/books
   */
  booksList = (params: RequestParams = {}) =>
    this.http.request<BooksListData, any>({
      path: `/books`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name BooksCreate
   * @summary Create a new book
   * @request POST:/books
   * @secure
   */
  booksCreate = (
    data: {
      /** Book name */
      name: string;
      /** Description */
      description?: string;
      /** Summary */
      summary?: string;
      /** Category ID */
      category_id?: string;
      /** Author ID */
      author_id?: string;
      /**
       * Cover image
       * @format binary
       */
      cover?: File;
      /** Digital book files */
      files?: File[];
    },
    params: RequestParams = {},
  ) =>
    this.http.request<BooksCreateData, any>({
      path: `/books`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name AuthorsDetail
   * @summary Get an author by ID
   * @request GET:/books/authors/{authorID}
   */
  authorsDetail = (
    { authorId, ...query }: AuthorsDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<AuthorsDetailData, any>({
      path: `/books/authors/${authorId}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name CategoriesList
   * @summary Get all categories
   * @request GET:/books/categories
   */
  categoriesList = (params: RequestParams = {}) =>
    this.http.request<CategoriesListData, any>({
      path: `/books/categories`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name FeaturedList
   * @summary Get featured books
   * @request GET:/books/featured
   */
  featuredList = (query: FeaturedListParams, params: RequestParams = {}) =>
    this.http.request<FeaturedListData, any>({
      path: `/books/featured`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name CommentsCreate
   * @summary Add a comment to a book
   * @request POST:/books/{bookID}/comments
   */
  commentsCreate = (
    { bookId, ...query }: CommentsCreateParams,
    comment: DtoCommentDto,
    params: RequestParams = {},
  ) =>
    this.http.request<any, any>({
      path: `/books/${bookId}/comments`,
      method: "POST",
      body: comment,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name RatingsCreate
   * @summary Add a rating to a book
   * @request POST:/books/{bookID}/ratings
   */
  ratingsCreate = (
    { bookId, ...query }: RatingsCreateParams,
    rating: DtoRatingDto,
    params: RequestParams = {},
  ) =>
    this.http.request<any, any>({
      path: `/books/${bookId}/ratings`,
      method: "POST",
      body: rating,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags books
   * @name BooksDetail
   * @summary Get a book by ID
   * @request GET:/books/{id}
   */
  booksDetail = (
    { id, ...query }: BooksDetailParams,
    params: RequestParams = {},
  ) =>
    this.http.request<BooksDetailData, any>({
      path: `/books/${id}`,
      method: "GET",
      ...params,
    });
}
