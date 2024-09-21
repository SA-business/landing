import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
width: 100%;
height: 80px;
position: fixed;
top: 0;
left: 0;
background-color: #a1dee0;
display: flex;
justify-content: space-between;
align-items: center;
z-index: 100;
padding: 10px 20px;
`

const LogoContainer = styled.div`

background-color: #922626;
display: flex;
align-items: center;
gap: 30px;
padding: 20px;

p {
    font-size: 20px;
    color: white;
}

img {
    width: 80px;
    height: 50px;
    border: 1px solid black;
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
color: white;
text-decoration: none;
margin: 0 20px;
cursor: pointer;

&:hover {
    background-color: black;
}
`


const Nav = () => {
    return (
        <Container>
            <LogoContainer>
                <img />
                <p>Logo</p>
            </LogoContainer>

            <NavItems>
                <NavItem href="#">Home</NavItem>
                <NavItem href="#">About</NavItem>
                <NavItem href="#">Services</NavItem>
                <NavItem href="#">Contact</NavItem>
                <NavItem href="#">Profile</NavItem>
            </NavItems>
            
        </Container>
    )
}

export default Nav