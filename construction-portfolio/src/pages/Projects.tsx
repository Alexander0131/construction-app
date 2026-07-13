import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiPageAddCount } from "../service/api";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const called = useRef(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useProjects();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    apiPageAddCount("projects");
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  const projects = data?.pages.flatMap((page) => page.projects) ?? [];

  if (status === "pending") {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">Loading projects…</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bg-slate-900 py-16 sm:py-24 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-yellow-500 uppercase font-semibold">Portfolio</p>
            <h1 className="text-3xl sm:text-5xl font-bold mt-4">Our Latest Projects</h1>
          </div>

          {projects.length === 0 ? (
            <p className="text-center text-slate-400 mt-16">No projects yet — check back soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-12 sm:mt-16">
              {projects.map((project) => (
                <div key={project._id} className="group overflow-hidden rounded-3xl relative">
                  <img
                    loading="lazy"
                    src={project.images?.[0]?.url}
                    alt={project.projectTitle}
                    className="h-[300px] sm:h-[450px] w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-end p-6 sm:p-8">
                    <div>
                      <span className="uppercase text-xs tracking-wider text-yellow-500">{project.state}</span>
                      <h2 className="text-2xl sm:text-3xl font-bold capitalize mt-1">{project.projectTitle}</h2>
                      <Link to={`/project/${project.projectId}`}>
                        <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded-lg font-semibold">
                          View Project
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div ref={ref} className="h-20 flex justify-center items-center">
            {isFetchingNextPage && "Loading more…"}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
