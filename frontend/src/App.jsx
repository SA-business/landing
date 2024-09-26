import Login from './Pages/Login'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, createBrowserRouter, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Nav from './components/Nav/Nav'
import Service from './Pages/Service'
import About from './Pages/About'
import Notification from './components/notification/Notification'
import ResetPassword from './Pages/ResetPassword'

const Container = styled.div`
display: flex;
justify-content: center;
`

const Wrapper = styled.div`
width:1400px;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
border-left: 1px solid black;
border-right: 1px solid black;
`

const App = () => {


  return (
    <Router>
      <Container>
      <Nav />
      <Wrapper>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/service' element={<Service />} />
        <Route path='/about' element={<About />} />
        <Route path='/reset-password/:userId/:token' element={<ResetPassword />} />
        </Routes>
        <Notification />
      </Wrapper>
      </Container>
    </Router>
  )
}

export default App

{/* <Main />
        <Login /> */}