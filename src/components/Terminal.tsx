import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import "./Terminal.css";

type Entry = { command: string; output: ReactNode };

const run = (raw: string): ReactNode => {
  const cmd = raw.trim().toLowerCase();
  switch (cmd) {
    case "help":
      return "help, about, babel, github, resume, ls, whoami, sudo, qwrld";
    case "about":
      return "3D Artist / Data Scientist / Developer.";
    case "babel":
      return "floors = words. letters never leave the page.";
    case "github":
      return (
        <a href="https://github.com/c-wilson04" target="_blank" rel="noreferrer">
          github.com/c-wilson04
        </a>
      );
    case "resume":
      return <a href="#Resume_">see the Resume section</a>;
    case "ls":
      return "badgeup  riva  qwrld  noat";
    case "whoami":
      return "Charles Wilson (Q.Wrld)";
    case "sudo":
      return "nice try.";
    case "qwrld":
      return "where emotion, design, and technology meet.";
    case "":
      return null;
    default:
      return `command not found: ${raw.trim()}. try help`;
  }
};

export default function Terminal() {
  const [history, setHistory] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    setHistory((prev) => [...prev, { command: value, output: run(value) }]);
    setValue("");
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div role="log" aria-live="polite" className="terminal-log">
        {history.map((entry, i) => (
          <div key={i}>
            <div>
              <span className="prompt">q.wrld %</span> {entry.command}
            </div>
            <div className="terminal-out">{entry.output}</div>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="terminal-row">
        <label htmlFor="terminal-input" className="prompt">
          q.wrld %
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
