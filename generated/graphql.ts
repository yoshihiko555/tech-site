import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from '@vue/composition-api';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z,
   *     compliant with the 'date-time' format outlined in section 5.6 of
   *     the RFC 3339 profile of the ISO 8601 standard for representation
   *     of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The 'Dimension' type represents dimensions as whole numeric values between `1` and `4000`. */
  Dimension: any;
  /** The 'HexColor' type represents color in `rgb:ffffff` string format. */
  HexColor: any;
  /** The 'Quality' type represents quality as whole numeric values between `1` and `100`. */
  Quality: any;
};

/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type Articles = Entry & {
  __typename?: 'Articles';
  category?: Maybe<Categories>;
  content?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<ArticlesLinkingCollections>;
  slug?: Maybe<Scalars['String']>;
  sys: Sys;
  tagsCollection?: Maybe<ArticlesTagsCollection>;
  thumbnail?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesCategoryArgs = {
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesContentArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesSlugArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesTagsCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesThumbnailArgs = {
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/articles) */
export type ArticlesTitleArgs = {
  locale?: Maybe<Scalars['String']>;
};

export type ArticlesCollection = {
  __typename?: 'ArticlesCollection';
  items: Array<Maybe<Articles>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type ArticlesFilter = {
  AND?: Maybe<Array<Maybe<ArticlesFilter>>>;
  OR?: Maybe<Array<Maybe<ArticlesFilter>>>;
  category?: Maybe<CfCategoriesNestedFilter>;
  category_exists?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  content_contains?: Maybe<Scalars['String']>;
  content_exists?: Maybe<Scalars['Boolean']>;
  content_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  content_not?: Maybe<Scalars['String']>;
  content_not_contains?: Maybe<Scalars['String']>;
  content_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  slug?: Maybe<Scalars['String']>;
  slug_contains?: Maybe<Scalars['String']>;
  slug_exists?: Maybe<Scalars['Boolean']>;
  slug_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug_not?: Maybe<Scalars['String']>;
  slug_not_contains?: Maybe<Scalars['String']>;
  slug_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
  tagsCollection_exists?: Maybe<Scalars['Boolean']>;
  thumbnail_exists?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_exists?: Maybe<Scalars['Boolean']>;
  title_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  title_not?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ArticlesLinkingCollections = {
  __typename?: 'ArticlesLinkingCollections';
  commentsCollection?: Maybe<CommentsCollection>;
  entryCollection?: Maybe<EntryCollection>;
};


export type ArticlesLinkingCollectionsCommentsCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};


export type ArticlesLinkingCollectionsEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};

export enum ArticlesOrder {
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

export type ArticlesTagsCollection = {
  __typename?: 'ArticlesTagsCollection';
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  __typename?: 'Asset';
  contentType?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  description?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  height?: Maybe<Scalars['Int']>;
  linkedFrom?: Maybe<AssetLinkingCollections>;
  size?: Maybe<Scalars['Int']>;
  sys: Sys;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['Int']>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  transform?: Maybe<ImageTransformOptions>;
};

export type AssetCollection = {
  __typename?: 'AssetCollection';
  items: Array<Maybe<Asset>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type AssetFilter = {
  AND?: Maybe<Array<Maybe<AssetFilter>>>;
  OR?: Maybe<Array<Maybe<AssetFilter>>>;
  contentType?: Maybe<Scalars['String']>;
  contentType_contains?: Maybe<Scalars['String']>;
  contentType_exists?: Maybe<Scalars['Boolean']>;
  contentType_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentType_not?: Maybe<Scalars['String']>;
  contentType_not_contains?: Maybe<Scalars['String']>;
  contentType_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  description?: Maybe<Scalars['String']>;
  description_contains?: Maybe<Scalars['String']>;
  description_exists?: Maybe<Scalars['Boolean']>;
  description_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  description_not?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  fileName?: Maybe<Scalars['String']>;
  fileName_contains?: Maybe<Scalars['String']>;
  fileName_exists?: Maybe<Scalars['Boolean']>;
  fileName_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  fileName_not?: Maybe<Scalars['String']>;
  fileName_not_contains?: Maybe<Scalars['String']>;
  fileName_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  height?: Maybe<Scalars['Int']>;
  height_exists?: Maybe<Scalars['Boolean']>;
  height_gt?: Maybe<Scalars['Int']>;
  height_gte?: Maybe<Scalars['Int']>;
  height_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  height_lt?: Maybe<Scalars['Int']>;
  height_lte?: Maybe<Scalars['Int']>;
  height_not?: Maybe<Scalars['Int']>;
  height_not_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  size?: Maybe<Scalars['Int']>;
  size_exists?: Maybe<Scalars['Boolean']>;
  size_gt?: Maybe<Scalars['Int']>;
  size_gte?: Maybe<Scalars['Int']>;
  size_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  size_lt?: Maybe<Scalars['Int']>;
  size_lte?: Maybe<Scalars['Int']>;
  size_not?: Maybe<Scalars['Int']>;
  size_not_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  sys?: Maybe<SysFilter>;
  title?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_exists?: Maybe<Scalars['Boolean']>;
  title_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  title_not?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  url?: Maybe<Scalars['String']>;
  url_contains?: Maybe<Scalars['String']>;
  url_exists?: Maybe<Scalars['Boolean']>;
  url_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  url_not?: Maybe<Scalars['String']>;
  url_not_contains?: Maybe<Scalars['String']>;
  url_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  width?: Maybe<Scalars['Int']>;
  width_exists?: Maybe<Scalars['Boolean']>;
  width_gt?: Maybe<Scalars['Int']>;
  width_gte?: Maybe<Scalars['Int']>;
  width_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  width_lt?: Maybe<Scalars['Int']>;
  width_lte?: Maybe<Scalars['Int']>;
  width_not?: Maybe<Scalars['Int']>;
  width_not_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type AssetLinkingCollections = {
  __typename?: 'AssetLinkingCollections';
  articlesCollection?: Maybe<ArticlesCollection>;
  entryCollection?: Maybe<EntryCollection>;
};


export type AssetLinkingCollectionsArticlesCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};


export type AssetLinkingCollectionsEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};

export enum AssetOrder {
  ContentTypeAsc = 'contentType_ASC',
  ContentTypeDesc = 'contentType_DESC',
  FileNameAsc = 'fileName_ASC',
  FileNameDesc = 'fileName_DESC',
  HeightAsc = 'height_ASC',
  HeightDesc = 'height_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
  WidthAsc = 'width_ASC',
  WidthDesc = 'width_DESC'
}

/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/categories) */
export type Categories = Entry & {
  __typename?: 'Categories';
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<CategoriesLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sys: Sys;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/categories) */
export type CategoriesLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/categories) */
export type CategoriesNameArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/categories) */
export type CategoriesSlugArgs = {
  locale?: Maybe<Scalars['String']>;
};

export type CategoriesCollection = {
  __typename?: 'CategoriesCollection';
  items: Array<Maybe<Categories>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type CategoriesFilter = {
  AND?: Maybe<Array<Maybe<CategoriesFilter>>>;
  OR?: Maybe<Array<Maybe<CategoriesFilter>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug?: Maybe<Scalars['String']>;
  slug_contains?: Maybe<Scalars['String']>;
  slug_exists?: Maybe<Scalars['Boolean']>;
  slug_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug_not?: Maybe<Scalars['String']>;
  slug_not_contains?: Maybe<Scalars['String']>;
  slug_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
};

export type CategoriesLinkingCollections = {
  __typename?: 'CategoriesLinkingCollections';
  articlesCollection?: Maybe<ArticlesCollection>;
  entryCollection?: Maybe<EntryCollection>;
};


export type CategoriesLinkingCollectionsArticlesCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};


export type CategoriesLinkingCollectionsEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};

export enum CategoriesOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC'
}

/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type Comments = Entry & {
  __typename?: 'Comments';
  article?: Maybe<Articles>;
  comment?: Maybe<Scalars['String']>;
  contentfulMetadata: ContentfulMetadata;
  email?: Maybe<Scalars['String']>;
  linkedFrom?: Maybe<CommentsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  sys: Sys;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type CommentsArticleArgs = {
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type CommentsCommentArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type CommentsEmailArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type CommentsLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/comments) */
export type CommentsNameArgs = {
  locale?: Maybe<Scalars['String']>;
};

export type CommentsCollection = {
  __typename?: 'CommentsCollection';
  items: Array<Maybe<Comments>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type CommentsFilter = {
  AND?: Maybe<Array<Maybe<CommentsFilter>>>;
  OR?: Maybe<Array<Maybe<CommentsFilter>>>;
  article?: Maybe<CfArticlesNestedFilter>;
  article_exists?: Maybe<Scalars['Boolean']>;
  comment?: Maybe<Scalars['String']>;
  comment_contains?: Maybe<Scalars['String']>;
  comment_exists?: Maybe<Scalars['Boolean']>;
  comment_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  comment_not?: Maybe<Scalars['String']>;
  comment_not_contains?: Maybe<Scalars['String']>;
  comment_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  email?: Maybe<Scalars['String']>;
  email_contains?: Maybe<Scalars['String']>;
  email_exists?: Maybe<Scalars['Boolean']>;
  email_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  email_not?: Maybe<Scalars['String']>;
  email_not_contains?: Maybe<Scalars['String']>;
  email_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
};

export type CommentsLinkingCollections = {
  __typename?: 'CommentsLinkingCollections';
  entryCollection?: Maybe<EntryCollection>;
};


export type CommentsLinkingCollectionsEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};

export enum CommentsOrder {
  EmailAsc = 'email_ASC',
  EmailDesc = 'email_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC'
}

export type ContentfulMetadata = {
  __typename?: 'ContentfulMetadata';
  tags: Array<Maybe<ContentfulTag>>;
};

export type ContentfulMetadataFilter = {
  tags?: Maybe<ContentfulMetadataTagsFilter>;
  tags_exists?: Maybe<Scalars['Boolean']>;
};

export type ContentfulMetadataTagsFilter = {
  id_contains_all?: Maybe<Array<Maybe<Scalars['String']>>>;
  id_contains_none?: Maybe<Array<Maybe<Scalars['String']>>>;
  id_contains_some?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/**
 * Represents a tag entity for finding and organizing content easily.
 *     Find out more here: https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/content-tags
 */
export type ContentfulTag = {
  __typename?: 'ContentfulTag';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Entry = {
  contentfulMetadata: ContentfulMetadata;
  sys: Sys;
};

export type EntryCollection = {
  __typename?: 'EntryCollection';
  items: Array<Maybe<Entry>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type EntryFilter = {
  AND?: Maybe<Array<Maybe<EntryFilter>>>;
  OR?: Maybe<Array<Maybe<EntryFilter>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  sys?: Maybe<SysFilter>;
};

export enum EntryOrder {
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC'
}

export enum ImageFormat {
  /** JPG image format. */
  Jpg = 'JPG',
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  JpgProgressive = 'JPG_PROGRESSIVE',
  /** PNG image format */
  Png = 'PNG',
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  Png8 = 'PNG8',
  /** WebP image format. */
  Webp = 'WEBP'
}

export enum ImageResizeFocus {
  /** Focus the resizing on the bottom. */
  Bottom = 'BOTTOM',
  /** Focus the resizing on the bottom left. */
  BottomLeft = 'BOTTOM_LEFT',
  /** Focus the resizing on the bottom right. */
  BottomRight = 'BOTTOM_RIGHT',
  /** Focus the resizing on the center. */
  Center = 'CENTER',
  /** Focus the resizing on the largest face. */
  Face = 'FACE',
  /** Focus the resizing on the area containing all the faces. */
  Faces = 'FACES',
  /** Focus the resizing on the left. */
  Left = 'LEFT',
  /** Focus the resizing on the right. */
  Right = 'RIGHT',
  /** Focus the resizing on the top. */
  Top = 'TOP',
  /** Focus the resizing on the top left. */
  TopLeft = 'TOP_LEFT',
  /** Focus the resizing on the top right. */
  TopRight = 'TOP_RIGHT'
}

export enum ImageResizeStrategy {
  /** Crops a part of the original image to fit into the specified dimensions. */
  Crop = 'CROP',
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  Fill = 'FILL',
  /** Resizes the image to fit into the specified dimensions. */
  Fit = 'FIT',
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  Pad = 'PAD',
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  Scale = 'SCALE',
  /** Creates a thumbnail from the image. */
  Thumb = 'THUMB'
}

export type ImageTransformOptions = {
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: Maybe<Scalars['HexColor']>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: Maybe<Scalars['Int']>;
  /** Desired image format. Defaults to the original image format. */
  format?: Maybe<ImageFormat>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: Maybe<Scalars['Dimension']>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: Maybe<Scalars['Quality']>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: Maybe<ImageResizeFocus>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: Maybe<ImageResizeStrategy>;
  /** Desired width in pixels. Defaults to the original image width. */
  width?: Maybe<Scalars['Dimension']>;
};

export type Query = {
  __typename?: 'Query';
  articles?: Maybe<Articles>;
  articlesCollection?: Maybe<ArticlesCollection>;
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  categories?: Maybe<Categories>;
  categoriesCollection?: Maybe<CategoriesCollection>;
  comments?: Maybe<Comments>;
  commentsCollection?: Maybe<CommentsCollection>;
  entryCollection?: Maybe<EntryCollection>;
  tags?: Maybe<Tags>;
  tagsCollection?: Maybe<TagsCollection>;
};


export type QueryArticlesArgs = {
  id: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


export type QueryArticlesCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<ArticlesOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ArticlesFilter>;
};


export type QueryAssetArgs = {
  id: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


export type QueryAssetCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<AssetOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<AssetFilter>;
};


export type QueryCategoriesArgs = {
  id: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


export type QueryCategoriesCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<CategoriesOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<CategoriesFilter>;
};


export type QueryCommentsArgs = {
  id: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


export type QueryCommentsCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<CommentsOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<CommentsFilter>;
};


export type QueryEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<EntryOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<EntryFilter>;
};


export type QueryTagsArgs = {
  id: Scalars['String'];
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
};


export type QueryTagsCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<TagsOrder>>>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<TagsFilter>;
};

export type Sys = {
  __typename?: 'Sys';
  environmentId: Scalars['String'];
  firstPublishedAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  publishedAt?: Maybe<Scalars['DateTime']>;
  publishedVersion?: Maybe<Scalars['Int']>;
  spaceId: Scalars['String'];
};

export type SysFilter = {
  firstPublishedAt?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_exists?: Maybe<Scalars['Boolean']>;
  firstPublishedAt_gt?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_gte?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_in?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
  firstPublishedAt_lt?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_lte?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_not?: Maybe<Scalars['DateTime']>;
  firstPublishedAt_not_in?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
  id?: Maybe<Scalars['String']>;
  id_contains?: Maybe<Scalars['String']>;
  id_exists?: Maybe<Scalars['Boolean']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  id_not?: Maybe<Scalars['String']>;
  id_not_contains?: Maybe<Scalars['String']>;
  id_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  publishedAt?: Maybe<Scalars['DateTime']>;
  publishedAt_exists?: Maybe<Scalars['Boolean']>;
  publishedAt_gt?: Maybe<Scalars['DateTime']>;
  publishedAt_gte?: Maybe<Scalars['DateTime']>;
  publishedAt_in?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
  publishedAt_lt?: Maybe<Scalars['DateTime']>;
  publishedAt_lte?: Maybe<Scalars['DateTime']>;
  publishedAt_not?: Maybe<Scalars['DateTime']>;
  publishedAt_not_in?: Maybe<Array<Maybe<Scalars['DateTime']>>>;
  publishedVersion?: Maybe<Scalars['Float']>;
  publishedVersion_exists?: Maybe<Scalars['Boolean']>;
  publishedVersion_gt?: Maybe<Scalars['Float']>;
  publishedVersion_gte?: Maybe<Scalars['Float']>;
  publishedVersion_in?: Maybe<Array<Maybe<Scalars['Float']>>>;
  publishedVersion_lt?: Maybe<Scalars['Float']>;
  publishedVersion_lte?: Maybe<Scalars['Float']>;
  publishedVersion_not?: Maybe<Scalars['Float']>;
  publishedVersion_not_in?: Maybe<Array<Maybe<Scalars['Float']>>>;
};

/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/tags) */
export type Tags = Entry & {
  __typename?: 'Tags';
  contentfulMetadata: ContentfulMetadata;
  linkedFrom?: Maybe<TagsLinkingCollections>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  sys: Sys;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/tags) */
export type TagsLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/tags) */
export type TagsNameArgs = {
  locale?: Maybe<Scalars['String']>;
};


/** [See type definition](https://app.contentful.com/spaces/d3b1looh8iwg/content_types/tags) */
export type TagsSlugArgs = {
  locale?: Maybe<Scalars['String']>;
};

export type TagsCollection = {
  __typename?: 'TagsCollection';
  items: Array<Maybe<Tags>>;
  limit: Scalars['Int'];
  skip: Scalars['Int'];
  total: Scalars['Int'];
};

export type TagsFilter = {
  AND?: Maybe<Array<Maybe<TagsFilter>>>;
  OR?: Maybe<Array<Maybe<TagsFilter>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug?: Maybe<Scalars['String']>;
  slug_contains?: Maybe<Scalars['String']>;
  slug_exists?: Maybe<Scalars['Boolean']>;
  slug_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug_not?: Maybe<Scalars['String']>;
  slug_not_contains?: Maybe<Scalars['String']>;
  slug_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
};

export type TagsLinkingCollections = {
  __typename?: 'TagsLinkingCollections';
  articlesCollection?: Maybe<ArticlesCollection>;
  entryCollection?: Maybe<EntryCollection>;
};


export type TagsLinkingCollectionsArticlesCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};


export type TagsLinkingCollectionsEntryCollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  preview?: Maybe<Scalars['Boolean']>;
  skip?: Maybe<Scalars['Int']>;
};

export enum TagsOrder {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  SlugAsc = 'slug_ASC',
  SlugDesc = 'slug_DESC',
  SysFirstPublishedAtAsc = 'sys_firstPublishedAt_ASC',
  SysFirstPublishedAtDesc = 'sys_firstPublishedAt_DESC',
  SysIdAsc = 'sys_id_ASC',
  SysIdDesc = 'sys_id_DESC',
  SysPublishedAtAsc = 'sys_publishedAt_ASC',
  SysPublishedAtDesc = 'sys_publishedAt_DESC',
  SysPublishedVersionAsc = 'sys_publishedVersion_ASC',
  SysPublishedVersionDesc = 'sys_publishedVersion_DESC'
}

export type CfArticlesNestedFilter = {
  AND?: Maybe<Array<Maybe<CfArticlesNestedFilter>>>;
  OR?: Maybe<Array<Maybe<CfArticlesNestedFilter>>>;
  category_exists?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Scalars['String']>;
  content_contains?: Maybe<Scalars['String']>;
  content_exists?: Maybe<Scalars['Boolean']>;
  content_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  content_not?: Maybe<Scalars['String']>;
  content_not_contains?: Maybe<Scalars['String']>;
  content_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  slug?: Maybe<Scalars['String']>;
  slug_contains?: Maybe<Scalars['String']>;
  slug_exists?: Maybe<Scalars['Boolean']>;
  slug_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug_not?: Maybe<Scalars['String']>;
  slug_not_contains?: Maybe<Scalars['String']>;
  slug_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
  tagsCollection_exists?: Maybe<Scalars['Boolean']>;
  thumbnail_exists?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
  title_contains?: Maybe<Scalars['String']>;
  title_exists?: Maybe<Scalars['Boolean']>;
  title_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  title_not?: Maybe<Scalars['String']>;
  title_not_contains?: Maybe<Scalars['String']>;
  title_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CfCategoriesNestedFilter = {
  AND?: Maybe<Array<Maybe<CfCategoriesNestedFilter>>>;
  OR?: Maybe<Array<Maybe<CfCategoriesNestedFilter>>>;
  contentfulMetadata?: Maybe<ContentfulMetadataFilter>;
  name?: Maybe<Scalars['String']>;
  name_contains?: Maybe<Scalars['String']>;
  name_exists?: Maybe<Scalars['Boolean']>;
  name_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  name_not?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug?: Maybe<Scalars['String']>;
  slug_contains?: Maybe<Scalars['String']>;
  slug_exists?: Maybe<Scalars['Boolean']>;
  slug_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  slug_not?: Maybe<Scalars['String']>;
  slug_not_contains?: Maybe<Scalars['String']>;
  slug_not_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  sys?: Maybe<SysFilter>;
};

export type ArticleFragmentFragment = { __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> };

export type CategoryFragmentFragment = { __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } };

export type TagFragmentFragment = { __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } };

export type GetArticlesQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetArticlesQuery = { __typename?: 'Query', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', total: number, items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }> };

export type GetArticleByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetArticleByIdQuery = { __typename?: 'Query', articles?: Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }> };

export type GetArticleBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetArticleBySlugQuery = { __typename?: 'Query', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }> };

export type SearchArticlesQueryVariables = Exact<{
  value: Scalars['String'];
}>;


export type SearchArticlesQuery = { __typename?: 'Query', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }> };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { __typename?: 'Query', categoriesCollection?: Maybe<{ __typename?: 'CategoriesCollection', items: Array<Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> };

export type GetArticleByCategoryQueryVariables = Exact<{
  slug: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetArticleByCategoryQuery = { __typename?: 'Query', categoriesCollection?: Maybe<{ __typename?: 'CategoriesCollection', items: Array<Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, linkedFrom?: Maybe<{ __typename?: 'CategoriesLinkingCollections', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', total: number, items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }> }>, sys: { __typename?: 'Sys', id: string } }>> }> };

export type AppInitQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;


export type AppInitQuery = { __typename?: 'Query', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }>, categoriesCollection?: Maybe<{ __typename?: 'CategoriesCollection', items: Array<Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }>, tagsCollection?: Maybe<{ __typename?: 'TagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tagsCollection?: Maybe<{ __typename?: 'TagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> };

export type GetArticleByTagQueryVariables = Exact<{
  slug: Scalars['String'];
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetArticleByTagQuery = { __typename?: 'Query', tagsCollection?: Maybe<{ __typename?: 'TagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, linkedFrom?: Maybe<{ __typename?: 'TagsLinkingCollections', articlesCollection?: Maybe<{ __typename?: 'ArticlesCollection', total: number, items: Array<Maybe<{ __typename?: 'Articles', title?: Maybe<string>, content?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string, firstPublishedAt?: Maybe<any>, publishedAt?: Maybe<any> }, thumbnail?: Maybe<{ __typename?: 'Asset', url?: Maybe<string>, description?: Maybe<string> }>, category?: Maybe<{ __typename?: 'Categories', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>, tagsCollection?: Maybe<{ __typename?: 'ArticlesTagsCollection', items: Array<Maybe<{ __typename?: 'Tags', name?: Maybe<string>, slug?: Maybe<string>, sys: { __typename?: 'Sys', id: string } }>> }> }>> }> }>, sys: { __typename?: 'Sys', id: string } }>> }> };

export const CategoryFragmentFragmentDoc = gql`
    fragment categoryFragment on Categories {
  sys {
    id
  }
  name
  slug
}
    `;
export const TagFragmentFragmentDoc = gql`
    fragment tagFragment on Tags {
  sys {
    id
  }
  name
  slug
}
    `;
export const ArticleFragmentFragmentDoc = gql`
    fragment articleFragment on Articles {
  sys {
    id
    firstPublishedAt
    publishedAt
  }
  title
  content
  slug
  thumbnail {
    url
    description
  }
  category {
    ...categoryFragment
  }
  tagsCollection {
    items {
      ...tagFragment
    }
  }
}
    ${CategoryFragmentFragmentDoc}
${TagFragmentFragmentDoc}`;
export const GetArticlesDocument = gql`
    query getArticles($limit: Int = 0, $skip: Int = 0) {
  articlesCollection(order: sys_firstPublishedAt_DESC, limit: $limit, skip: $skip) {
    total
    items {
      ...articleFragment
    }
  }
}
    ${ArticleFragmentFragmentDoc}`;

/**
 * __useGetArticlesQuery__
 *
 * To run a query within a Vue component, call `useGetArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticlesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetArticlesQuery({
 *   limit: // value for 'limit'
 *   skip: // value for 'skip'
 * });
 */
export function useGetArticlesQuery(variables: GetArticlesQueryVariables | VueCompositionApi.Ref<GetArticlesQueryVariables> | ReactiveFunction<GetArticlesQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<GetArticlesQuery, GetArticlesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetArticlesQuery, GetArticlesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetArticlesQuery, GetArticlesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetArticlesQuery, GetArticlesQueryVariables>(GetArticlesDocument, variables, options);
}
export type GetArticlesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetArticlesQuery, GetArticlesQueryVariables>;
export const GetArticleByIdDocument = gql`
    query getArticleById($id: String!) {
  articles(id: $id) {
    ...articleFragment
  }
}
    ${ArticleFragmentFragmentDoc}`;

/**
 * __useGetArticleByIdQuery__
 *
 * To run a query within a Vue component, call `useGetArticleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleByIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetArticleByIdQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetArticleByIdQuery(variables: GetArticleByIdQueryVariables | VueCompositionApi.Ref<GetArticleByIdQueryVariables> | ReactiveFunction<GetArticleByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetArticleByIdQuery, GetArticleByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetArticleByIdQuery, GetArticleByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetArticleByIdQuery, GetArticleByIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetArticleByIdQuery, GetArticleByIdQueryVariables>(GetArticleByIdDocument, variables, options);
}
export type GetArticleByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetArticleByIdQuery, GetArticleByIdQueryVariables>;
export const GetArticleBySlugDocument = gql`
    query getArticleBySlug($slug: String!) {
  articlesCollection(where: {slug: $slug}, limit: 1) {
    items {
      ...articleFragment
    }
  }
}
    ${ArticleFragmentFragmentDoc}`;

/**
 * __useGetArticleBySlugQuery__
 *
 * To run a query within a Vue component, call `useGetArticleBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleBySlugQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetArticleBySlugQuery({
 *   slug: // value for 'slug'
 * });
 */
export function useGetArticleBySlugQuery(variables: GetArticleBySlugQueryVariables | VueCompositionApi.Ref<GetArticleBySlugQueryVariables> | ReactiveFunction<GetArticleBySlugQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetArticleBySlugQuery, GetArticleBySlugQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetArticleBySlugQuery, GetArticleBySlugQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetArticleBySlugQuery, GetArticleBySlugQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetArticleBySlugQuery, GetArticleBySlugQueryVariables>(GetArticleBySlugDocument, variables, options);
}
export type GetArticleBySlugQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetArticleBySlugQuery, GetArticleBySlugQueryVariables>;
export const SearchArticlesDocument = gql`
    query searchArticles($value: String!) {
  articlesCollection(
    where: {OR: [{title_contains: $value}, {content_contains: $value}]}
  ) {
    items {
      ...articleFragment
    }
  }
}
    ${ArticleFragmentFragmentDoc}`;

/**
 * __useSearchArticlesQuery__
 *
 * To run a query within a Vue component, call `useSearchArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchArticlesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useSearchArticlesQuery({
 *   value: // value for 'value'
 * });
 */
export function useSearchArticlesQuery(variables: SearchArticlesQueryVariables | VueCompositionApi.Ref<SearchArticlesQueryVariables> | ReactiveFunction<SearchArticlesQueryVariables>, options: VueApolloComposable.UseQueryOptions<SearchArticlesQuery, SearchArticlesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<SearchArticlesQuery, SearchArticlesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<SearchArticlesQuery, SearchArticlesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<SearchArticlesQuery, SearchArticlesQueryVariables>(SearchArticlesDocument, variables, options);
}
export type SearchArticlesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<SearchArticlesQuery, SearchArticlesQueryVariables>;
export const GetCategoriesDocument = gql`
    query getCategories {
  categoriesCollection(order: sys_firstPublishedAt_DESC) {
    items {
      ...categoryFragment
    }
  }
}
    ${CategoryFragmentFragmentDoc}`;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a Vue component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCategoriesQuery();
 */
export function useGetCategoriesQuery(options: VueApolloComposable.UseQueryOptions<GetCategoriesQuery, GetCategoriesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetCategoriesQuery, GetCategoriesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetCategoriesQuery, GetCategoriesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {}, options);
}
export type GetCategoriesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetArticleByCategoryDocument = gql`
    query getArticleByCategory($slug: String!, $limit: Int = 0, $skip: Int = 0) {
  categoriesCollection(where: {slug: $slug}, limit: 1) {
    items {
      ...categoryFragment
      linkedFrom {
        articlesCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...articleFragment
          }
        }
      }
    }
  }
}
    ${CategoryFragmentFragmentDoc}
${ArticleFragmentFragmentDoc}`;

/**
 * __useGetArticleByCategoryQuery__
 *
 * To run a query within a Vue component, call `useGetArticleByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleByCategoryQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetArticleByCategoryQuery({
 *   slug: // value for 'slug'
 *   limit: // value for 'limit'
 *   skip: // value for 'skip'
 * });
 */
export function useGetArticleByCategoryQuery(variables: GetArticleByCategoryQueryVariables | VueCompositionApi.Ref<GetArticleByCategoryQueryVariables> | ReactiveFunction<GetArticleByCategoryQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetArticleByCategoryQuery, GetArticleByCategoryQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetArticleByCategoryQuery, GetArticleByCategoryQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetArticleByCategoryQuery, GetArticleByCategoryQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetArticleByCategoryQuery, GetArticleByCategoryQueryVariables>(GetArticleByCategoryDocument, variables, options);
}
export type GetArticleByCategoryQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetArticleByCategoryQuery, GetArticleByCategoryQueryVariables>;
export const AppInitDocument = gql`
    query appInit($limit: Int!) {
  articlesCollection(limit: $limit, order: sys_firstPublishedAt_DESC) {
    items {
      ...articleFragment
    }
  }
  categoriesCollection {
    items {
      ...categoryFragment
    }
  }
  tagsCollection {
    items {
      ...tagFragment
    }
  }
}
    ${ArticleFragmentFragmentDoc}
${CategoryFragmentFragmentDoc}
${TagFragmentFragmentDoc}`;

/**
 * __useAppInitQuery__
 *
 * To run a query within a Vue component, call `useAppInitQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppInitQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAppInitQuery({
 *   limit: // value for 'limit'
 * });
 */
export function useAppInitQuery(variables: AppInitQueryVariables | VueCompositionApi.Ref<AppInitQueryVariables> | ReactiveFunction<AppInitQueryVariables>, options: VueApolloComposable.UseQueryOptions<AppInitQuery, AppInitQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AppInitQuery, AppInitQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AppInitQuery, AppInitQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AppInitQuery, AppInitQueryVariables>(AppInitDocument, variables, options);
}
export type AppInitQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AppInitQuery, AppInitQueryVariables>;
export const GetTagsDocument = gql`
    query getTags {
  tagsCollection(order: sys_firstPublishedAt_DESC) {
    items {
      ...tagFragment
    }
  }
}
    ${TagFragmentFragmentDoc}`;

/**
 * __useGetTagsQuery__
 *
 * To run a query within a Vue component, call `useGetTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTagsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetTagsQuery();
 */
export function useGetTagsQuery(options: VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetTagsQuery, GetTagsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetTagsQuery, GetTagsQueryVariables>(GetTagsDocument, {}, options);
}
export type GetTagsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetTagsQuery, GetTagsQueryVariables>;
export const GetArticleByTagDocument = gql`
    query getArticleByTag($slug: String!, $limit: Int = 0, $skip: Int = 0) {
  tagsCollection(where: {slug: $slug}, limit: 1) {
    items {
      ...tagFragment
      linkedFrom {
        articlesCollection(limit: $limit, skip: $skip) {
          total
          items {
            ...articleFragment
          }
        }
      }
    }
  }
}
    ${TagFragmentFragmentDoc}
${ArticleFragmentFragmentDoc}`;

/**
 * __useGetArticleByTagQuery__
 *
 * To run a query within a Vue component, call `useGetArticleByTagQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleByTagQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetArticleByTagQuery({
 *   slug: // value for 'slug'
 *   limit: // value for 'limit'
 *   skip: // value for 'skip'
 * });
 */
export function useGetArticleByTagQuery(variables: GetArticleByTagQueryVariables | VueCompositionApi.Ref<GetArticleByTagQueryVariables> | ReactiveFunction<GetArticleByTagQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetArticleByTagQuery, GetArticleByTagQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetArticleByTagQuery, GetArticleByTagQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetArticleByTagQuery, GetArticleByTagQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetArticleByTagQuery, GetArticleByTagQueryVariables>(GetArticleByTagDocument, variables, options);
}
export type GetArticleByTagQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetArticleByTagQuery, GetArticleByTagQueryVariables>;