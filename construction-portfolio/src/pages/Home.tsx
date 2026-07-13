import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaBuilding, FaHardHat, FaUsers, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiPageAddCount, getProjects } from "../service/api";
import type { IProjectData } from "../service/types";
import PostsProjects from "../components/PostProject";

const SERVICES = [
  {
    icon: <FaBuilding />,
    title: "Commercial Buildings",
    desc: "High-quality commercial and corporate construction solutions.",
  },
  {
    icon: <FaHardHat />,
    title: "Civil Engineering",
    desc: "Professional engineering services for modern infrastructure.",
  },
  {
    icon: <FaUsers />,
    title: "Project Management",
    desc: "Efficient planning and execution for every project phase.",
  },
];

const STATS = [
  { value: "250+", label: "Projects Completed" },
  { value: "120+", label: "Skilled Workers" },
  { value: "15+", label: "Years Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function Home() {
  const called = useRef(false);
  const [recentProjects, setRecentProjects] = useState<IProjectData[]>([]);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    apiPageAddCount("home");

    getProjects(1)
      .then((res) => setRecentProjects(res.projects.slice(0, 3)))
      .catch((error) => console.error("Failed to load recent projects:", error));
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <Hero />

      {/* About */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
              alt="Construction site"
              className="rounded-3xl shadow-2xl h-[300px] sm:h-[450px] lg:h-[600px] w-full object-cover"
            />
            <div className="absolute -bottom-6 -right-4 sm:-bottom-10 sm:-right-6 bg-yellow-500 text-black p-5 sm:p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl sm:text-5xl font-bold">15+</h2>
              <p className="font-semibold mt-1 sm:mt-2 text-sm sm:text-base">Years Experience</p>
            </div>
          </div>

          <div>
            <p className="text-yellow-500 uppercase font-semibold tracking-widest">About DremCons.</p>

            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mt-4 leading-tight">
              Delivering Excellence In Construction Industry
            </h1>

            <p className="mt-6 sm:mt-8 text-slate-600 leading-8 text-base sm:text-lg">
              We specialize in delivering innovative construction solutions with high-quality
              engineering, professional project management, and modern infrastructure development.
            </p>

            <div className="space-y-4 sm:space-y-5 mt-8 sm:mt-10">
              {[
                "Professional and experienced team",
                "Modern equipment and technology",
                "Trusted by hundreds of clients",
              ].map((point) => (
                <div key={point} className="flex items-center gap-4">
                  <FaCheckCircle className="text-yellow-500 text-xl sm:text-2xl shrink-0" />
                  <p className="text-slate-700 text-base sm:text-lg">{point}</p>
                </div>
              ))}
            </div>

            <Link to="/about">
              <button className="mt-8 sm:mt-10 bg-yellow-500 hover:bg-yellow-600 transition px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-black font-semibold flex items-center gap-3">
                Learn More
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h1 className="text-2xl ml-3 font-bold border-b border-amber-600 w-fit">Our Projects, and feeds</h1>
        <PostsProjects/>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-yellow-500 uppercase font-semibold">Our Services</p>
            <h1 className="text-3xl sm:text-5xl font-bold mt-4">What We Offer</h1>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-12 sm:mt-16">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-slate-900 hover:bg-yellow-500 hover:text-black transition-all duration-300 rounded-3xl p-6 sm:p-10 shadow-2xl group"
              >
                <div className="text-5xl sm:text-6xl text-yellow-500 group-hover:text-black">{service.icon}</div>
                <h2 className="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8">{service.title}</h2>
                <p className="mt-4 sm:mt-6 leading-8 text-slate-300 group-hover:text-black">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10 sm:mt-12">
            <Link to="/services">
              <button className="bg-yellow-500 hover:bg-yellow-600 transition px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-black font-semibold flex items-center gap-3">
                Learn More
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </section>

    

      {/* Stats */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-yellow-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <h1 className="text-4xl sm:text-6xl font-bold text-black">{stat.value}</h1>
              <p className="mt-3 sm:mt-4 text-base sm:text-xl font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent projects */}
      {recentProjects.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <p className="text-yellow-500 uppercase font-semibold">Latest Projects</p>
              <h1 className="text-3xl sm:text-5xl font-bold mt-4 text-slate-900">Our Recent Work</h1>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-12 sm:mt-16">
              {recentProjects.map((project) => (
                <div key={project._id} className="rounded-3xl overflow-hidden group relative shadow-2xl">
                  <img
                    src={project.images?.[0]?.url}
                    alt={project.projectTitle}
                    className="h-[300px] sm:h-[450px] w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-6 sm:p-8">
                    <div>
                      <h2 className="text-white text-2xl sm:text-3xl font-bold capitalize">
                        {project.projectTitle}
                      </h2>
                      <Link to={`/project/${project.projectId}`}>
                        <button className="mt-4 sm:mt-5 bg-yellow-500 hover:bg-yellow-600 transition px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-black font-semibold">
                          View Project
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-yellow-500 uppercase font-semibold">Get Started</p>

          <h1 className="text-3xl sm:text-5xl font-bold mt-6 leading-tight">
            Ready To Build Your Dream Project?
          </h1>

          <p className="mt-6 sm:mt-8 text-slate-300 text-base sm:text-lg leading-8">
            Contact our expert team today and let's create modern, durable, and innovative
            construction solutions together.
          </p>

          <Link to="/contact">
            <button className="mt-8 sm:mt-10 bg-yellow-500 hover:bg-yellow-600 transition px-8 sm:px-10 py-4 sm:py-5 rounded-2xl text-black font-bold text-base sm:text-lg">
              Contact Us
            </button>
          </Link>
        </div>
      </section>

      <hr className="border border-gray-400" />
      <Footer />
    </div>
  );
}
