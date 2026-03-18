import { useEffect, useState } from "react";
import "../src/App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

function App() {
  const [image, setImage] = useState(null);
  const [notes, setNotes ] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // mau ngetes push aja

  useEffect(() => {
    getNotes();
  }, []);

  async function addNote() {
    let imageUrl = null;

    if (image) {
      const fileName = Date.now() + "-" + image.name;

      const {error: uploadError } = await supabase
        .storage
        .from('images')
        .upload(fileName, image);

      if (uploadError) {
        console.log("Upload error:". uploadError);
        return;
      }

      const { data } = supabase 
        .storage
        .from("images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("notes")
      .insert([
        {
          title: title,
          content: content,
          image_url: imageUrl
        }
      ]);

    if (error) {
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
  type="file"
  onChange={(e) => setImage(e.target.files[0])}
/>

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

          {note.image_url && (
            <img src={note.image_url} width="200" />
          )}
        </div>
      ))}

    </>
  )
}

export default App;