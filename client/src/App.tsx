import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/ui/spinner";
import { Toaster } from "sonner";

const Home = lazy(() => import("./page/Home"));

function App() {
  return (
    <>
      <Toaster  position="bottom-right" />
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
