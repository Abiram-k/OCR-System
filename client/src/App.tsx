import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/ui/spinner";
const Home = lazy(() => import("./page/Home"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
