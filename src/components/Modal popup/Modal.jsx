import React from 'react'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100 ;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContainer = styled.div`
    position: relative;
    width: 40vh;
    height: 40vh;
    background: white;
    border-radius: 10px;
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 20px;
    color: red;
`

const Modal = ({ onClose, children }) => {
    return (
        <Overlay onClick={onClose}>
            <ModalContainer onClick={(e)=> e.stopPropagation()}>
                <CloseButton onClick={onClose}>X</CloseButton>
                <div>{children}</div>
            </ModalContainer>
        </Overlay>

    )
}

export default Modal