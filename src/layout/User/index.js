import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaPlay, FaPause, FaBackward, FaHeart } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import diaThan from "../../image/diathan.png";
import "./User.scss";

function User(){
    const [dataUserDetail, setDataUserDetail] = useState(null); // Thay đổi từ [] thành null
    const [loading, setLoading] = useState(true); // Thêm biến loading để theo dõi trạng thái fetch
    const [dataAlbum, setDataAlbum] = useState([]);
    const [userLikeAlbum, setUserLikeAlbum] = useState([]);
    const [userCreateAlbum, setUserCreateAlbum] = useState([]);
    const [showModalUser, setShowModalUser] = useState(false); // State để kiểm soát hiển thị modal
    const [showModalSucces, setShowModalSucces] = useState(false); // State để kiểm soát hiển thị modal
    const modalRef = useRef(null); // Ref cho modal
    const modalContentRef = useRef(null);

    useEffect(() => {
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

    const [message, setMessage] = useState([]);
    // useEffect(()=>{
    //     fetch(`https://music-web-orcin.vercel.app/api/v1/album`, {
    //         method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 title: "Minh Album",
    //                 songs: ["66506456e1eae930222e1f3e", "66505553f2554d64b278aa50"],
    //                 createdBy: "Admin",
    //                 status: "public",
    //                 coverImageUrl: "https://th.bing.com/th/id/OIP.p7jeZy1waejSRS2fRnREQwHaHa?rs=1&pid=ImgDetMain",
    //             }),
    //         })
    //         .then(response => response.json())
    //         .then(data => setMessage(data))
    //         .catch(error => console.error('Error:', error));
    //     }, []);
    

    useEffect(() => {
        if(dataUserDetail){
            fetch(`https://music-web-orcin.vercel.app/api/v1/album`)
            .then(res => res.json())
            .then(data => {
                var likeAlbum = [];
                var createAlbum = [];
                for(let i=0; i< dataUserDetail.favoriteAlbums.length; i++){
                    for(let j=0; j< data.data.length; j++){
                        if(dataUserDetail.favoriteAlbums[i] === data.data[j]._id){
                            likeAlbum.push(data.data[j]);
                        }
                    }
                }
                for(let i=0; i< dataUserDetail.albumCreated.length; i++){
                    for(let j=0; j< data.data.length; j++){
                        if(dataUserDetail.albumCreated[i] === data.data[j]._id){
                            createAlbum.push(data.data[j]);
                        }
                    }
                }
                setUserLikeAlbum(likeAlbum); // Gán dữ liệu vào state userLikeAlbum
                setUserCreateAlbum(createAlbum);
                console.log(likeAlbum);
                console.log(createAlbum);
            });
        }
    }, [dataUserDetail]);

    // useEffect(()=> {
    //     if(dataUserDetail){
            // fetch(`https://music-web-orcin.vercel.app/api/v1/user/6651f5ad6a163cd0a03c7609`, {
            //             method: 'PATCH',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 favoriteAlbums: ["66502ce28fa7bc568d9b05bb", "6652220f641de2dc438b3e77"],
            //             }),
            //         })
            //         .then(res => res.json())
            //         .then(updatedData => {
            //             setMessage(updatedData);
            //         })
            //         .catch(error => {
            //         console.error('Error increasing views:', error);
            //     });
    //     }
    // }, []);

    // useEffect(()=> {
            // fetch(`https://music-web-orcin.vercel.app/api/v1/album/6652220f641de2dc438b3e77`, {
            //             method: 'PATCH',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 status: "public",
            //                 createdBy: "Admin",
            //                 coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIjlCYUDkjpp_fQ9-7Dd6MeD9ACghIaEHfdABQfEPCA&s"
            //             }),
            //         })
            //         .then(res => res.json())
            //         .then(updatedData => {
            //             setMessage(updatedData);
            //         })
            //         .catch(error => {
            //         console.error('Error increasing views:', error);
            //     });

    // }, []);
    
    // Thay đổi điều kiện để kiểm tra loading và dataUserDetail

    const handleButton = (e) =>{
        setShowModalUser(true); // Khi nhấn vào nút "Sửa", hiển thị modal
    }
    const handleClickOutside = (event) => {
        // Kiểm tra xem click có xảy ra bên ngoài modal không
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModalUser(false); // Nếu click bên ngoài modal, đóng modal
            setShowModalSucces(false);
        }
    };
    const checkImageUrl = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            return contentType && contentType.startsWith('image/');
        } catch (error) {
            console.error('Error checking image URL:', error);
            return false;
        }
    };

    let fetchCount = 0;

    // Hàm xử lý khi tạo thành công
    const handleCreate = async (e) => {
        e.preventDefault();
        // Tăng biến đếm khi bắt đầu một yêu cầu fetch mới
        fetchCount++;
        const title = e.target[0].value;
        const picture = e.target[1].value;
        const createBy = dataUserDetail.username;
        if (title.length > 10) {
            alert('Title must be 10 characters or less.');
            // Giảm biến đếm khi một yêu cầu fetch hoàn thành
            fetchCount--;
            return;
        }
        const isValidImageUrl = await checkImageUrl(picture);
        if (!isValidImageUrl) {
            alert('Picture must be a valid image URL.');
            // Giảm biến đếm khi một yêu cầu fetch hoàn thành
            fetchCount--;
            return;
        }
        try {
            // Gửi yêu cầu POST để tạo album mới
            const createAlbumResponse = await fetch(`https://music-web-orcin.vercel.app/api/v1/album`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    createdBy: createBy,
                    coverImageUrl: picture,
                }),
            });
            
            const createAlbumData = await createAlbumResponse.json();
            setMessage(createAlbumData);

            // Lấy danh sách album mới sau khi tạo
            const getAlbumsResponse = await fetch(`https://music-web-orcin.vercel.app/api/v1/album`);
            const albumsData = await getAlbumsResponse.json();

            // Lọc các album do user tạo
            const newAlbum = albumsData.data.filter(album => album.createdBy === createBy).map(album => album._id);

            console.log(newAlbum);
            console.log(dataUserDetail._id);

            // Cập nhật user với albumCreated mới
            const updateUserResponse = await fetch(`https://music-web-orcin.vercel.app/api/v1/user/${dataUserDetail._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    albumCreated: newAlbum
                }),
            });

            const updatedUserData = await updateUserResponse.json();
            setMessage(updatedUserData);

            // Đánh dấu tạo thành công để hiển thị thông báo
            setShowModalUser(false);
            setShowModalSucces(true);

        } catch (error) {
            console.error('Error:', error);
            alert("Failed to create album. Please try again."); // Thông báo khi có lỗi
        } finally {
            // Giảm biến đếm khi một yêu cầu fetch hoàn thành hoặc gặp lỗi
            fetchCount--;
        }
    };

    // Bắt sự kiện trước khi tải lại trang
    window.addEventListener('beforeunload', (event) => {
        // Nếu có yêu cầu fetch đang được thực hiện, cảnh báo người dùng
        if (fetchCount > 0) {
            event.preventDefault();
            event.returnValue = 'Có yêu cầu đang được xử lý. Bạn có chắc muốn tải lại trang không?';
        }
    });

    const handleDeleteCreate = (event, albumId) => {
        event.stopPropagation();
        event.preventDefault();
    
        // Gửi yêu cầu PATCH để cập nhật danh sách album đã tạo của user, loại bỏ album đã xóa
        fetch(`https://music-web-orcin.vercel.app/api/v1/user/${dataUserDetail._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                albumCreated: dataUserDetail.albumCreated.filter(id => id !== albumId),
            }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update user album list');
            }
            // Loại bỏ album đã xóa khỏi state userCreateAlbum
            setUserCreateAlbum(prevAlbums => prevAlbums.filter(album => album._id !== albumId));
            return res.json();
        })
        .then(updatedUserData => {
            setMessage(updatedUserData);
        })
        .catch(error => {
            console.error('Error deleting album:', error);
        });
    
        // Gửi yêu cầu DELETE để xóa album từ cơ sở dữ liệu
        fetch(`https://music-web-orcin.vercel.app/api/v1/album/${albumId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to delete album');
            }
            return res.json();
        })
        .then(updatedAlbumData => {
            setMessage(updatedAlbumData);
        })
        .catch(error => {
            console.error('Error deleting album:', error);
        });
    };
    

    const handleDeleteFavorite = async (event, albumId) => {
        event.stopPropagation();
        event.preventDefault();
    
        try {
            // Xóa album khỏi danh sách yêu thích của user
            const updateUserResponse = await fetch(`https://music-web-orcin.vercel.app/api/v1/user/${dataUserDetail._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    favoriteAlbums: dataUserDetail.favoriteAlbums.filter(id => id !== albumId),
                }),
            });
            const updatedUserData = await updateUserResponse.json();
            console.log('Updated user:', updatedUserData);
    
            // Loại bỏ album đã xóa khỏi state userLikeAlbum
            setUserLikeAlbum(prevAlbums => prevAlbums.filter(album => album._id !== albumId));
        } catch (error) {
            console.error('Error deleting favorite album:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`https://music-web-orcin.vercel.app/api/v1/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log(response);
            } else {
                const errorData = await response.json();
                console.error("Logout failed:", errorData);
                alert("Logout không thành công");
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Có lỗi xảy ra khi logout");
        }
    };
    
    return(
        <>
            {loading ? ( // Nếu đang loading, hiển thị chữ "Đăng nhập"
                <Link to={"https://music-web-orcin.vercel.app/api/v1/user/auth/loginGoogle"}>Sign in to view your song collection</Link>
            ) : dataUserDetail ? ( // Nếu đã lấy được thông tin user, hiển thị thông tin user
                <div className="user">
                    <div className="user__picture" style={{backgroundImage: `url(${dataUserDetail.picture})`}}></div>
                    <div className="user__username">
                        User: {dataUserDetail.username}
                    </div>
                    <div className="user__logOut" onClick={handleLogout}>Log Out</div>
                    <div className='album'>
                        <div className='album__title'>
                            Album made by me
                        </div>
                        <div className="album__disc">
                            Press the heart button on the music player bar to add the song to the album you have created.
                        </div>
                        <div className="album__plus">
                            <div className="album__plus__button" onClick={handleButton}>
                                Create new album
                            </div>
                        </div>
                        <div className='album__innerAlbum'>
                            {userCreateAlbum.map(album => (
                                <Link to={`/album/${album._id}`} className='album__innerAlbum__nameAlbum' key={album.id} style={{backgroundImage: `url(${album.coverImageUrl})`}}>
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
                                    <div className="album__innerAlbum__nameAlbum__delete" onClick={(event) => handleDeleteCreate(event, album._id)}>
                                        DELETE ALBUM
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='album'>
                        <div className='album__title'>
                            My favorite Album
                        </div>
                        <div className="album__disc">
                            To add an album to your favorites list, please visit the album and click the "favorite" button.
                        </div>
                        <div className='album__innerAlbum'>
                            {userLikeAlbum.map(album => (
                                <Link to={`/album/${album._id}`} className='album__innerAlbum__nameAlbum' key={album.id} style={{backgroundImage: `url(${album.coverImageUrl})`}}>
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
                                    <div className="album__innerAlbum__nameAlbum__delete" onClick={(event) => handleDeleteFavorite(event, album._id)}>
                                        DELETE ALBUM
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : ( // Nếu không lấy được thông tin user, hiển thị chữ "Đăng nhập"
                <Link to={"https://music-web-orcin.vercel.app/api/v1/user/auth/loginGoogle"}>Sign in to view your song collection</Link>
            )}

            {showModalUser && (
                <div className='user__backModal' onClick={() => setShowModalUser(false)}></div>
            )}
            {showModalUser && (
                <div className="user__modal" ref={modalRef}>
                    <div className='user__modal--buttonClose' onClick={() => setShowModalUser(false)}><IoMdCloseCircleOutline /></div>
                    <div className="user__modal--content" ref={modalContentRef}>
                        <div className="user__modal--content__title">
                            Create new album!
                        </div>
                        <form className="user__modal--content__form" onSubmit={handleCreate}>
                            <input className="user__modal--content__form__input" placeholder="Title" required></input>
                            <input className="user__modal--content__form__input" placeholder="Picture URL" required></input>
                            <button className="user__modal--content__form__button">Create</button>
                        </form>
                    </div>
                </div>
            )}

            {showModalSucces && (
                <div className='user__backModal' onClick={() => setShowModalSucces(false)}></div>
            )}
            {showModalSucces && (
                <div className="user__modal" ref={modalRef}>
                    <div className='user__modal--buttonClose' onClick={() => setShowModalSucces(false)}><IoMdCloseCircleOutline /></div>
                    <div className="user__modal--content" ref={modalContentRef}>
                        Album created successfully. Please reload the webpage.
                    </div>
                </div>
            )}
        </>
    )
}

export default User;
