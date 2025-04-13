// src/components/Footer.tsx

export function Footer() {
    return (
      <footer className="w-full border-t border-gray-700 py-6 text-center text-sm text-gray-400 bg-black">
        <p>
          &copy; {new Date().getFullYear()} Himay "Mickey" Makhija. Built with ❤️ for biotech innovation.
        </p>
        <div className="mt-2 flex justify-center space-x-4 text-gray-300">
          <a
            href="https://github.com/mknoir"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/himay-makhija-mickey/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400 transition"
          >
            LinkedIn
          </a>
          <a
            href="mailto:himay75@gmail.com"
            className="hover:text-teal-400 transition"
          >
            Contact
          </a>
        </div>
        <p className="mt-2 text-xs text-gray-500 italic">
          This portfolio is a work in progress. Feedback is always welcome!
        </p>
      </footer>
    )
  }
  