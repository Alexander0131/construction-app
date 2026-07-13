import {
  getSinglePost,
  getSingleProject,
  updatePostApi,
  updateProjectApi,
  type ContentType,
} from "../service/api";
import type { INormalizedContent, IPostData, IProjectData } from "../service/types";

/** Backend field name for the title, which differs between posts and projects. */
export const TITLE_FIELD: Record<ContentType, string> = {
  post: "postTitle",
  project: "projectTitle",
};

function normalizePost(post: IPostData): INormalizedContent {
  return {
    _id: post._id,
    contentId: post.postId,
    title: post.postTitle,
    description: post.description,
    contentTitle: post.contentTitle,
    contentTitleTwo: post.contentTitleTwo,
    content: post.content,
    quote: post.quote,
    contentTwo: post.contentTwo,
    images: post.images,
    author: post.author,
    likes: post.likes,
    comments: post.comments,
    createdAt: post.createdAt,
  };
}

function normalizeProject(project: IProjectData): INormalizedContent {
  return {
    _id: project._id,
    contentId: project.projectId,
    title: project.projectTitle,
    description: project.description,
    contentTitle: project.contentTitle,
    contentTitleTwo: project.contentTitleTwo,
    content: project.content,
    quote: project.quote,
    contentTwo: project.contentTwo,
    images: project.images,
    author: project.author,
    likes: project.likes,
    comments: project.comments,
    createdAt: project.createdAt,
    state: project.state,
  };
}

export async function getSingleContent(type: ContentType, id: string): Promise<INormalizedContent> {
  if (type === "post") return normalizePost(await getSinglePost(id));
  return normalizeProject(await getSingleProject(id));
}

export async function updateContent(type: ContentType, id: string, formData: FormData) {
  return type === "post" ? updatePostApi(id, formData) : updateProjectApi(id, formData);
}
