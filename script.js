const CryLog = () => {
  const [history, setHistory] = React.useState([
  {
    type: "response",
    content:
    "Welcome to crying.dev v1.0.0 - Your safe space for developer tears 🫂\nType 'help' to get started." }]);


  const [input, setInput] = React.useState("");
  const [currentDirectory, setCurrentDirectory] = React.useState("~");
  const [commandHistory, setCommandHistory] = React.useState([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const [cryLogs, setCryLogs] = React.useState([]);
  const inputRef = React.useRef(null);
  const outputRef = React.useRef(null);

  // Add this new useEffect here
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []); 

  const reasons = {
    MERGE_CONFLICT: "merge_conflict",
    PROD_DOWN: "prod_down",
    IMPOSTER_SYNDROME: "imposter_syndrome",
    DEBUG_HELL: "debug_hell",
    LEGACY_CODE: "legacy_code" };


  const processCommand = cmd => {var _args$find, _args$find2, _args$find3;
    if (!cmd.trim()) return;

    const args = cmd.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const command = args[0].toLowerCase();
    const output = { type: "response", content: "" };

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (command) {
      case "log_cry":
        const intensity =
        ((_args$find = args.find(arg => arg.startsWith("--intensity="))) === null || _args$find === void 0 ? void 0 : _args$find.split("=")[1]) ||
        "5";
        const reason =
        ((_args$find2 = args.find(arg => arg.startsWith("--reason="))) === null || _args$find2 === void 0 ? void 0 : _args$find2.split("=")[1]) ||
        "unknown";
        const notes =
        ((_args$find3 = args.
        find(arg => arg.startsWith("--notes="))) === null || _args$find3 === void 0 ? void 0 : _args$find3.
        replace("--notes=", "").
        replace(/^"(.*)"$/, "$1")) || "";

        output.content = processCryLog(intensity, reason, notes);
        break;

      case "view_stats":
        output.content = generateStats();
        break;

      case "help":
      case "--help":
        output.content = `Available commands:
• log_cry --intensity=1-10 --reason=[${Object.values(reasons).join(
        "|")
        }] --notes="your notes here"
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
        output.content = `Command not found: ${command}. Type 'help' for available commands.`;}


    setHistory(prev => [...prev, { type: "command", content: cmd }, output]);
  };

  const handleKeyDown = e => {
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
      notes };


    setCryLogs(prev => [...prev, log]);

    const emoji = getIntensityEmoji(intensity);
    return `Cry logged ${emoji}\nIntensity: ${intensity}/10\nReason: ${reason}\nNotes: ${notes}\n\nStay strong, developer! Here's a virtual hug 🫂`;
  };

  const getIntensityEmoji = intensity => {
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
    const reasonStats = Object.entries(reasonCounts).
    map(([reason, count]) => ({
      reason,
      percentage: Math.round(count / total * 100) })).

    sort((a, b) => b.percentage - a.percentage);

    const dayIntensities = cryLogs.reduce((acc, log) => {
      const day = new Date(log.timestamp).toLocaleDateString("en-US", {
        weekday: "short" });

      if (!acc[day]) acc[day] = [];
      acc[day].push(log.intensity);
      return acc;
    }, {});

    const dayAverages = Object.entries(dayIntensities).map(
    ([day, intensities]) => ({
      day,
      avg: Math.round(
      intensities.reduce((a, b) => a + b, 0) / intensities.length) }));




    const getBar = percentage => {
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

    const maxDay = dayAverages.reduce((a, b) => a.avg > b.avg ? a : b);
    const topReason = reasonStats[0];

    output += `\nInsight: ${maxDay.day} tends to be your toughest day (avg: ${maxDay.avg}/10), `;
    output += `with ${topReason.reason} being your most common trigger (${topReason.percentage}%)`;

    return output;
  };

  React.useEffect(() => {var _inputRef$current, _outputRef$current;
    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.focus();
    (_outputRef$current = outputRef.current) === null || _outputRef$current === void 0 ? void 0 : _outputRef$current.scrollTo(0, outputRef.current.scrollHeight);
  }, [history]);

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement("div", { className: "terminal" }, /*#__PURE__*/
    React.createElement("div", { className: "terminal-header" }, /*#__PURE__*/
    React.createElement("span", null, "\uD83D\uDE2D"), /*#__PURE__*/
    React.createElement("span", null, "Crying.dev v1.0.0")), /*#__PURE__*/


    React.createElement("div", { ref: outputRef, className: "terminal-content" },
    history.map((entry, i) => /*#__PURE__*/
    React.createElement("div", {
      key: i,
      className: entry.type === "command" ? "command" : "response" },

    entry.type === "command" ? /*#__PURE__*/
    React.createElement("span", null,
    currentDirectory, "$ ", entry.content) : /*#__PURE__*/


    React.createElement("pre", null, entry.content)))), /*#__PURE__*/





    React.createElement("div", { className: "command-line" }, /*#__PURE__*/
    React.createElement("span", { className: "prompt" }, currentDirectory, "$"), /*#__PURE__*/
    React.createElement("input", {
      ref: inputRef,
      type: "text",
      value: input,
      onChange: e => setInput(e.target.value),
      onKeyDown: handleKeyDown,
      onBlur: e => setTimeout(() => e.target.focus(), 10),
      className: "command-input",
      autoFocus: true }))), /*#__PURE__*/




    React.createElement("div", { className: "alert" }, "Type 'help' to see available commands. Your tears are encrypted and stored locally. ")));





};


ReactDOM.render( /*#__PURE__*/React.createElement(CryLog, null), document.getElementById("root"));