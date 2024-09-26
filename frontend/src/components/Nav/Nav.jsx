import React, { useContext } from 'react'
import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'

const Container = styled.div`
width: 100%;
height: 80px;
position: fixed;
top: 0;
left: 0;
background-color: #ffffff;
display: flex;
justify-content: space-around;
align-items: center;
padding: 10px 0px;
z-index: 100;
border-bottom: 1px solid #000000;

.logOut {
padding: 10px 20px;
border-radius: 20px;
background-color: #dac4c4;
color: white;
font-size: 20px;
border: none;
cursor: pointer;
}
`

const LogoContainer = styled.div`
display: flex;
align-items: center;
gap: 30px;
padding: 20px;

p {
    font-size: 20px;
    color: #000000;
}

img {
    height: 50px;
    object-fit: cover;
}
`

const NavItems = styled.ul`
height: 100%;
display: flex;
justify-content: center;
align-items: center;
gap: 20px;
list-style: none;
padding: 0px;
`

const NavItem = styled.li`
padding: 20px;
font-size: 20px;
color: #000000;
text-decoration: none;
margin: 0 20px;
cursor: pointer;
color: #424242da;
`

const LoginButton = styled.button`
padding: 10px 20px;
border-radius: 20px;
background-color: #d6d6d6;
color: white;
font-size: 20px;
border: none;
cursor: pointer;
`

const StyledNavLink = styled(NavLink)`
text-decoration: none;

&.active {
    background-color: #e0e0e0a4;
    border-radius: 20px;
    text-decoration: underline;
}
`

const ProfileContainer = styled.div`
border : 1px solid #000000;
height: 100%;
width: 400px;
display: flex;
justify-content: space-around;
align-items: center;
border-radius: 20px;

img {
    height: 50px;
    width: 50px;
    object-fit: cover;
    border-radius: 50%;
    background-color: #e4e4e489
};

p {
    background-color: #cccccc84;
    border-radius: 10px;
    padding: 15px;
}

`

const Nav = () => {
    const navigate = useNavigate()
    let { isAuthenticated, setIsAuthenticated, user } = useContext(AuthContext)

    const handleLogout = () => {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        navigate('/')
        toast.success('Logout successfully')
    }

    return (
        <Container>
            <LogoContainer>
                <img src='../../loginIcon.png' />
                <p>Internship</p>
            </LogoContainer>

            <NavItems>
                <StyledNavLink to="/" activeclassname="active-link"
                ><NavItem>Home</NavItem></StyledNavLink>
                <StyledNavLink to="/about" activeclassname="active-link"
                ><NavItem>About</NavItem></StyledNavLink>
                <StyledNavLink to="/service" activeclassname="active-link"
                ><NavItem>Service</NavItem></StyledNavLink>
                <StyledNavLink to="/profile" activeclassname="active-link"
                ><NavItem>Profile</NavItem></StyledNavLink>
            </NavItems>

            <ProfileContainer>
                <img src="./public/defaultAvatar.png"></img>
                <p> {user ? user.email : "訪客simcard"}</p>

                {!isAuthenticated ? <StyledNavLink to="/login" activeclassname="active-link" ><LoginButton>Login</LoginButton></StyledNavLink> : <button className='logOut' onClick={handleLogout}>Logout</button>}
            </ProfileContainer>

        </Container>
    )
}

export default Nav