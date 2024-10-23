import { useState, useEffect } from 'react';
// import { fakeData as notes } from '../assets/fakeData.js';
import { db } from "../appwrite/databases"
import NoteCard from '../components/NoteCard';
const NotesPage = () => {

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const response = await db.notes.list()

        setNotes(response.documents);
    }
    console.log(notes)

    return (
        <div>
            {
                notes.map((note) => (
            <NoteCard note={note} key={note.$id} setNotes={setNotes} />
            ))
            }

        </div>
    )
}

export default NotesPage