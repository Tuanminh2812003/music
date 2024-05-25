import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { SongContext } from '../../components/SongContext';
import SongNhac from '../../components/SongNhac';
import './LayoutDefault.scss';

function LayoutDefault() {
    const { currentSong, currentTitle, currentAuthor } = useContext(SongContext);

    return (
        <>
            <div className="layoutDefault">
                <div className="layoutDefault__header">
                    <ul className='layoutDefault__header__menu'>
                        <Link to={"/"}>
                            <li>
                                Explore
                            </li>
                        </Link>
                        <Link to={"/find"}>
                            <li>
                                Find Song
                            </li>
                        </Link>
                        <Link to={"/profile"}>
                            <li>
                                My Song
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="layoutDefault__body">
                    <Outlet />
                </div>
                {currentSong && currentAuthor && currentTitle && (
                    <div className="layoutDefault__footer">
                        <SongNhac audioUrl={currentSong} title={currentTitle} author={currentAuthor} />
                    </div>
                )}
            </div>
        </>
    );
}

export default LayoutDefault;