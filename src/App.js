import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SongProvider } from "./components/SongContext";
import Home from './layout/Home';
import LayoutDefault from "./layout/LayoutDefault";
import AlbumDetail from "./layout/AlbumDetail";
import TimKiem from "./layout/TimKiem";
import User from "./layout/User";

function App() {

  return (
    <SongProvider>
      <Routes>
        <Route path="/" element={<LayoutDefault />}>
          <Route index element={<Home />} />
          <Route path='album/:id' element={<AlbumDetail />} />
          <Route path="/find" element={<TimKiem />} />
          <Route path="/profile" element={<User />} />
        </Route>
      </Routes>
    </SongProvider>
  );
}

export default App;
