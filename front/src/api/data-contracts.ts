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

export interface DtoCommentDto {
  text?: string;
  title?: string;
}

export interface DtoRatingDto {
  rating?: number;
}

export interface DtoRequestChangePassword {
  email?: string;
}

export interface DtoResetPassword {
  email?: string;
  new_password?: string;
  token?: string;
}

export interface DtoVerifyOTP {
  email?: string;
  otp?: string;
}

export interface ModelsAccount {
  created_at?: string;
  email?: string;
  id?: number;
  name?: string;
  profile?: ModelsProfile;
  updated_at?: string;
}

export interface ModelsAuthor {
  country?: string;
  created_at?: string;
  id?: string;
  name?: string;
  summary?: string;
  updated_at?: string;
}

export interface ModelsBook {
  author?: ModelsAuthor;
  author_id?: string;
  /** Relationships */
  category?: ModelsCategory;
  category_id?: string;
  cover?: ModelsImage;
  cover_id?: number;
  created_at?: string;
  created_by?: number;
  creator?: ModelsAccount;
  description?: string;
  digital_books?: ModelsDigitalBook[];
  download_nums?: number;
  id?: string;
  is_hidden?: boolean;
  name?: string;
  rating_avg?: number;
  rating_count?: number;
  series?: ModelsBookSeries;
  series_id?: string;
  summary?: string;
  updated_at?: string;
  view_nums?: number;
}

export interface ModelsBookSeries {
  created_at?: string;
  id?: string;
  name?: string;
  updated_at?: string;
}

export interface ModelsCategory {
  created_at?: string;
  id?: string;
  name?: string;
  updated_at?: string;
}

export interface ModelsComment {
  account?: ModelsAccount;
  account_id?: number;
  /** Relationships */
  book?: ModelsBook;
  book_id?: string;
  content?: string;
  created_at?: string;
  id?: number;
  title?: string;
  updated_at?: string;
}

export interface ModelsDigitalBook {
  /** Relationships */
  book?: ModelsBook;
  book_id?: string;
  created_at?: string;
  file_size?: number;
  file_type?: string;
  id?: number;
  name?: string;
  updated_at?: string;
  url?: string;
}

export interface ModelsImage {
  id?: number;
  md?: string;
  sm?: string;
  xs?: string;
}

export interface ModelsProfile {
  account_id?: number;
  avatar?: string;
  bio?: string;
  created_at?: string;
  full_name?: string;
  id?: number;
  updated_at?: string;
}

export interface TypesCommonResponse {
  data?: any;
  message?: string;
  success?: boolean;
}

export interface TypesLoginRequest {
  email: string;
  password: string;
}

export interface TypesPaginationData {
  items?: any;
  page?: number;
  size?: number;
  total?: number;
}

export interface TypesSignUpDto {
  email: string;
  name: string;
  password: string;
}

export type SignupCreateData = TypesCommonResponse & {
  data?: ModelsAccount;
};

export interface BooksListParams {
  /** Page size */
  size?: number;
  /** Page number */
  page?: number;
  /** Category ID */
  category?: string;
  /** Search keyword */
  search?: string;
}

export type BooksListData = TypesCommonResponse & {
  data?: TypesPaginationData;
};

export type BooksCreateData = TypesCommonResponse & {
  data?: ModelsBook;
};

export interface AuthorsDetailParams {
  /** Author ID */
  authorId: string;
}

export type AuthorsDetailData = TypesCommonResponse & {
  data?: ModelsAuthor;
};

export type CategoriesListData = TypesCommonResponse & {
  data?: ModelsCategory;
};

export interface FeaturedListParams {
  /** recommender */
  recommender: string;
}

export type FeaturedListData = TypesCommonResponse & {
  data?: ModelsBook;
};

export interface CommentsCreateParams {
  /** Book ID */
  bookId: string;
}

export interface RatingsCreateParams {
  /** Book ID */
  bookId: string;
}

export interface BooksDetailParams {
  /** Book ID */
  id: string;
}

export type BooksDetailData = TypesCommonResponse & {
  data?: ModelsBook;
};

export interface CommentsListParams {
  /** Book ID */
  id: string;
}

export type CommentsListData = TypesCommonResponse & {
  data?: ModelsComment[];
};
