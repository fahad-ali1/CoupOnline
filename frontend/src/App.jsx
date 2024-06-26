import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoomPage from "./pages/room/room.page";
import StatsPage from "./pages/stats/stats.page";
import ProfilePage from "./pages/profile/profile.page";
import LoginPage from "./pages/login/login.page";
import CreationPage from "./pages/creation/creation.page.jsx";
import LobbyPage from "./pages/lobby/lobby.page.jsx";
import DropDownMenu from "./components/dropDownMenu/dropdownmenu.component";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

function App() {
  return (
    <div className="bg-page text-textColor-base">
      <BrowserRouter basename="/CoupOnline">
        <DropDownMenu />
        <QueryClientProvider client={queryClient} contextSharing={true}>
          <Routes>
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/creation" element={<CreationPage />}></Route>
            <Route path="/room" element={<RoomPage />}></Route>
            <Route path="/room/:roomId" element={<LobbyPage />}></Route>
            <Route path="/global-stats" element={<StatsPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            {/* <Route path="test" element={<TestPage />} /> */}
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
