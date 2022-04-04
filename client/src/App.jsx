import "./App.css";
import {
  Bid,
  Chat,
  FindPartner,
  FindTalent,
  FindWork,
  FreelancerProfile,
  Home,
  LoginSignup,
  PostWork,
  UserProfile,
} from "./pages/import";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DragAndDropImg, Navbar } from "./components/import";
import FindTalentParams from "./pages/FindTalent/FindTalentParams";
import FindWorkParams from "./pages/FindWork/FindWorkParams";



function App() {
  
  return (
    <BrowserRouter className = "App">
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "findtalent" element = {<FindTalent />} />

        <Route path = "/findtalent/category" element = {<FindTalentParams />} />        
        <Route path = "/findtalent/postwork" element = {<PostWork/>} />


        <Route path = "/findwork" element = {<FindWork type="findwork"/>} />
        <Route path = "/findwork/category" element = {<FindWorkParams />} />
        <Route path = "/findwork/bid" element = {<Bid/>}/>

        <Route path = "/findpartner" element = {<FindPartner />} />
        
        <Route path = "/freelancerprofile" element = {<FreelancerProfile />} />
        
        <Route path = "/userprofile" element = {<UserProfile />} />
        <Route path = "/postrequest" element = {<PostWork />} />

        <Route path = "/login" element = {<LoginSignup status="login" />} />
        <Route path = "/signup" element = {<LoginSignup status="signup" />} />
        
        <Route path = "/chat" element = {<Chat />} />

        
        
        <Route
          path = "*"
          element = {
            <div className = "no-elem">
              <Navbar />
              <h1>no element attached with this path</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
