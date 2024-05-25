import React, { useEffect, useRef, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './SongNhac.scss';
import { FaPlay, FaPause, FaBackward } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { SongContext } from '../../components/SongContext';

const SongNhac = () => {
    const { currentSong, currentTitle, currentAuthor, handleNext, handlePrevious } = useContext(SongContext);
    const waveformRef = useRef(null);
    const waveSurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

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

    return (
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
                <div className='songNhac__button__backNext' onClick={handlePrevious}><FaBackward /></div>
                <button onClick={handlePlayPause} className='songNhac__button__play'>
                    {isPlaying ? (<FaPause />) : (<FaPlay />)}
                </button>
                <div className='songNhac__button__backNext' onClick={handleNext}><TbPlayerTrackNextFilled /></div>
            </div>
        </div>
    );
};

export default SongNhac;