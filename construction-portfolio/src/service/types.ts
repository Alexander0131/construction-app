// Shared config document used by Hero/Contact for editable site copy.
export interface configType {
  _id: string;
  title: string;
  images: string[];
  description: string;
  message: string;
  children: string[];
  link: string;
  linkwrap: string;
  post: string;
}

export interface contactUser {
  yourName: string;
  yourEmail: string;
  yourSubject: string;
  yourMessage: string;
}

export interface IBtn {
  name: string;
  action: () => void;
}

export type IModeType = "edit" | "display";

export interface IMode {
  mode: IModeType;
}

export interface IPopContent {
  text: string;
  btnA: IBtn;
  btnB: IBtn;
}

export interface MessageState {
  success: boolean;
  message: string;
}

type IContentType = "post" | "project" | "null";

export interface CreateNewProps {
  postType: IContentType;
}

export interface TextEditorProps {
  postType: IContentType;
  height: string;
  value: string;
  mode: IModeType;
  onChange: (html: string) => void;
}

export interface ImageType {
  url: string;
  public_id: string;
}

// export interface PostType {
//   _id: string;
//   postId: string
//   title: string;
//   content: string;
//   images: ImageType[];
//   createdAt: string;
//   updatedAt: string;
// }

export interface IProjectData {
  _id: string;
  projectTitle: string;
  description: string;
  contentTitleTwo: string;
  contentTitle: string;
  projectId: string;
  quote: string;
  state: "ongoing" | "completed" | "new";
  content: string;
  contentTwo: string;
  author: string;
  likes: number;
  comments: number;
  images: ImageType[];
  createdAt: string;
}

export interface GetProjectsResponse {
  projects: IProjectData[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface IPostData {
  _id: string;
  postTitle: string;
  description: string;
  contentTitleTwo: string;
  contentTitle: string;
  postId: string;
  quote: string;
  content: string;
  contentTwo: string;
  author: string;
  likes: number;
  comments: number;
  images: ImageType[];
  createdAt: string;
}

export interface GetPostsResponse {
  posts: IPostData[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ViewCountState {
  pageId: string;
  pageName: string;
  visitcount: number;
  subpage: string[];
}

export interface NotificationProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose?: () => void;
}

export type PostPageType = "main" | "post" | "project";

export interface IPostImage {
  url: string;
  public_id: string;
}

/** The subset of a post/project that's editable as plain text fields. */
export type IPostMini = Pick<
  IPostData,
  "postTitle" | "description" | "contentTitle" | "contentTitleTwo" | "content" | "quote" | "contentTwo"
>;

export interface IEditableImage {
  /** Client-only id for React keys — never sent to the server. */
  id: string;
  /** What the <img> currently shows: a Cloudinary URL or a local blob: preview. */
  url: string;
  /** Present only if this image already exists in the DB. */
  public_id?: string;
  /** Present only if the user picked a new file for this slot. */
  file?: File;
}

/**
 * Describes the final order of a post/project's images, sent to the backend
 * as `imagePlan` (JSON string) alongside the actual files in `newImages`.
 */
export type IImagePlanItem = { type: "existing"; public_id: string } | { type: "new"; fileIndex: number };

/** Post and project shapes normalized to one interface so display/edit UI can be shared. */
export interface INormalizedContent {
  _id: string;
  /** postId or projectId */
  contentId: string;
  title: string;
  description: string;
  contentTitle: string;
  contentTitleTwo: string;
  content: string;
  quote: string;
  contentTwo: string;
  images: ImageType[];
  author: string;
  likes: number;
  comments: number;
  createdAt: string;
  state?: IProjectData["state"];
}
