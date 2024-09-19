import React from 'react'
import styled from 'styled-components'
import LoginButton from './Auth0Login'
import LogoutButton from './Auth0Logout'

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
        <LoginButton />
        <LogoutButton />
    </Container>
  )
}

export default Login