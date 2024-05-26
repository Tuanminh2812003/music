import React, { useEffect, useRef, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './SongNhac.scss';
import { FaPlay, FaPause, FaBackward, FaHeart } from "react-icons/fa";
import { ImVolumeIncrease } from "react-icons/im";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { SongContext } from '../../components/SongContext';
import { Link } from 'react-router-dom';

const SongNhac = () => {
    const { currentSong, currentTitle, currentAuthor, handleNext, handlePrevious } = useContext(SongContext);
    const waveformRef = useRef(null);
    const waveSurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1); // Thêm state cho âm lượng
    const[data, setData] = useState([]);
    const [dataAlbum, setDataAlbum] = useState([]);
    const [dataUserDetail, setDataUserDetail] = useState(null); // Thay đổi từ [] thành null
    const [loading, setLoading] = useState(true); // Thêm biến loading để theo dõi trạng thái fetch
    const [showModalLoveSong, setShowModalLoveSong] = useState(false); // State để kiểm soát hiển thị modal
    const modalRef = useRef(null); // Ref cho modal
    const modalContentRef = useRef(null);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/music`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setData(data.data);
                }
            });
    }, []);
    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/album`)
            .then(res => res.json())
            .then(data => {
                // if (data && data.data) {
                //     setDataAlbum(data.data);
                // }
                var ans = [];
                for(let i=0; i< data.data.length; i++){
                    if(data.data[i].status === "private"){
                        ans.push(data.data[i])
                    }
                }
                setDataAlbum(ans);
            });
    }, []);

    useEffect(() => {
        if (waveformRef.current) {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#313132',
                cursorColor: '#313132',
                barWidth: 3,
                barRadius: 3,
                cursorWidth: 1,
                height: 35,
                barGap: 3,
            });

            waveSurferRef.current.on('ready', () => {
                waveSurferRef.current.play();
                setIsPlaying(true);
            });

            waveSurferRef.current.on('error', (e) => {
                console.error('Error decoding audio data:', e);
            });

            waveSurferRef.current.on('finish', () => {
                handleNext();
                console.log("da phat xong bai hat");
            });

            return () => {
                waveSurferRef.current.destroy();
            };
        }
    }, [handleNext]);

    useEffect(() => {
        if (waveSurferRef.current && currentSong) {
            waveSurferRef.current.load(currentSong);
            waveSurferRef.current.on('ready', () => {
                waveSurferRef.current.play();
            });
        }
    }, [currentSong]);

    const handlePlayPause = () => {
        if (waveSurferRef.current) {
            if (isPlaying) {
                waveSurferRef.current.pause();
            } else {
                waveSurferRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (waveSurferRef.current) {
            waveSurferRef.current.setVolume(newVolume);
        }
    };

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
    const handleClickOutside = (event) => {
        // Kiểm tra xem click có xảy ra bên ngoài modal không
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModalLoveSong(false); // Nếu click bên ngoài modal, đóng modal
        }
    };

    const [userLikeAlbum, setUserLikeAlbum] = useState([]);
    const [loveSong, setLoveSong] = useState([]);
    const handleLikeSong = () => {
        if (currentSong) {
            if(dataUserDetail){
                for(let i=0; i< data.length; i++){
                    if(currentSong === data[i].fileUrl){
                        setLoveSong(data[i]._id);
                        break;
                    }
                }
                const rightAlbum = [];
                for(let i =0; i< dataUserDetail.albumCreated.length; i++){
                    for(let j=0; j <dataAlbum.length; j++){
                        if(dataUserDetail.albumCreated[i] === dataAlbum[j]._id){
                            rightAlbum.push(dataAlbum[j]);
                            break;
                        }
                    }
                }
                setUserLikeAlbum(rightAlbum);
                setShowModalLoveSong(true);
            }else{
                alert("You need login first");
            }
        }
    };

    const handleAddSong = async (event, albumId) => {
        if (loveSong) {
            try {
                const res = await fetch(`https://music-web-orcin.vercel.app/api/v1/album/${albumId}`);
                const data = await res.json();
    
                let ans1 = [];
                if (data && data.data) {
                    ans1 = data.data.songs;
                }
    
                // Kiểm tra nếu loveSong đã tồn tại trong ans1
                if (ans1.includes(loveSong)) {
                    alert("This song is already in the album");
                } else {
                    const ans2 = [...ans1, loveSong];
                    console.log(ans1);
                    console.log(ans2);
    
                    await fetch(`https://music-web-orcin.vercel.app/api/v1/album/${albumId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            songs: ans2
                        }),
                    });
    
                    alert("Successfully added song to album");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };
    
    
    return (
        <>
            <div className='songNhac'>
                <div className='songNhac__songInfor'>
                    <div className='songNhac__songInfor__title'>
                        {currentTitle} 
                    </div>
                    <div className='songNhac__songInfor__author'>
                        - {currentAuthor}
                    </div>
                </div>
                <div ref={waveformRef} className='songNhac__wave' />
                <div className='songNhac__button'>
                    <div className='songNhac__button__like' onClick={handleLikeSong}><FaHeart /></div>
                    <div className='songNhac__button__backNext' onClick={handlePrevious}><FaBackward /></div>
                    <button onClick={handlePlayPause} className='songNhac__button__play'>
                        {isPlaying ? (<FaPause />) : (<FaPlay />)}
                    </button>
                    <div className='songNhac__button__backNext' onClick={handleNext}><TbPlayerTrackNextFilled /></div>
                    <div className='songNhac__button__volume'>
                        <label htmlFor="volume" className='songNhac__button__volume__label'><ImVolumeIncrease /></label>
                        <input className='songNhac__button__volume__input'
                            type="range" 
                            id="volume" 
                            name="volume"
                            min="0" 
                            max="1" 
                            step="0.01" 
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </div>
                </div>
            </div>

            {showModalLoveSong && (
                <div className='loveSong__backModal' onClick={() => setShowModalLoveSong(false)}></div>
            )}
            {showModalLoveSong && (
                <div className="loveSong__modal" ref={modalRef}>
                    <div className='loveSong__modal--buttonClose' onClick={() => setShowModalLoveSong(false)}><IoMdCloseCircleOutline /></div>
                    <div className="loveSong__modal--content" ref={modalContentRef}>
                        <div className='loveSong__modal--content__title'>Pick a album to add this song</div>
                        <div className='inner'>
                            {userLikeAlbum.map(album => (
                                <div className='loveSong__modal--content__inner' key={album._id} onClick={(event) => handleAddSong(event, album._id)}>
                                    <div className='loveSong__modal--content__inner__picture' style={{backgroundImage: `url(${album.coverImageUrl})`}}></div>
                                    <div className='loveSong__modal--content__inner__title'>{album.title}</div>
                                </div>
                            ))}
                        </div>
                        <Link to='/profile' className='loveSong__modal--content__disc'>Create new album?</Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default SongNhac;
