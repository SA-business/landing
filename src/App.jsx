import Login from './components/Login/Login'
import Main from './components/Main/Main'
import styled from 'styled-components'

const Container = styled.div`
width:100%;
height: 100vh;
display: flex;
justify-content: center;
align-items: center;
`
const App = () => {
  return (
    <Container>
    {/* <Main /> */}
    <Login />
    </Container>
  )
}

export default App