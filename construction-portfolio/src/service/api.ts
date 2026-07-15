import axios from "axios";
import type {
  contactUser,
  GetPostsResponse,
  GetProjectsResponse,
  IPostData,
  IProjectData,
  MessageState,
  ViewCountState,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

export const apiClient = axios.create({ baseURL: API_URL });

// Lets a component inside <ClerkProvider> hand us a token getter without
// every call site needing to know about Clerk. See src/lib/clerkTokenSync.ts.
let getAuthToken: (() => Promise<string | null>) | null = null;

export function registerAuthTokenGetter(fn: typeof getAuthToken) {
  getAuthToken = fn;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CountPostResponse {
  success: boolean;
  totalPosts: number;
  lastMonthPosts: number;
  currentMonthPosts: number;
  growthPercentage: string;
}

export type ContentType = "post" | "project";

export async function getConfig(item: string) {
  const res = await apiClient.get(`/config/${item}`);
  return res.data;
}

export async function postNewPost(formData: FormData) {
  const res = await apiClient.post("/posts/create-post", formData);
  return res.data;
}

export async function postNewProject(formData: FormData) {
  const res = await apiClient.post("/projects", formData);
  return res.data;
}

export async function getPosts(page: number = 1): Promise<GetPostsResponse> {
  const res = await apiClient.get<GetPostsResponse>(`/posts/post?page=${page}&limit=10`);
  return res.data;
}

export async function getLimitedPosts(limit: number): Promise<IPostData[]> {
  const res = await apiClient.get<{ success: boolean; count: number; posts: IPostData[] }>(
    `/posts/limited?limit=${limit}`
  );
  return res.data.posts;
}

export async function getSinglePost(id: string): Promise<IPostData> {
  const res = await apiClient.get<{ success: boolean; data: IPostData }>(`/posts/single/${id}`);
  return res.data.data;
}

export async function countAllPost(): Promise<CountPostResponse> {
  const res = await apiClient.get<CountPostResponse>("/posts/count");
  return res.data;
}

export async function updatePostApi(postId: string, formData: FormData): Promise<IPostData> {
  const res = await apiClient.patch(`/posts/posts/${postId}`, formData);
  return res.data.post as IPostData;
}

export async function deletePost(id: string) {
  const res = await apiClient.delete(`/posts/${id}`);
  return res.data;
}

export async function getProjects(page: number = 1): Promise<GetProjectsResponse> {
  const res = await apiClient.get<GetProjectsResponse>(`/projects?page=${page}&limit=10`);
  return res.data;
}

export async function getSingleProject(id: string): Promise<IProjectData> {
  const res = await apiClient.get<{ success: boolean; data: IProjectData }>(`/projects/${id}`);
  return res.data.data;
}

export async function updateProjectApi(projectId: string, formData: FormData): Promise<IProjectData> {
  const res = await apiClient.patch(`/projects/${projectId}`, formData);
  return res.data.project as IProjectData;
}

export async function deleteProject(id: string) {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
}

export async function apiPageAddCount(pageId: string): Promise<ViewCountState> {
  const res = await apiClient.put("/count/edit", { pageId });
  return res.data.data;
}

export async function getAllViewsData(): Promise<ViewCountState[]> {
  const res = await apiClient.get("/count/all");
  return res.data.data;
}

export async function sendMessageToApi(messageDetail: contactUser): Promise<MessageState> {
  const res = await apiClient.post("/message/send", messageDetail);
  return res.data.data;
}

export interface ContactMessage extends contactUser {
  _id: string;
  read: boolean;
  createdAt: string;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const res = await apiClient.get<{ success: boolean; count: number; messages: ContactMessage[] }>("/message");
  return res.data.messages;
}
