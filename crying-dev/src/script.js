const CryLog = () => {
  const [history, setHistory] = React.useState([
    {
      type: "response",
      content:
        "Welcome to crying.dev v1.0.0 - Your safe space for developer tears 🫂\nType 'help' to get started."
    }
  ]);
  const [input, setInput] = React.useState("");
  const [currentDirectory, setCurrentDirectory] = React.useState("~");
  const [commandHistory, setCommandHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [cryLogs, setCryLogs] = React.useState([]);
  const inputRef = React.useRef(null);
  const outputRef = React.useRef(null);

  const reasons = {
    MERGE_CONFLICT: "merge_conflict",
    PROD_DOWN: "prod_down",
    IMPOSTER_SYNDROME: "imposter_syndrome",
    DEBUG_HELL: "debug_hell",
    LEGACY_CODE: "legacy_code"
  };

  const processCommand = (cmd) => {
    if (!cmd.trim()) return;

    const args = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const command = args[0].toLowerCase();
    const output = { type: "response", content: "" };

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (command) {
      case "log_cry":
        const intensity =
          args.find((arg) => arg.startsWith("--intensity="))?.split("=")[1] ||
          "5";
        const reason =
          args.find((arg) => arg.startsWith("--reason="))?.split("=")[1] ||
          "unknown";
        const notes =
          args
            .find((arg) => arg.startsWith("--notes="))
            ?.replace("--notes=", "")
            .replace(/^"(.*)"$/, "$1") || "";

        output.content = processCryLog(intensity, reason, notes);
        break;

      case "view_stats":
        output.content = generateStats();
        break;

      case "help":
      case "--help":
        output.content = `Available commands:
• log_cry --intensity=1-10 --reason=[${Object.values(reasons).join(
          "|"
        )}] --notes="your notes here"
• view_stats - Display emotional analytics
• clear - Clear terminal
• exit - Try it and find out 👀`;
        break;

      case "clear":
        setHistory([]);
        return;

      case "exit":
        output.content = `ERROR: There is no escape. You're stuck debugging forever.

    ¯\\_(ツ)_/¯

Try 'log_cry' instead - we're here for you! 🤗`;
        break;

      default:
        output.content = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { type: "command", content: cmd }, output]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const processCryLog = (intensity, reason, notes) => {
    const now = new Date();
    const log = {
      timestamp: now.toISOString(),
      intensity: parseInt(intensity),
      reason,
      notes
    };

    setCryLogs((prev) => [...prev, log]);

    const emoji = getIntensityEmoji(intensity);
    return `Cry logged ${emoji}\nIntensity: ${intensity}/10\nReason: ${reason}\nNotes: ${notes}\n\nStay strong, developer! Here's a virtual hug 🫂`;
  };

  const getIntensityEmoji = (intensity) => {
    const i = parseInt(intensity);
    if (i <= 3) return "🐛";
    if (i <= 6) return "😢";
    if (i <= 8) return "😭";
    return "💥";
  };

  const generateStats = () => {
    if (cryLogs.length === 0) {
      return "No cries logged yet. Use 'log_cry' to start tracking your emotional journey.";
    }

    const reasonCounts = cryLogs.reduce((acc, log) => {
      acc[log.reason] = (acc[log.reason] || 0) + 1;
      return acc;
    }, {});

    const total = cryLogs.length;
    const reasonStats = Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const dayIntensities = cryLogs.reduce((acc, log) => {
      const day = new Date(log.timestamp).toLocaleDateString("en-US", {
        weekday: "short"
      });
      if (!acc[day]) acc[day] = [];
      acc[day].push(log.intensity);
      return acc;
    }, {});

    const dayAverages = Object.entries(dayIntensities).map(
      ([day, intensities]) => ({
        day,
        avg: Math.round(
          intensities.reduce((a, b) => a + b, 0) / intensities.length
        )
      })
    );

    const getBar = (percentage) => {
      const filled = Math.round(percentage / 10);
      return "▓".repeat(filled) + "░".repeat(10 - filled);
    };

    let output = "\nIntensity Trend by Day:\n\n";
    dayAverages.forEach(({ day, avg }) => {
      output += `${day.padEnd(4)} ${getBar(avg)} ${avg}/10\n`;
    });

    output += "\nTop Reasons:\n";
    reasonStats.forEach(({ reason, percentage }) => {
      output += `${reason.padEnd(16)} ${percentage}% ${getBar(percentage)}\n`;
    });

    const maxDay = dayAverages.reduce((a, b) => (a.avg > b.avg ? a : b));
    const topReason = reasonStats[0];

    output += `\nInsight: ${maxDay.day} tends to be your toughest day (avg: ${maxDay.avg}/10), `;
    output += `with ${topReason.reason} being your most common trigger (${topReason.percentage}%)`;

    return output;
  };

  React.useEffect(() => {
    inputRef.current?.focus();
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
  }, [history]);

  return (
    <div className="container">
      <div className="terminal">
        <div className="terminal-header">
          <span>😭</span>
          <span>Crying.dev v1.0.0</span>
        </div>

        <div ref={outputRef} className="terminal-content">
          {history.map((entry, i) => (
            <div
              key={i}
              className={entry.type === "command" ? "command" : "response"}
            >
              {entry.type === "command" ? (
                <span>
                  {currentDirectory}$ {entry.content}
                </span>
              ) : (
                <pre>{entry.content}</pre>
              )}
            </div>
          ))}
        </div>

        <div className="command-line">
          <span className="prompt">{currentDirectory}$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="command-input"
            autoFocus
          />
        </div>
      </div>

      <div className="alert">
        Type 'help' to see available commands. Your tears are encrypted and
        stored locally.
      </div>
    </div>
  );
};

ReactDOM.render(<CryLog />, document.getElementById("root"));
