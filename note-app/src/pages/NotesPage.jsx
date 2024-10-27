// import { fakeData as notes } from '../assets/fakeData.js';
import { useContext } from "react";
import NoteCard from '../components/NoteCard';
import { NoteContext } from '../context/NoteContext';
const NotesPage = () => {

    const { notes } = useContext(NoteContext);
    return (
        <div>
            {
                notes.map((note) => (
                    <NoteCard note={note} key={note.$id} />
                ))
            }

        </div>
    )
}

export default NotesPage