import React from "react";
import "./App.css";

async function fetchEntries() {
  return await (await fetch(window.API_ROOT + "/items")).json();
}

async function postEntry(newEntry) {
  await fetch(window.API_ROOT + "/item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: newEntry }),
  });
}

function App() {
  const [inputValue, setInputValue] = React.useState("");
  const [inputLocked, setInputLocked] = React.useState(false);

  const [entries, setEntries] = React.useState([]);
  const refreshEntries = () => {
    fetchEntries().then(setEntries);
  };
  React.useEffect(() => {
    refreshEntries();
  }, []);

  const handleAdd = async () => {
    setInputLocked(true);
    await postEntry(inputValue);
    setInputValue("");
    setInputLocked(false);
    refreshEntries();
  };

  const placeholder = "type here";

  return (
    <div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.value}</li>
        ))}
      </ul>
      <input
        type="text"
        disabled={inputLocked}
        value={inputValue}
        onInput={(e) => setInputValue(e.target.value)}
        placeholder={placeholder.toUpperCase()}
      ></input>
      <button disabled={inputLocked} type="button" onClick={handleAdd}>
        add
      </button>
    </div>
  );
}

export default App;
