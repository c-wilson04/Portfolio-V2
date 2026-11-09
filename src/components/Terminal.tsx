import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { profile } from "../data/profile";
import "./Terminal.css";

type Entry = { command: string; output: ReactNode };

const BASE = import.meta.env.BASE_URL;

const COMMANDS = "help, about, now, ls, babel, acropolis, github, contact, whoami, qwrld, sudo, clear";

const run = (raw: string): ReactNode => {
  const cmd = raw.trim().toLowerCase();
  switch (cmd) {
    case "help":
      return COMMANDS;
    case "about":
      return "optimization by day. shaders, cuda and touchdesigner by night.";
    case "now":
      return "building living diary. reading about gpus, quantum, and nuclear.";
    case "ls":
      return "badgeup  riva  qwrld  noat";
    case "babel":
      return "floors = words. letters never leave the page.";
    case "acropolis":
      return (
        <>
          a step, a column, a roof. <a href={`${BASE}acropolis/`}>read it</a>
        </>
      );
    case "github":
      return (
        <a href="https://github.com/c-wilson04" target="_blank" rel="noreferrer">
          github.com/c-wilson04
        </a>
      );
    case "contact":
      return <a href={`mailto:${profile.email}`}>{profile.email}</a>;
    case "whoami":
      return "Charles Wilson (Q.Wrld)";
    case "qwrld":
      return "where emotion, design, and technology meet.";
    case "sudo":
      return "nice try.";
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
    if (value.trim().toLowerCase() === "clear") {
      setHistory([]);
    } else {
      setHistory((prev) => [...prev, { command: value, output: run(value) }]);
    }
    setValue("");
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div role="log" aria-live="polite" className="terminal__log">
        {history.map((entry, i) => (
          <div key={i}>
            <div>
              <span className="terminal__prompt">q.wrld %</span> {entry.command}
            </div>
            <div className="terminal__out">{entry.output}</div>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="terminal__row">
        <label htmlFor="terminal-input" className="terminal__prompt">
          q.wrld %
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="type help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
