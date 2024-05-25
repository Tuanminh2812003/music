import React, { useEffect, useState, useContext } from 'react';
import { SongContext } from '../../components/SongContext';
import './TimKiem.scss';
import { Link } from 'react-router-dom';
import { FaPlay, FaPause, FaBackward } from "react-icons/fa";

function TimKiem() {
    const [data, setData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const { updateDataMainAndPlaySong, allSongs, replayCurrentSong, currentSong } = useContext(SongContext);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/music`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setData(data.data);
                }
            });
    }, []);

    

    const handleSubmit = (e) => {
        e.preventDefault();
        const results = data.filter(song => 
            song.title.toLowerCase().includes(e.target[0].value.toLowerCase())
        );
        setSearchResults(results);
    }

    const handleSongClick = (song) => {
        if (currentSong === song.fileUrl) {
            replayCurrentSong();
        } else {
            updateDataMainAndPlaySong(song.fileUrl, song.title, song.artist, [song, ...allSongs.filter(s => s._id !== song._id)]);
        }
    };
    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${formattedSeconds}`;
    };

    return (
        <>
            <div className='timKiem'>
                <form className='timKiem__form' onSubmit={handleSubmit}>
                    <input type='text' className='timKiem__form__input' placeholder="Song's name" />
                    <button className='timKiem__form__button'>Find</button>
                </form>
                <div className='timKiem__results'>
                    {searchResults.map((song, index) => (
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
            </div>
        </>
    );
}

export default TimKiem;
