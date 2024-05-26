import React, { useEffect, useState, useContext } from 'react';
import { SongContext } from '../../components/SongContext';
import './Home.scss';
import { Link } from 'react-router-dom';
import { FaPlay, FaPause, FaBackward, FaHeart } from "react-icons/fa";
import diaThan from "../../image/diathan.png";

function Home() {
    const [data, setData] = useState([]);
    const [dataAlbum, setDataAlbum] = useState([]);
    const { updateDataMainAndPlaySong, allSongs, replayCurrentSong, currentSong } = useContext(SongContext);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/music`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    const shuffledSongs = data.data.sort(() => Math.random() - 0.5);
                    setData(shuffledSongs);
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
                    if(data.data[i].status === "public"){
                        ans.push(data.data[i])
                    }
                }
                setDataAlbum(ans);
            });
    }, []);

    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${formattedSeconds}`;
    };

    const handleSongClick = (song) => {
        if (currentSong === song.fileUrl) {
            replayCurrentSong();
        } else {
            updateDataMainAndPlaySong(song.fileUrl, song.title, song.artist, [song, ...allSongs.filter(s => s._id !== song._id)]);
        }
    };

    return (
        <>
            <div className='album'>
                <div className='album__title'>
                    Album
                </div>
                <div className='album__innerAlbum'>
                    {dataAlbum.map(album => (
                        <Link to={"album/" + album._id} className='album__innerAlbum__nameAlbum' key={album.id} style={{backgroundImage: `url(${album.coverImageUrl})`}}>
                            <img src={diaThan} className='album__innerAlbum__nameAlbum__diathan'/>
                            <div className='album__innerAlbum__nameAlbum__createdBy'>
                                {album.createdBy}
                            </div>
                            <div className='album__innerAlbum__nameAlbum__title'>
                                {album.title}
                            </div>
                            <div className='album__innerAlbum__nameAlbum__like'>
                                <FaHeart />
                                <div className='album__innerAlbum__nameAlbum__like__text'>
                                    {album.like}
                                </div>
                                liked
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className='song'>
                <div className='song__title'>
                    Song
                </div>
                {data.map(song => (
                    <div className='song__nameSong' onClick={() => handleSongClick(song)} key={song._id}>
                        <div className='song__nameSong__picture' style={{backgroundImage: `url(${song.coverImageUrl})`}}></div>
                        <div className='song__nameSong__name'>
                            <div className='song__nameSong__name__title'>{song.title}</div>
                            <div className='song__nameSong__name__author'>{song.artist}</div>
                        </div>
                        <div className='song__nameSong__time'>
                            {formatDuration(song.duration)} {/* Sử dụng hàm formatDuration để hiển thị thời lượng */}
                        </div>
                        <div className='song__nameSong__play'><FaPlay /></div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;
