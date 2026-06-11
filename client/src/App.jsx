import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from "./Views/HomeView";
import RegisterView from "./Views/RegisterView";
import DetailUserView from "./Views/DetailUserView";
import LoginView from "./Views/LoginView";
import AuthLayout from "./layouts/AuthLayout";
import HomeLayout from "./layouts/HomeLayout";
import {} from "react-icons/fa";
import CreateFeedView from "./Views/CreateFeedView";
import UpdateUserView from "./Views/UpdateUserView";
import SearchView from "./Views/SearchView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/create" element={<CreateFeedView />}></Route>
          <Route path="/:username" element={<DetailUserView />} />
          <Route path="/setting" element={<UpdateUserView />}></Route>
          <Route path="/search" element={<SearchView />}></Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
