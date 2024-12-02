import { BrowserRouter, Routes, Route } from "react-router-dom"
import Page from "./pages/Page"
import PlaceDetails from "./pages/PlaceDetails"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/details/:place" element={<PlaceDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
