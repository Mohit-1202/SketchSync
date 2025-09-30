import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
    <Navbar/>
    <div className="w-full h-screen overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white flex flex-col items-center justify-center px-6 py-10 space-y-10">
      {/* Title */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
          About SketchSync
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          A modern, collaborative canvas editor built for quick sketches,
          teamwork, and creativity — all in real time.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl space-y-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
            👤 About Me
          </h2>
          <p>
            Hi, I’m a passionate developer who loves building projects that
            combine creativity and technology. This project reflects my interest
            in making design and collaboration tools more accessible to
            everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
            🎯 Why I Created This
          </h2>
          <p>
            The idea was simple: I wanted to create a tool where anyone could
            jump in, sketch ideas, and share them instantly without needing an
            account. Think of it as a mix between a whiteboard and a
            collaborative art pad.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
            🖌️ About SketchSync
          </h2>
          <p>
            SketchSync is a collaborative canvas editor built with React,
            Fabric.js, and Firebase. It supports real-time editing, link sharing
            for instant collaboration, and essential drawing tools like shapes,
            text, and freehand drawing. The goal was to keep it simple yet
            powerful, so users can focus on their ideas instead of the
            interface.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} SketchSync. Built with 💖 and ☕.
      </div>
    </div>
    </>
  );
}
