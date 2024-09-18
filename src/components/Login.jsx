import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
width: 300px;
background-color: orange;
`

const Login = () => {
  return (
    <Container>
        <h1>Login</h1>
        <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </Container>
  )
}

export default Login