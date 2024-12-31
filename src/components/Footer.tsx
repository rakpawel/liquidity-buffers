export const Footer = () => {
  return (
    <footer className="border-t border-zinc-800/40 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-3">
        <div className="flex items-center justify-between text-sm">
          <p className="text-zinc-500">
            Built by{" "}
            <a
              href="https://x.com/RaqPawel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200"
            >
              Pawel Rak
            </a>
          </p>
          <nav className="flex items-center gap-8 text-zinc-600">
            <a
              href="https://github.com/rakpawel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors duration-200"
            >
              Github
            </a>
            <a
              href="https://docs.balancer.fi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors duration-200"
            >
              Balancer docs
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
