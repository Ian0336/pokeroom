import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase/firebase.js";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      {user ? console.log(user.uid) : <></>}
      <Routes>
        <Route path="/login" element={<Login user={user} />} />
        <Route path="/signup" element={<Signup user={user} />} />
        <Route
          path="*"
          element={
            user ? <Mainpage uid={user.uid} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
