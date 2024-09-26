import { useState , useEffect, useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../contexts/AuthContext'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  `

  const ProfileHeader = styled.div`
  border: 1px solid black;
  padding: 30px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  `
    
  
  const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  `
  const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  `

  const Section = styled.div`
  padding: 10px 0px;
  border: 1px solid black;
  width: 100%;
  `


const Profile = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  




  return (
    <Container>
      <Section>
      <h1>Profile</h1>
      <p>{isAuthenticated ? user.name : "Please login first"}</p>
      <Avatar src='../../loginIcon.png' />
      <button>Edit Profile</button>
      </Section>
      <Form>
        <p>User email: {isAuthenticated ? user.email: "Please login first"}</p>
        <p>User ID: {user?.uid}</p>
      </Form>
      <Section>Application</Section>
      <Section>Personal Statement</Section>
      <Section>Education</Section>
      <Section>Experience</Section>
      <Section>Skills</Section>
      
    </Container>
  )
}

export default Profile