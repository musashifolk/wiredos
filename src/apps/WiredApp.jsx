import { useEffect, useState } from "react";
import { Search, ExternalLink } from "lucide-react";

export default function WiredApp() {
  const [query, setQuery] = useState("Serial Experiments Lain");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    searchWikipedia("Serial Experiments Lain");
  }, []);

  async function searchWikipedia(searchTerm) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
          searchTerm
        )}&format=json&origin=*`
      );

      const data = await response.json();
      const searchResults = data?.query?.search ?? [];

      setResults(searchResults);

      if (searchResults[0]?.title) {
        loadSummary(searchResults[0].title);
      } else {
        setSummary(null);
      }
    } catch {
      setError("failed to reach the wired");
    } finally {
      setLoading(false);
    }
  }

  async function loadSummary(title) {
    try {
      setLoading(true);
      setSelectedTitle(title);

      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      const data = await response.json();
      setSummary(data);
    } catch {
      setError("could not load summary");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchWikipedia(query);
  }

  return (
    <div className="app-shell wired-app">
      <div className="app-glitch-overlay" />

      <form className="wired-searchbar" onSubmit={handleSubmit}>
        <Search size={16} />
        <input
          className="wired-search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search the wired..."
        />
      </form>

      <div className="wired-browser-layout">
        <aside className="wired-results">
          {results.map((item) => (
            <button
              key={item.pageid}
              type="button"
              className={`wired-result-item ${
                selectedTitle === item.title ? "active" : ""
              }`}
              onClick={() => loadSummary(item.title)}
            >
              {item.title}
            </button>
          ))}
        </aside>

        <section className="wired-viewer">
          {loading && <div className="wired-loading">loading signal...</div>}
          {error && <div className="wired-error">{error}</div>}

          {!loading && summary && (
            <>
              <div className="wired-viewer-head">
                <div>
                  <div className="wired-heading">{summary.title}</div>
                  {summary.description ? (
                    <div className="wired-subheading">{summary.description}</div>
                  ) : null}
                </div>

                {summary.content_urls?.desktop?.page ? (
                  <a
                    className="wired-external"
                    href={summary.content_urls.desktop.page}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={14} />
                    article
                  </a>
                ) : null}
              </div>

              {summary.thumbnail?.source ? (
                <img
                  className="wired-thumbnail"
                  src={summary.thumbnail.source}
                  alt={summary.title}
                />
              ) : null}

              <div className="wired-extract">{summary.extract}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}