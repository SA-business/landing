import Nav from '../Nav/Nav'
import styled from 'styled-components'

const  Container = styled.div`
width:1400px;
height: 100vh;
`


const Main = () => {
  return (
    <Container>
        <Nav />
    </Container>
  )
}

export default Main