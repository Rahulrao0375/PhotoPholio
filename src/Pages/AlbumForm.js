import albumFormStyle from "../Styles/albumForm.module.css"
import {useEffect,useRef} from "react";
import {db} from "../firebaseInit";
import {  doc, setDoc } from "firebase/firestore";
import Notification from "./Notification";


function AlbumForm ({createdAlbums, setCreatedAlbums, album, setAlbum}){
    const addAlbumRef=useRef(null);
    useEffect(()=>{
              addAlbumRef.current.focus();
    }, []);
    const handleCreate=async(e)=>{
        e.preventDefault();
        //create doc
        const albumDocRef=doc(db,"albums",album);
        //update-
        await setDoc(albumDocRef,{
            albumName:album,
            images: []
        });

        
          Notification("Album added successfully!",false);

        
        // New state to track the latest created album
        setCreatedAlbums([...createdAlbums, album]);
        setAlbum(""); 
    }

    const handleClear = () => {

        // Clear the input field
        setAlbum("");
    }
   
   
   return(
<>
<div className={albumFormStyle.albumForm}>
<div className={albumFormStyle.albForm}>
                    <span>Create an album</span>
                    <form onSubmit={handleCreate}>
                        <input
                        type="text"
                        placeholder="album Name"
                        value={album}
                        required
                        ref={addAlbumRef}
                        className={albumFormStyle.inputStyle}
                        onChange={(e) => setAlbum(e.target.value)}
                        
                        />
                        <button onClick={handleClear} className={albumFormStyle.clear} >Clear</button>
                        <button type="submit" className={albumFormStyle.create}>Create</button>
                    </form>
</div>
</div>
</>
    );
}

export default AlbumForm;