import React, { useState } from 'react'
import Modal from '../Modal popup/Modal'
import styled from 'styled-components'
const OpenModalButton = styled.button`
`

const Home = () => {

  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
  }


  return (
    <>
    <div>Home</div>
    <OpenModalButton onClick={()=>setShowModal(true)}>Open Modal</OpenModalButton>
   { showModal && <Modal onClose={closeModal}>HI</Modal>}
    </>
  )
}

export default Home