import { useState , useEffect, useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../contexts/AuthContext'
import Modal from '../components/Modal popup/Modal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  `

const Section = styled.div`
padding: 10px 0px;
border: 1px solid black;
width: 100%;
`

const Header = styled.h2`
  margin-bottom: 10px;
`;

  

const Button = styled.button`
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  resize: vertical;
`;

const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
`;

const AvatarPreview = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
`;

const FileInput = styled.input`
    display: none;
`;

const UploadButton = styled.label`
    padding: 8px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const SubmitButton = styled.button`
    padding: 8px 12px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    &:disabled {
        background-color: #90caf9;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: red;
`;

const SuccessMessage = styled.p`
    color: green;
`;

const ModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;

  input {
    width: 25%;
  }

  fieldset {
    display: flex;
    gap: 20px
  }
  `


const Profile = () => {
  const { isAuthenticated, user, profile, refreshUser } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('/defaultAvatar.png');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            setError('Only image files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size exceeds 5MB.');
            return;
        }

        setSelectedFile(file);
        setError('');

        // Generate a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleUpload = async () => {
  if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
  }

  setUploading(true);
  setError('');
  setSuccess('');

  try {
      const token = localStorage.getItem('token'); // Ensure token is stored securely

      // Step 1: Get pre-signed URL from the backend
      const response = await axios.post(
          'http://localhost:3000/api/profile/avatar-url',
          {
              fileName: selectedFile.name,
              fileType: selectedFile.type,
          },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      const { signedUrl } = response.data;

      // Step 2: Upload the file directly to S3 using the pre-signed URL
      await axios.put(signedUrl, selectedFile, {
          headers: {
              'Content-Type': selectedFile.type,
          },
      });

      // Step 3: Notify the backend to update the user's avatar URL in the database
      await axios.put(
          'http://localhost:3000/api/profile/avatar',
          { avatarUrl: signedUrl },
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      setSuccess('Avatar uploaded successfully!');
      setSelectedFile(null);
      refreshUser(); // Refresh user data to get the new avatar
  } catch (err) {
      console.error('Upload error:', err);
      if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
      } else {
          setError('An unexpected error occurred.');
      }
  } finally {
      setUploading(false);
  }
};



  const closeModal = () => {
    setShowModal(false);
    setModalContent('');
    setFormData({});
    setMessage('');
    setError('');
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
    setMessage('');
    setError('');

    // If editing personalInfo, initialize formData with existing user data
    if (content === 'personalInfo') {
      setFormData({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        chineseName: profile?.chineseName || '',
        chineseLastName: profile?.chineseLastName || '',
        sex: profile?.sex || '', // Assuming 'sex' is stored as 'male' or 'female'
      });
    } else {
      setFormData(profile?.[content.toLowerCase()] || '');
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (modalContent === 'personalInfo') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'radio' ? e.target.id.replace('Sex', '').toLowerCase() : value,
      }));
    } else {
      setFormData(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    let endpoint = '';
    let payload = {};

    switch (modalContent) {
      case 'personalInfo':
        endpoint = '/api/profile/personal-info';
        payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          chineseName: formData.chineseName,
          chineseLastName: formData.chineseLastName,
          sex: formData.sex,
        };
        break;
      case 'personalStatement':
        endpoint = '/api/profile/personal-statement';
        payload = { personalStatement: formData };
        break;
      case 'Education':
        endpoint = '/api/profile/education';
        payload = { education: formData };
        break;
      case 'Experience':
        endpoint = '/api/profile/experience';
        payload = { experience: formData };
        break;
      case 'Skill':
        endpoint = '/api/profile/skills';
        payload = { skills: formData };
        break;
      default:
        return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.put(
        `http://localhost:3000${endpoint}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      refreshUser(); // Refresh user data if you have such a method

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <Container>
      <Section>
        <Header>Profile</Header>
        <UploadContainer>
          <AvatarPreview src={preview} />
          <FileInput
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleFileChange}
          />
          <UploadButton htmlFor="avatar-upload">Choose Avatar</UploadButton>
          {selectedFile && (
            <SubmitButton onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </SubmitButton>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </UploadContainer>

        <p>{isAuthenticated ? user?.email : 'Please login first'}</p>
        <p>{profile?.personalStatement || 'No personal statement provided.'}</p>
        <Button onClick={() => openModal('personalInfo')}>
          Edit Personal Info
        </Button>
      </Section>

      <Section>
        <Header>Personal Statement</Header>
        <p>{profile?.personalStatement || 'No personal statement provided.'}</p>
        <Button onClick={() => openModal('personalStatement')}>Edit Personal Statement</Button>
      </Section>

      <Section>
        <Header>Education</Header>
        <p>{profile?.education || 'No education information provided.'}</p>
        <Button onClick={() => openModal('Education')}>Edit Education</Button>
      </Section>

      <Section>
        <Header>Experience</Header>
        <p>{profile?.experience || 'No experience information provided.'}</p>
        <Button onClick={() => openModal('Experience')}>Edit Experience</Button>
      </Section>

      <Section>
        <Header>Skills</Header>
        <p>{profile?.skills || 'No skills information provided.'}</p>
        <Button onClick={() => openModal('Skill')}>Edit Skills</Button>
      </Section>

      {/* Modal for Editing Profile Sections */}
      {showModal && (
        <Modal onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <Header>
              {modalContent === 'personalInfo' && 'Edit Personal Info'}
              {modalContent === 'personalStatement' && 'Edit Personal Statement'}
              {modalContent === 'Education' && 'Edit Education'}
              {modalContent === 'Experience' && 'Edit Experience'}
              {modalContent === 'Skill' && 'Edit Skills'}
            </Header>

            {modalContent === 'personalInfo' && (
              <ModalContent>
                <label htmlFor="firstName">First Name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="lastName">Last Name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="chineseName">Chinese Name</label>
                <Input
                  id="chineseName"
                  name="chineseName"
                  value={formData.chineseName}
                  onChange={handleChange}
                />

                <label htmlFor="chineseLastName">Chinese Last Name</label>
                <Input
                  id="chineseLastName"
                  name="chineseLastName"
                  value={formData.chineseLastName}
                  onChange={handleChange}
                />

                <fieldset>
                  <legend>Gender</legend>
                  <label htmlFor="maleSex">Male</label>
                  <input
                    type="radio"
                    name="sex"
                    id="maleSex"
                    checked={formData.sex === 'male'}
                    onChange={handleChange}
                  />

                  <label htmlFor="femaleSex">Female</label>
                  <input
                    type="radio"
                    name="sex"
                    id="femaleSex"
                    checked={formData.sex === 'female'}
                    onChange={handleChange}
                  />
                </fieldset>
              </ModalContent>
            )}

            {modalContent === 'personalStatement' && (
              <TextArea
                value={formData}
                onChange={handleChange}
                placeholder="Enter your personal statement..."
                required
              />
            )}

            {(modalContent === 'Education' || modalContent === 'Experience') && (
              <Input
                type="text"
                value={formData}
                onChange={handleChange}
                placeholder={`Enter your ${modalContent.toLowerCase()}...`}
                required
              />
            )}

            {modalContent === 'Skill' && (
              <Input
                type="text"
                value={formData}
                onChange={handleChange}
                placeholder="Enter your skills..."
                required
              />
            )}

            <Button type="submit">Submit</Button>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </Modal>
      )}
    </Container>


  )
}

export default Profile



// {showModal && <Modal onClose={closeModal}>

// {ModalContent === "personalStatement" && <form>
  
// <form>
// <textarea></textarea>
// <button>Submit</button>
// </form>
// </Modal>}