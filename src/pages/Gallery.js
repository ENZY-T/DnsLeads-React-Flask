import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { GlobalData } from '../GlobalData';
import CloseIcon from '@mui/icons-material/Close';
import { AppContext } from '../Context/AppContext';

function PreviewImgBox({ img_path, setArrayTo, imgArray }) {
    function removeImg(e) {
        setArrayTo(imgArray.filter((e) => e !== img_path));
    }
    return (
        <div className={`img-box`}>
            <div className="inner">
                <span className="close-btn" onClick={removeImg}>
                    <CloseIcon />
                </span>
                <img src={img_path} />
            </div>
        </div>
    );
}

function CreateAlbum({ setCreateCollectionShow, uploadPhoto, uploadForm }) {
    const [beforeImgs, setBeforeImgs] = useState([]);
    const [afterImgs, setAfterImgs] = useState([]);

    function setToShowList(e, setAfterOrBefore) {
        const selectedFilesArray = Array.from(e.target.files);
        setAfterOrBefore(
            selectedFilesArray.map((file) => {
                return URL.createObjectURL(file);
            })
        );
    }

    return (
        <div className="collection-form p-3">
            <Button onClick={() => setCreateCollectionShow(false)} variant="outlined">
                hide collection form
            </Button>
            <form ref={uploadForm} onSubmit={uploadPhoto} className="py-3">
                <TextField name="catergory" label="Tag name for collection" className="w-100 my-3" required />
                <div className="before-imgs">
                    <h4>Before ({beforeImgs.length})</h4>
                    <label htmlFor="before_imgs" className="btn btn-outline-success">
                        Select Before images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        name="before_imgs"
                        id="before_imgs"
                        onChange={(e) => setToShowList(e, setBeforeImgs)}
                        required
                        multiple
                        style={{ display: 'none' }}
                    />
                    <div className="img-show-container galary-container">
                        {beforeImgs
                            ? beforeImgs.length > 0
                                ? beforeImgs.map((img_path, indx) => (
                                      <PreviewImgBox img_path={img_path} key={indx} setArrayTo={setBeforeImgs} imgArray={beforeImgs} />
                                  ))
                                : ''
                            : ''}
                    </div>
                </div>
                <hr />
                <div className="after-imgs">
                    <h4>After ({afterImgs.length})</h4>
                    <label htmlFor="after_imgs" className="btn btn-outline-success">
                        Select After images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        name="after_imgs"
                        id="after_imgs"
                        onChange={(e) => setToShowList(e, setAfterImgs)}
                        required
                        multiple
                        style={{ display: 'none' }}
                    />
                    <div className="img-show-container galary-container">
                        {afterImgs
                            ? afterImgs.length > 0
                                ? afterImgs.map((img_path, indx) => (
                                      <PreviewImgBox img_path={img_path} key={indx} setArrayTo={setAfterImgs} imgArray={afterImgs} />
                                  ))
                                : ''
                            : ''}
                    </div>
                </div>
                <Button className="w-100 my-3" variant="contained" type="submit">
                    Create new Collection
                </Button>
            </form>
        </div>
    );
}

function ShowImgWindow({ closeImageWindow, clickedImg }) {
    return (
        <div className="show-img-container">
            <div className="img-window">
                <img src={clickedImg} />
            </div>
            <div className="img-bg" onClick={closeImageWindow}></div>
        </div>
    );
}

function ImgBox({ setAllPhotos, imgData, openImageWindow }) {
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
    const { authState } = useContext(AppContext);

    const IMG_PATH = `${GlobalData.baseUrl}/${imgData.img_path}`;

    return (
        <div className={`img-box`}>
            <div className="inner">
                <img onClick={() => openImageWindow(IMG_PATH)} src={IMG_PATH} alt="" />
            </div>
        </div>
    );
}

function CollectionGallery({ imgObj, openImageWindow, setAllPhotos }) {
    const { authState } = useContext(AppContext);
    async function removeCollection() {
        if (window.confirm(`Do you want to delete ${imgObj.catergory} collection?`)) {
            const result = await axios.post(GlobalData.baseUrl + '/api/admin/remove-gallery-collection', {
                collection_id: imgObj.id,
            });
            if (result.status === 200) {
                setAllPhotos((prevState) => {
                    const index = prevState.indexOf(imgObj);
                    if (index > -1) {
                        prevState.splice(index, 1);
                    }
                    return [...prevState];
                });
            }
        }
    }

    return (
        <div className="collection-form my-3 p-3">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ width: 'max-content' }}>{imgObj.catergory}</h3>
                {authState ? (
                    authState.isLogged ? (
                        authState.loggedUser ? (
                            authState.loggedUser.role === 'admin' ? (
                                <Button onClick={removeCollection} color="error" variant="contained">
                                    Delete Collection
                                </Button>
                            ) : (
                                ''
                            )
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )
                ) : (
                    ''
                )}
            </div>
            <div>
                <h4>Before</h4>
                <div className="img-show-container galary-container">
                    {imgObj.imgs.before.map((imgdata, indx) => (
                        <ImgBox imgData={imgdata} key={indx} openImageWindow={openImageWindow} />
                    ))}
                </div>
            </div>
            <div>
                <h4>After</h4>
                <div className="img-show-container galary-container">
                    {imgObj.imgs.after.map((imgdata, indx) => (
                        <ImgBox imgData={imgdata} key={indx} openImageWindow={openImageWindow} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Gallery() {
    const [allPhotos, setAllPhotos] = useState([]);
    const uploadForm = useRef();
    const accessToken = getItemFromLocalStorage(localStoreKeys.authKey);
    const { authState } = useContext(AppContext);

    const [clickedImg, setClickedImg] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    const [createCollectionShow, setCreateCollectionShow] = useState(false);

    function openImageWindow(imgPath) {
        setClickedImg(imgPath);
        setIsClicked(true);
    }

    function closeImageWindow() {
        setIsClicked(false);
        setClickedImg('');
    }

    async function uploadPhoto(e) {
        e.preventDefault();
        const formData = new FormData(uploadForm.current);
        const result = await axios.post(GlobalData.baseUrl + '/api/admin/upload-image-for-gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (result.status === 200) {
            setAllPhotos([...allPhotos, result.data]);
            uploadForm.current.reset();
        }
    }

    async function getAllImgs() {
        const result = await axios.get(GlobalData.baseUrl + '/api/admin/get-gallery-imgs', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (result.status === 200) {
            setAllPhotos(result.data);
        }
    }

    useEffect(() => {
        getAllImgs();
    }, []);

    return (
        <div className="container py-3">
            {isClicked ? <ShowImgWindow closeImageWindow={closeImageWindow} clickedImg={clickedImg} /> : ''}
            <h3 className="my-2">Gallery</h3>
            {authState ? (
                authState.isLogged ? (
                    authState.loggedUser ? (
                        authState.loggedUser.role === 'admin' ? (
                            <div className="py-3">
                                {createCollectionShow ? (
                                    <CreateAlbum
                                        setCreateCollectionShow={setCreateCollectionShow}
                                        uploadPhoto={uploadPhoto}
                                        uploadForm={uploadForm}
                                    />
                                ) : (
                                    <Button variant="outlined" onClick={() => setCreateCollectionShow(true)}>
                                        Create Collection
                                    </Button>
                                )}
                            </div>
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )
                ) : (
                    ''
                )
            ) : (
                ''
            )}
            <div className="galary-container py-3">
                {allPhotos ? (
                    allPhotos.length > 0 ? (
                        allPhotos.map((imgData, indx) => (
                            <CollectionGallery imgObj={imgData} key={indx} openImageWindow={openImageWindow} setAllPhotos={setAllPhotos} />
                        ))
                    ) : (
                        <h4>No photos available</h4>
                    )
                ) : (
                    <h4>Loading...</h4>
                )}
            </div>
        </div>
    );
}

export default Gallery;
