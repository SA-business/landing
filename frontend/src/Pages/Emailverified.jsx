import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const EmailVerifiedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f9fc;
`;

const Message = styled.h1`
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 20px;
`;

const SubMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const Emailverified = () => {

  const navigate = useNavigate();



  useEffect(() => {

    const timer = setTimeout(() => {
      navigate('/login'); 

    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]); 

  return (
    <EmailVerifiedContainer>
      <Message>Email Verified!</Message>
      <SubMessage>Redirecting to login page in 2 seconds...</SubMessage>
    </EmailVerifiedContainer>
  );
};

export default Emailverified;
