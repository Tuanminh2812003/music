import React, { createContext, useState, useEffect } from 'react';

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState('');
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentAuthor, setCurrentAuthor] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allSongs, setAllSongs] = useState([]);
    const [dataMain, setDataMain] = useState([]);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/music`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    const shuffledSongs = data.data.sort(() => Math.random() - 0.5);
                    setAllSongs(shuffledSongs);
                }
            });
    }, []);

    const updateCurrentSong = (songUrl, title, author) => {
        setCurrentSong(songUrl);
        setCurrentTitle(title);
        setCurrentAuthor(author);
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const playRandomList = (initialSong) => {
        if (allSongs.length > 0) {
            shuffleArray(allSongs);
            const shuffledSongs = [initialSong, ...allSongs.filter(song => song._id !== initialSong._id)];
            setDataMain(shuffledSongs);
            setCurrentIndex(0);
            updateCurrentSong(initialSong.fileUrl, initialSong.title, initialSong.artist);
        }
    };

    const updateDataMainAndPlaySong = (songUrl, title, author, newDataMain) => {
        if (currentSong !== songUrl) {
            setDataMain(newDataMain);
            setCurrentIndex(0);
            updateCurrentSong(songUrl, title, author);
        } else {
            // Nếu bài hát hiện tại là bài cần phát lại
            setDataMain(newDataMain);
            setCurrentIndex(0);
            updateCurrentSong(songUrl, title, author);
        }
    };

    const replayCurrentSong = () => {
        // Phát lại bài hát hiện tại từ đầu
        setCurrentIndex(0);
        updateCurrentSong(currentSong, currentTitle, currentAuthor);
    };

    useEffect(() => {
        if (dataMain.length > 0 && currentIndex >= 0 && currentIndex < dataMain.length) {
            const currentSong = dataMain[currentIndex];
            updateCurrentSong(currentSong.fileUrl, currentSong.title, currentSong.artist);
        }
    }, [currentIndex, dataMain]);

    const handleNext = () => {
        if (dataMain.length > 0) {
            const nextIndex = (currentIndex + 1) % dataMain.length;
            setCurrentIndex(nextIndex);
        }
    };

    const handlePrevious = () => {
        if (dataMain.length > 0) {
            const prevIndex = (currentIndex - 1 + dataMain.length) % dataMain.length;
            setCurrentIndex(prevIndex);
        }
    };

    return (
        <SongContext.Provider value={{
            currentSong,
            currentTitle,
            currentAuthor,
            currentIndex,
            dataMain,
            allSongs,
            updateCurrentSong,
            setCurrentIndex,
            setDataMain,
            handleNext,
            handlePrevious,
            playRandomList,
            updateDataMainAndPlaySong,
            replayCurrentSong
        }}>
            {children}
        </SongContext.Provider>
    );
};