
import { useEffect, useRef } from "react";
import { db } from "../firebaseInit";
import Notification from "./Notification";
import { doc, updateDoc } from "firebase/firestore";
import editForm from "../Styles/EditForm.module.css"


function EditForm({ selectedImage, editURL, setEditURL, editTitle, setEditTitle, addedImages, 
    editIndex, setEditIndex, selectedAlbum, setIsEdit }){
   
        const titleRef = useRef(null);

        useEffect(() => {
            titleRef.current.focus();
        }, []);
     
        const handleUpdate = async (e) => {
            e.preventDefault();
    
    
    
            // Check if both title and imageURL are not empty 
            if (editTitle && editURL) {
                const updateImage = {
                    title: editTitle,
                    imageURL: editURL
                }
    
                addedImages[editIndex] = updateImage;
            }
    
            try {
    
                // Update the Firestore document with the updated array
                const albumDocRef = doc(db, "albums", selectedAlbum);
                await updateDoc(albumDocRef, {
                    images: addedImages
                });
        
                Notification("Image updated successfully!", false);
            } catch (error) {
                console.error("Error updating the image from the database:", error);
                
                // Handle error and display a notification
                Notification("Error in updating the image from the database", true)
            }
            
        
            setIsEdit(false);
    
            setEditTitle("");
            setEditURL("");
            setEditIndex("");
        }
    
        const handleClear = () => {
            setEditTitle("");
            setEditURL("");
        }
   
   
   
   
   
   
   
   
   
        return (
       <>
       
       <div className={editForm.imageForm}>
                <div className={editForm.imgForm}>
                    <span>Update image {selectedImage}</span>
                    <form>
                    <input
                     type="text"
                     placeholder="Title"
                     value={editTitle}
                    ref={titleRef}
                     required
                     className={editForm.inputTitleStyle}
                     onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <input
                            type="text"
                            placeholder="Image URL"
                            value={editURL}
                            required
                            className={editForm.inputURLStyle}
                            onChange={(e) => setEditURL(e.target.value)}
                        />
                        <div className={editForm.actions}>
                            <button onClick={handleClear} className={editForm.clear}>Clear</button>
                            <button type="submit" className={editForm.add}>Update</button>
                        </div>
                    </form>
                    </div>
                    </div>
       </>
    );

}

export  default  EditForm;