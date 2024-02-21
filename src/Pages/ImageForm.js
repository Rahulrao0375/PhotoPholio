import { useEffect, useRef, useState } from "react";
import imageFormStyle from "../Styles/ImageForm.module.css";
import Notification from "./Notification";
import { arrayUnion, getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseInit";

function ImageForm({ setAddedImages, selectedAlbum }) {

    const [imageURL, setImageURL] = useState("");
    const [title, setTitle] = useState("");
    const titleRef = useRef(null);

    useEffect(() => {
        titleRef.current.focus();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        // Check if both title and imageURL are not empty 
        if (title && imageURL) {

           // Update the state by adding the new image to the existing array
            const newImage = {
                title: title,
                imageURL: imageURL
            }

            // Update the state with the new image
            setAddedImages((prevImages) => [newImage, ...prevImages]);

            try {
                // update image in the database
                const albumDocRef = doc(db, "albums", selectedAlbum);
                const albumDocSnap = await getDoc(albumDocRef);

                // Get the current images array or an empty array if it doesn't exist
                const currentImages = albumDocSnap.data()?.images || [];

                // Update the document with the new images array
                await updateDoc(albumDocRef, {
                    images: arrayUnion(newImage, ...currentImages),
                });

                Notification("Image added successfully!", false);

                // Optionally, you can clear the input fields after adding the image
                setTitle("");
                setImageURL("");
            } catch (error) {
                console.error("Error adding image to the database:", error);
                // Handle error and display a notification
                Notification("Error adding image to the database", true);
            }
       } else {

            // Handle the case where either title or imageURL is empty
            console.log("Title and Image URL are required");
        }
    }

    const handleClear = () => {
        setTitle("");
        setImageURL("");
    }

    return (
        <>
            <div className={imageFormStyle.imageForm}>
                <div className={imageFormStyle.imgForm}>
                    <span>Add image to {selectedAlbum}</span>
                    <form onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            ref={titleRef}
                            required
                            className={imageFormStyle.inputTitleStyle}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageURL}
                            required
                            className={imageFormStyle.inputURLStyle}
                            onChange={(e) => setImageURL(e.target.value)}
                        />
                        <div className={imageFormStyle.actions}>
                            <button onClick={handleClear} className={imageFormStyle.clear}>Clear</button>
                            <button type="submit" className={imageFormStyle.add}>Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ImageForm;