import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './Layouts'
import { Home } from './Pages'
import './App.css'
import { NoMatch } from './Components'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home />}></Route>
        </Route>

        <Route path="*" element={<NoMatch></NoMatch>} />
      </Routes>
    </BrowserRouter>
  )
}
