import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

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
z-index: 100;
padding: 10px 20px;
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
justify-content: space-around;
align-items: center;
gap: 20px;
list-style: none;
`

const NavItem = styled.li`
padding: 20px;
font-size: 20px;
color: #000000;
text-decoration: none;
margin: 0 20px;
cursor: pointer;
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
color: #000000;

&.active {
    background-color: #e0e0e0;
    border-radius: 20px;
}
`




const Nav = () => {

    const [highlight, setHightlight] = useState("")
    const handleHighlight = (section) => {
        setHighlight(section);
      };

    return (
        <Container>
            <LogoContainer>
                <img src='../../loginIcon.png'/>
                <p>Internship</p>
            </LogoContainer>

            <NavItems>
            <StyledNavLink to="/" activeclassname="active-link" onClick={()=> setHightlight("home")}
            ><NavItem>Home</NavItem></StyledNavLink>
            <StyledNavLink to="/about" activeclassname="active-link" onClick={()=> setHightlight("about")}
            ><NavItem>About</NavItem></StyledNavLink>
            <StyledNavLink to="/service" activeclassname="active-link" onClick={()=> setHightlight("service")}
            ><NavItem>Service</NavItem></StyledNavLink>
            <StyledNavLink to="/profile" activeclassname="active-link" onClick={()=> setHightlight("profile")}
            ><NavItem>Profile</NavItem></StyledNavLink>
            </NavItems>

            <StyledNavLink to="/login" activeclassname="active-link" onClick={()=> setHightlight("login")}><LoginButton>Login</LoginButton></StyledNavLink>
            
        </Container>
    )
}

export default Nav