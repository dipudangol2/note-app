import { fakeData as notes } from './assests/fakeData';
import { NoteCard } from './components/NoteCard';
const NotesPage = () => {
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