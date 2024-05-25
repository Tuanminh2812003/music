import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from 'react';
import { SongContext } from '../../components/SongContext';

function AlbumDetail() {
    const params = useParams();
    const { updateDataMainAndPlaySong, allSongs, replayCurrentSong, currentSong } = useContext(SongContext);
    const [dataAlbumDetail, setDataAlbumDetail] = useState([]);
    const [dataMain, setDataMainState] = useState([]);

    useEffect(() => {
        fetch(`https://music-web-orcin.vercel.app/api/v1/album/${params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    setDataAlbumDetail(data.data.songs);
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

    return (
        <>
            <button onClick={playAlbum}>Play Album</button>
            {dataMain.map((songAlbum, index) => (
                <div key={songAlbum._id} className="songAlbum">
                    {songAlbum.title}
                </div>
            ))}
        </>
    );
}

export default AlbumDetail;