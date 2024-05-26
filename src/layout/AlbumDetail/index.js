import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from 'react';
import { SongContext } from '../../components/SongContext';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaPlay, FaPause, FaBackward, FaHeart, FaShareAlt } from "react-icons/fa";
import "./AlbumDetail.scss";

function AlbumDetail() {
    const params = useParams();
    const { updateDataMainAndPlaySong, allSongs, replayCurrentSong, currentSong } = useContext(SongContext);
    const [dataAlbumDetail, setDataAlbumDetail] = useState([]);
    const [dataMain, setDataMainState] = useState([]);
    const [infoAlbum, setInfoAlbum] = useState([]);
    const [showModal, setShowModal] = useState(false); // State để kiểm soát hiển thị modal
    const modalRef = useRef(null); // Ref cho modal
    const modalContentRef = useRef(null);
    const currentUrl = window.location.href;
    const [amount, setAmount] = useState([]);
    const [dataUserDetail, setDataUserDetail] = useState(null); // Thay đổi từ [] thành null
    const [loading, setLoading] = useState(true); // Thêm biến loading để theo dõi trạng thái fetch
    const [message, setMessage] = useState([]);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/album/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setDataAlbumDetail(data.data.songs);
                    setInfoAlbum(data.data);
                }
            });
    }, [params.id]);

    useEffect(() => {
        if (dataAlbumDetail.length > 0 && allSongs.length > 0) {
            const dataMainTemp = dataAlbumDetail.map(songId => allSongs.find(song => song._id === songId)).filter(song => song);
            setDataMainState(dataMainTemp);
        }
    }, [dataAlbumDetail, allSongs]);

    const playAlbum = () => {
        if (dataMain.length > 0) {
            const firstSong = dataMain[0];
            if (currentSong === firstSong.fileUrl) {
                replayCurrentSong();
            } else {
                updateDataMainAndPlaySong(firstSong.fileUrl, firstSong.title, firstSong.artist, dataMain);
            }
        }
    };
    const handleShare = () => {
        setShowModal(true); // Khi nhấn vào nút "Sửa", hiển thị modal
    };
    const handleClickOutside = (event) => {
        // Kiểm tra xem click có xảy ra bên ngoài modal không
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false); // Nếu click bên ngoài modal, đóng modal
        }
    };
    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${formattedSeconds}`;
    };
    // fetch(`https://music-web-orcin.vercel.app/api/v1/user/6651f5ad6a163cd0a03c7609`, {
    //                         method: 'PATCH',
    //                         headers: {
    //                             'Content-Type': 'application/json',
    //                         },
    //                         body: JSON.stringify({
    //                             favoriteAlbums: []
    //                         }),
    //                     })
    //                     .then(res => res.json())
    //                     .then(updatedData => {
    //                         setMessage(updatedData);
    //                     })
    //                     .catch(error => {
    //                     console.error('Error increasing views:', error);
    //                 });
    useEffect(()=>{
        fetch(`https://music-web-orcin.vercel.app/api/v1/user/profile`, { credentials: 'include' })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unauthorized');
                }
                return res.json();
            })
            .then(data => {
                setDataUserDetail(data.data);
                setLoading(false); // Đã lấy được thông tin user, set loading thành false
            })
            .catch(error => {
                console.error('Error fetching profile:', error.message);
                setLoading(false); // Không lấy được thông tin user, set loading thành false
            });
    }, []);

    const handleLike = (e) =>{
        console.log(dataUserDetail);
        if(dataUserDetail){
            if(dataUserDetail.favoriteAlbums.length === 0){
                const ans = [...dataUserDetail.favoriteAlbums, infoAlbum._id];
                console.log(ans);
                fetch(`https://music-web-orcin.vercel.app/api/v1/user/${dataUserDetail._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        favoriteAlbums: ans
                    }),
                })
                .then(res => res.json())
                .then(updatedData => {
                    setMessage(updatedData);
                })
                .catch(error => {
                    console.error('Error increasing views:', error);
                });
                

                var newLike = infoAlbum.like +1;
                fetch(`https://music-web-orcin.vercel.app/api/v1/album/${infoAlbum._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        like: newLike
                    }),
                })
                .then(res => res.json())
                .then(updatedData => {
                    setMessage(updatedData);
                })
                .catch(error => {
                    console.error('Error increasing views:', error);
                });

                alert("Successfully added album to favorite collection");
            } else{
                var check =1;
                for(let i=0; i< dataUserDetail.favoriteAlbums.length; i++){
                    if(dataUserDetail.favoriteAlbums[i] === infoAlbum._id){
                        check =0;
                        break;
                    }
                }
                if(check ===1){
                    const ans = [...dataUserDetail.favoriteAlbums, infoAlbum._id];
                        fetch(`https://music-web-orcin.vercel.app/api/v1/user/${dataUserDetail._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    favoriteAlbums: ans
                                }),
                            })
                            .then(res => res.json())
                            .then(updatedData => {
                                setMessage(updatedData);
                            })
                            .catch(error => {
                            console.error('Error increasing views:', error);
                        });
                        
                        var newLike = infoAlbum.like +1;
                        fetch(`https://music-web-orcin.vercel.app/api/v1/album/${infoAlbum._id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                like: newLike
                            }),
                        })
                        .then(res => res.json())
                        .then(updatedData => {
                            setMessage(updatedData);
                        })
                        .catch(error => {
                            console.error('Error increasing views:', error);
                        });

                        alert("Successfully added album to favorite collection");
                }else{
                    alert("This album is already in the favorite collection");
                }
            }
        }else{
            alert("You need login first");
        }
    }

    return (
        <>
            <div className="albumDetail" style={{backgroundImage: `url(${infoAlbum.coverImageUrl})`}}>
                <div className="albumDetail--black"></div>
                <div className="albumDetail__detail">
                    <div className="albumDetail__detail__createBy">{infoAlbum.createdBy}</div>
                    <div className="albumDetail__detail__title">{infoAlbum.title}</div>
                    <div className="albumDetail__detail__likeShare">
                        <div className="albumDetail__detail__likeShare__like" onClick={handleLike}><FaHeart /> <div className="albumDetail__detail__likeShare__like__text">Like</div></div>
                        <div className="albumDetail__detail__likeShare__like" onClick={handleShare}><FaShareAlt /> <div className="albumDetail__detail__likeShare__like__text">Share</div></div>
                    </div>
                    <button onClick={playAlbum} className="albumDetail__detail__play">Play Album</button>
                </div>
                <div className="albumDetail__song">
                    <div className="albumDetail__song__amount">Songs: {dataAlbumDetail.length}</div>
                    {dataMain.map(song => (
                        <div className='albumDetail__song__nameSong'key={song._id}>
                            <div className='albumDetail__song__nameSong__picture' style={{backgroundImage: `url(${song.coverImageUrl})`}}></div>
                            <div className='albumDetail__song__nameSong__name'>
                                <div className='albumDetail__song__nameSong__name__title'>{song.title}</div>
                                <div className='albumDetail__song__nameSong__name__author'>{song.artist}</div>
                            </div>
                            <div className='albumDetail__song__nameSong__time'>
                                {formatDuration(song.duration)} {/* Sử dụng hàm formatDuration để hiển thị thời lượng */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className='backModal' onClick={() => setShowModal(false)}></div>
            )}
            {showModal && (
                <div className="modal" ref={modalRef}>
                    <div className='modal--buttonClose' onClick={() => setShowModal(false)}><IoMdCloseCircleOutline /></div>
                    <div className="modal--content" ref={modalContentRef}>
                        <div className="modal--content__alert">
                            Share this link to your friends
                        </div>
                        <div className="modal--content__link">
                            {currentUrl}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AlbumDetail;
