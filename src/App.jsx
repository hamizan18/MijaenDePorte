import { useEffect, useState } from "react";
import "../src/App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [ notes, setNotes ] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getNotes();
  }, []);

  async function addNote() {
    const { error } = await supabase
      .from("notes")
      .insert([{ title: title, content: content }]);
      setTitle("")
      setContent("")

      if(error) {
        console.log(error);
      } else {
        getNotes();
      }
  }
  async function getNotes() {
    const { data } = await supabase.from("notes").select();
    setNotes(data);
  }

  return (
<>
    <input
  type="text"
  placeholder="title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<input
  type="text"
  placeholder="content"
  value={content}
  onChange={(e) => setContent(e.target.value)}
/>

<button onClick={addNote}>Tambah Note</button>
      <h1>Notes dari Supabase</h1>

      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}

    </>
  )
}

export default App;