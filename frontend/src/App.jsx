import Login from './Pages/Login'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, createBrowserRouter, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Nav from './components/Nav/Nav'
import Service from './Pages/Service'
import About from './Pages/About'
import Notification from './components/notification/Notification'

const Container = styled.div`
width:100%;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;


`
const App = () => {


  return (
    <Router>
      <Nav />
      <Container>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/service' element={<Service />} />
        <Route path='/about' element={<About />} />
        </Routes>
        <Notification />
      </Container>
    </Router>
  )
}

export default App

{/* <Main />
        <Login /> */}