 import {useEffect,useState} from "react";
import imageStyle from "../Styles/ImagesList.module.css";
import {doc,onSnapshot,updateDoc} from "firebase/firestore"
import {db}  from "../firebaseInit";
import Notification from "./Notification"
function ImagesList({ imageList, setImageList, isAddImage, setIsAddImage, addedImages,
    setAddedImages, selectedAlbum, setSelectedAlbum, isEdit, setIsEdit, setEditURL,
    setEditTitle, setEditIndex, setSelectedImage }){

        
    const [carousel, setCarousel] = useState(false);
    const [searchBar, setSearchBar] = useState(false);
    const [searchItem, setSearchItem] = useState("");
    const [url, setUrl] = useState({ url: "", index: -1 });

    useEffect(() => {
        const fetchAllImages = async () => {
            try {
                const unsub = onSnapshot(doc(db, "albums", selectedAlbum), (doc) => {
                    setAddedImages(doc.data().images);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAllImages();
    }, [selectedAlbum, setAddedImages]);

        const handleBack = (e) => {

            if (isAddImage) {
                setIsAddImage(false);
            }
    
            setImageList(!imageList);
            setSelectedAlbum("");
    
        }
        
    const handleAddImage = (e) => {
        if (isEdit) {
            setIsEdit(false);
            // setIsAddImage(false);
        } else {
            setIsAddImage(!isAddImage);
        }

    }


    const handleSearch = (query) => {
        setSearchItem(query);

        let filtered = addedImages;

        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        setAddedImages(filtered);
    }

    const handleCarousel = (url, index) => {
        setUrl({ url, index });
        setCarousel(!carousel);
    }

    const handleBackHome = () => {
        setCarousel(!carousel);
    }

    const scrollBack = (i) => {
        let imagesArray = addedImages;
        let neg = i - 1;

        setUrl({
            url: imagesArray[neg < 0 ? addedImages.length - 1 : neg].imageURL,
            index: neg < 0 ? addedImages.length - 1 : neg
        });
    }

    const scrollForward = (i) => {
        let imageArray = addedImages;

        setUrl({ url: imageArray[(i + 1) % (addedImages.length)].imageURL, index: (i + 1) % (addedImages.length) });
    }





    const handleEdit = (e, i) => {

        // Stop the event from propagating to the parent div
        e.stopPropagation();
        // setIsAddImage(false);

        setEditIndex(i);


        if (!isEdit) {
            setIsEdit(true);
            setIsAddImage(false);
        }

        let updatedImages = addedImages;

        setEditURL(updatedImages[i].imageURL);
        setEditTitle(updatedImages[i].title);
        setSelectedImage(updatedImages[i].title);
    }
    const handleDelete = async (e, i) => {

        // Stop the event from propagating to the parent div
        e.stopPropagation();

        setEditIndex(i);

        let updatedImages = addedImages.filter((image, index) => i !== index);

        setAddedImages(updatedImages);

        try {

            // Update the Firestore document with the filtered array
            const albumDocRef = doc(db, "albums", selectedAlbum);
            await updateDoc(albumDocRef, {
                images: updatedImages
            });

            Notification("Image deleted successfully!", false);
        } catch (error) {
            console.error("Error deleting image from the database:", error);

            // Handle error and display a notification
            Notification("Error in deleting image from the database", true)
        }

    } 

    const handleSearchBar = () => {
        setSearchBar(!searchBar);
    }


        return(
        
            <div className={imageStyle.head}>
                <div className={imageStyle.image}>
                <span className={imageStyle.back} onClick={handleBack}>
                    <img src="https://cdn-icons-png.flaticon.com/128/2099/2099238.png" alt="back" />
                    </span>
                    <div className={addedImages.length > 0 ? undefined : imageStyle.notFound}>
                    <h3>
                        {addedImages.length > 0 ? "Images in " + selectedAlbum : "No images found in the " + selectedAlbum}
                    </h3>
                  </div>
                  { <div className={imageStyle.search}>
                    {searchBar && <input type="text" placeholder="Search..." value={searchItem} onChange={(e) => handleSearch(e.target.value)} />}
                    {!searchBar && addedImages.length > 0 ? <img src="https://cdn-icons-png.flaticon.com/128/954/954591.png" alt="search" onClick={handleSearchBar} /> : undefined}
                    {searchBar && <img src="https://cdn-icons-png.flaticon.com/128/1617/1617543.png" alt="cancel" onClick={handleSearchBar} />}
                </div> }

                <button type="submit" onClick={handleAddImage} className={isAddImage || isEdit ? imageStyle.cancel : imageStyle.addImage} >
                    {isAddImage || isEdit ? "Cancel" : "Add Image"}
                </button>
                </div>
                {addedImages.length > 0 && (
                    <div className={imageStyle.imageList}>
                    {addedImages.map((albumImages, i) => (
                        <div className={imageStyle.images} key={i} onClick={(e) => handleCarousel(albumImages.imageURL, i)}>
                            <div className={imageStyle.update} onClick={(e) => handleEdit(e, i)}>
                                <img src="https://cdn-icons-png.flaticon.com/128/8528/8528592.png" alt="update" />
                            </div>
                            <div className={imageStyle.delete} onClick={(e) => handleDelete(e, i)}>
                                <img src="https://cdn-icons-png.flaticon.com/128/6711/6711573.png" alt="delete" />
                            </div>
                            <img src={/\.(jpeg|jpg|gif|png)$/i.test(albumImages.imageURL)?albumImages.imageURL:"data:image/png;base64,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"}alt={albumImages.title} />
                            <span>{albumImages.title}</span>
                        </div>
                    ))}
                    {carousel && <div className={imageStyle.carousel}>
                        <div className={imageStyle.cross} onClick={handleBackHome}>
                            <button>x</button>
                        </div>
                        <div className={imageStyle.backScoll} onClick={(e) => scrollBack(url.index)}>
                            <button>{"<"}</button>
                        </div>
                        <div className={imageStyle.url}>
                            <img src={url.url} alt="url" />
                        </div>
                        <div className={imageStyle.forwardScroll} onClick={(e) => scrollForward(url.index)}>
                            <button>{">"}</button>
                        </div>
                    </div>}
                </div>

                )}
                
            </div>
            
        );
    }

    export default ImagesList;