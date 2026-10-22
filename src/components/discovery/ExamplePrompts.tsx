"use client";

export const EXAMPLE_PROMPTS = ["Start a food trading business", "Set up a consulting company", "Launch an online store"];

/* Example prompts populate the input (PRD D03). */
export function ExamplePrompts({
  onPick,
  prompts = EXAMPLE_PROMPTS,
  id = "example-prompts-label",
}: {
  onPick: (prompt: string) => void;
  prompts?: string[];
  id?: string;
}) {
  return (
    <div>
      <p id={id} className="text-p3 text-muted">
        Or start with an example
      </p>
      <ul aria-labelledby={id} className="mt-3 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => onPick(prompt)}
              className="min-h-10 rounded-control border border-line bg-white px-3.5 text-p3 font-medium text-ink transition-colors hover:border-arnique-300 hover:bg-arnique-100 hover:text-arnique-900"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
