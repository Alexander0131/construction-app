import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Posts from "./pages/Posts";
import SingleProject from "./pages/SingleProject";
import SinglePost from "./pages/SinglePost";
import NotFoundPage from "./pages/NotFoundPage";

import AdminHomePage from "./admin";
import AdminSignIn from "./admin/pages/SignIn";
import Dashboard from "./admin/pages/Dashboard";
import AddPage from "./admin/pages/AddPage";
import ListPage from "./admin/pages/List";
import Messages from "./admin/pages/Messages";
import ContentPage from "./admin/pages/ContentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />

        <Route path="projects" element={<Projects />} />
        <Route path="project/:id" element={<SingleProject />} />
        <Route path="posts" element={<Posts />} />
        <Route path="post/:id" element={<SinglePost />} />

        <Route path="contact" element={<Contact />} />

        <Route path="admin/sign-in/*" element={<AdminSignIn />} />

        <Route
          path="admin/company"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add" element={<AddPage />} />
          <Route path="list" element={<ListPage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="post/:id" element={<ContentPage type="post" />} />
          <Route path="project/:id" element={<ContentPage type="project" />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
