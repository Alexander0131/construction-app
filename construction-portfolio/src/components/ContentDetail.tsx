import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { apiPageAddCount } from "../service/api";
import type { ContentType } from "../service/api";
import { getSingleContent } from "../lib/content";
import type { INormalizedContent } from "../service/types";

function DetailSkeleton() {
  return (
    <>
      <Navbar />
      <div className="animate-pulse">
        <div className="h-screen bg-gray-200" />
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="h-10 sm:h-12 w-48 sm:w-64 bg-gray-200 rounded mb-6" />
          <div className="h-5 w-full bg-gray-200 rounded mb-4" />
          <div className="h-5 w-11/12 bg-gray-200 rounded mb-4" />
          <div className="h-5 w-9/12 bg-gray-200 rounded" />
        </div>
      </div>
      <Footer />
    </>
  );
}

function NotFoundState({ label }: { label: string }) {
  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">{label} Not Found</h2>
      </div>
      <Footer />
    </>
  );
}

export default function ContentDetail({ type, label }: { type: ContentType; label: string }) {
  const { id: contentId = "" } = useParams();
  const countedRef = useRef(false);

  const [item, setItem] = useState<INormalizedContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      try {
        const res = await getSingleContent(type, contentId);
        if (cancelled) return;

        if (res && !countedRef.current) {
          countedRef.current = true;
          apiPageAddCount(res.contentId);
        }

        setItem(res);
      } catch (error) {
        console.error(`Failed to load ${type}:`, error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [type, contentId]);

  if (loading) return <DetailSkeleton />;
  if (!item) return <NotFoundState label={label} />;

  return (
    <>
      <Navbar />

      <main className="bg-white">
        <section className="relative h-screen overflow-hidden">
          <img
            src={item.images?.[0]?.url}
            alt={item.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-end pb-16 sm:pb-28">
            <div className="max-w-4xl text-white">
              {item.state && (
                <span className="uppercase tracking-[6px] text-yellow-500 text-xs sm:text-sm">
                  {item.state} Project
                </span>
              )}

              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mt-4 capitalize leading-tight">
                {item.title}
              </h1>

              <p className="mt-6 sm:mt-8 text-base sm:text-xl text-gray-200 max-w-2xl leading-relaxed capitalize">
                {item.description}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-10 sm:gap-16">
            <div className="lg:col-span-4">
              <span className="uppercase text-yellow-600 tracking-[5px] text-xs sm:text-sm">
                Overview
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-6 capitalize leading-tight">
                {item.contentTitle}
              </h2>

              <div className="w-20 h-1 bg-yellow-600 mt-8" />
            </div>

            <div
              className="lg:col-span-8 text-base sm:text-lg leading-8 sm:leading-10 text-gray-700"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        </section>

        <section>
          <img
            src={item.images?.[1]?.url || item.images?.[0]?.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-[50vh] sm:h-[80vh] object-cover"
          />
        </section>

        {item.quote && (
          <section className="bg-[#0f172a] py-20 sm:py-32">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-light text-white leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mt-12" />
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
            <div>
              <span className="uppercase text-yellow-600 tracking-[5px] text-xs sm:text-sm">
                Quality Construction
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold mt-6 mb-8 capitalize">
                {item.contentTitleTwo}
              </h2>

              <p
                className="text-base sm:text-lg leading-9 text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.contentTwo }}
              />
            </div>

            {item.images?.[2]?.url && (
              <img
                src={item.images[2].url}
                alt={item.title}
                loading="lazy"
                className="rounded-xl shadow-2xl object-cover h-[350px] sm:h-[500px] w-full"
              />
            )}
          </div>
        </section>

        <section className="bg-yellow-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28 text-center">
            <span className="uppercase tracking-[5px] text-xs sm:text-sm">Let's Build Together</span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mt-6 text-black">
              Ready To Start Your Next Project?
            </h2>

            <p className="max-w-3xl mx-auto mt-6 sm:mt-8 text-base sm:text-xl text-black/80">
              Whether residential, commercial, or industrial, we deliver projects with unmatched
              attention to quality, safety, and detail.
            </p>

            <Link
              to="/contact"
              className="inline-block mt-10 sm:mt-12 px-8 sm:px-10 py-3 sm:py-4 bg-black text-white rounded-full hover:scale-105 transition"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
