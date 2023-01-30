import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getItemFromLocalStorage, localStoreKeys } from '../allFuncs';
import { GlobalData } from '../GlobalData';
import CloseIcon from '@mui/icons-material/Close';
import { AppContext } from '../Context/AppContext';

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

    async function removeImg() {
        const result = await axios.post(
            GlobalData.baseUrl + '/api/admin/remove-gallery-img',
            { img_id: imgData.id },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        if (result.status === 200) {
            setAllPhotos((prevState) => {
                const index = prevState.indexOf(imgData);
                if (index > -1) {
                    prevState.splice(index, 1);
                }
                return [...prevState];
            });
        }
    }

    return (
        <div className={`img-box`}>
            <div className="inner">
                {authState ? (
                    authState.isLogged ? (
                        authState.loggedUser ? (
                            authState.loggedUser.role === 'admin' ? (
                                <span className="close-btn" onClick={removeImg}>
                                    <CloseIcon />
                                </span>
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
                <img onClick={() => openImageWindow(IMG_PATH)} src={IMG_PATH} alt="" />
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
                            <form onSubmit={uploadPhoto} ref={uploadForm}>
                                <div className="d-flex" style={{ alignItems: 'center' }}>
                                    <TextField type="file" className="w-100 my-2" name="upload_img" required />
                                    <Button
                                        className="mx-2"
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        style={{ height: '50px', width: '120px' }}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </form>
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
                            <ImgBox setAllPhotos={setAllPhotos} imgData={imgData} key={indx} openImageWindow={openImageWindow} />
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
