import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaPlay, FaPause, FaBackward, FaHeart } from "react-icons/fa";
import diaThan from "../../image/diathan.png";
import "./User.scss";

function User(){
    const [dataUserDetail, setDataUserDetail] = useState(null); // Thay đổi từ [] thành null
    const [loading, setLoading] = useState(true); // Thêm biến loading để theo dõi trạng thái fetch
    const [dataAlbum, setDataAlbum] = useState([]);
    const [userLikeAlbum, setUserLikeAlbum] = useState([]);
    const [userCreateAlbum, setUserCreateAlbum] = useState([]);

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
    //         fetch(`https://music-web-orcin.vercel.app/api/v1/user/6651f5ad6a163cd0a03c7609`, {
    //                     method: 'PATCH',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({
    //                         favoriteAlbums: ["66502ce28fa7bc568d9b05bb", "6652220f641de2dc438b3e77"],
    //                     }),
    //                 })
    //                 .then(res => res.json())
    //                 .then(updatedData => {
    //                     setMessage(updatedData);
    //                 })
    //                 .catch(error => {
    //                 console.error('Error increasing views:', error);
    //             });
    //     }
    // }, []);

    // useEffect(()=> {
    //         fetch(`https://music-web-orcin.vercel.app/api/v1/album/6652220f641de2dc438b3e77`, {
    //                     method: 'PATCH',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({
    //                         status: "public",
    //                         createdBy: "Admin",
    //                         coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEIjlCYUDkjpp_fQ9-7Dd6MeD9ACghIaEHfdABQfEPCA&s"
    //                     }),
    //                 })
    //                 .then(res => res.json())
    //                 .then(updatedData => {
    //                     setMessage(updatedData);
    //                 })
    //                 .catch(error => {
    //                 console.error('Error increasing views:', error);
    //             });

    // }, []);
    
    // Thay đổi điều kiện để kiểm tra loading và dataUserDetail
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
                    <div className='album'>
                        <div className='album__title'>
                            Album made by me
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
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='album'>
                        <div className='album__title'>
                            My favorite Album
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
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : ( // Nếu không lấy được thông tin user, hiển thị chữ "Đăng nhập"
                <Link to={"https://music-web-orcin.vercel.app/api/v1/user/auth/loginGoogle"}>Sign in to view your song collection</Link>
            )}
        </>
    )
}

export default User;
