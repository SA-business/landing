import { useState , useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  `
  const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  `
  const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  `


const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/getProfile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        setName(data.name || '');
        setEmail(data.email || '');
        setUid(data.id || '');
  
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);
  


  return (
    <Container>
      <h1>Profile</h1>
      <Avatar src='../../loginIcon.png' />
      <button>Upload Avatar</button>
      <Form>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="string"
          placeholder="UID"
          value={uid}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* <button>Update</button> */}
      </Form>
      
    </Container>
  )
}

export default Profile