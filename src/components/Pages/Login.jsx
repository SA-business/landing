import styled, {keyframes} from 'styled-components'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0); 
  }
`;

const slideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0); 
  }
  100% {
    opacity: 0;
    transform: translateY(20px); 
  }
`;


const Container = styled.div`
width: 468px;
height: 886px;
outline: 3px solid black;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 20px;
border-radius: 50px;
gap: 20px;

`
const Header = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 10px;

img {
  height: 80px;
}

h1{
  margin: 0px;
}

p {
  font-size: 13px;
  margin: 0px;
}
`

const InputForm = styled.form`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 20px;
width: 80%;

button {
  width: 100%;
  height: 60px;
  border-radius: 20px;
  background-color: #070707;
  font-size: 20px;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
`

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  


  img {
    position: absolute;
    left: 20px;
    top: 20px;
    height: 20px;
  }

  input {
    height: 40px;
    border-radius: 20px;
    padding: 10px 10px 10px 50px;
    font-size: 20px;
   
    
}

input::placeholder {
  font-size: 20px;
  position: absolute;
  left: 50px;
  top: 15px;
}

`
const ToLogin = styled.p``

const CustomLine = styled.div`
width: 50%;
height: 1px;
background-color: black;
`


const TermsDiv = styled.div`
display: flex;
align-items: center;
gap: 10px;
`

const ButtonDiv = styled.div`
display: flex;
flex-direction: column;
position: relative;
width: 80%;
align-items: center;
gap: 10px;
cursor: pointer;
justify-content: center;


button{
width: 100%;
height: 60px;
border-radius: 10px;
background-color: white;
cursor: pointer;
padding: 10px 20px;
font-size: 15px;
}

img {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 80px;
  top: 20px;
}
`





const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [login, setLogin] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting traditionally
    if (!login) {
      console.log("login")
      navigate('/home')
    }
    else {
      if (password !== confirmPassword) {
        setPasswordMatch(false); // Show error if passwords do not match
        return; // Stop the submission process
      }
      console.log("register"); // Placeholder for submission logic
      navigate('/profile')
    }
  };




  const loginDisable = () => {
    if (!login) {
      return !(email && password);
    } else {
      return !(email && password && confirmPassword && termsAccepted);
    }
  };





  return (
    <Container>
      <Header>
        <img src="../../public/loginIcon.png" alt="loginIcon" />
        <h1>{login ? "用戶註冊" : "用戶登入"}</h1>
        <p>填寫您的個人資訊</p>
      </Header>
      <InputForm onSubmit={handleSubmit}>
        <InputDiv>
          <input type="email" placeholder="電郵" onChange={(e) => setEmail(e.target.value)}></input>
          <img src="../../public/email.png" alt="email" />
        </InputDiv>
        <InputDiv>
          <input type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
          <img src="../../public/password.png" alt="password" />
        </InputDiv>
        {login ? <InputDiv>
          <input  type="password" placeholder="重新輸入密碼" onChange={(e) => setConfirmPassword(e.target.value)} />
          <img src="../../public/password.png" alt="password" />
          {!passwordMatch ? <p>password mismatch</p> : null}
        </InputDiv> : <p>Forgot password</p>}
        {login ? <TermsDiv >
          <input  type="checkbox" id="termsAndService" onChange={(e) => setTermsAccepted(e.target.checked)} />
          <label htmlFor="termsAndService" style={{ fontSize: 13 }}>我已閱讀並同意條款</label>
        </TermsDiv> : null}
        <button type="submit" disabled={loginDisable()}>{login ? "註冊" : "登入"}</button>
      </InputForm>
      <ToLogin >已經有帳號了？<a href="#" style={{ fontWeight: 800, color: 'black' }} onClick={() => setLogin((prev) => !prev)}>{login ? "登入" : "註冊"}</a></ToLogin>
      <CustomLine></CustomLine>

      <ButtonDiv>
        <button>使用 Google 登入</button>
        <img src="../../public/google.png" alt="" />
      </ButtonDiv>
      <ButtonDiv>
        <button>使用 Facebook 登入</button>
        <img src="../../public/facebook.png" alt="" />
      </ButtonDiv>


    </Container>
  )
}

export default Login
