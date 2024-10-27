import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import DeleteButton from "./DeleteButton";
import { useRef, useEffect, useState } from "react";
import Spinner from "../icons/Spinner";

const NoteCard = ({ note }) => {
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);

    let [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = bodyParser(note.body);
    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);
    const textAreaRef = useRef(null);



    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;

            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            setZIndex(cardRef.current);
        }
    };

    const mouseMove = (e) => {
        const mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPosition(newPosition);
    };


    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);
    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp)

        const newPosition = setNewOffset(cardRef.current);

        saveData("position", newPosition);
        db.notes.update(note.$id, { "position": JSON.stringify(newPosition) });
    }

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };

        try {
            await db.notes.update(note.$id, payload)
        } catch (error) {
            console.error(error);

        }
        setSaving(false);
    }

    const handleKeyUp = () => {
        setSaving(true);

        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2500)
    }

    return (
        <div
            className="card"
            ref={cardRef}
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header"
                style={{
                    backgroundColor: colors.colorHeader,
                }}
            >
                <DeleteButton noteId={note.$id} />
                {saving && (
                    <div className="card-saving">
                        <span style={{ color: colors.colorText }}>
                            <Spinner color={colors.colorText} />
                        </span>

                    </div>
                )}
            </div>

            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    ref={textAreaRef}
                    onFocus={
                        () => {
                            setZIndex(cardRef.current);
                        }
                    }
                    onInput={() => {
                        autoGrow(textAreaRef);
                    }}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                ></textarea>
            </div>
        </div>
    );
};

export default NoteCard;
