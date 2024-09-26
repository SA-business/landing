import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function ResetPassword() {
  const { userId, token } = useParams();
  const [password, setPassword] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset successful!');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('An error occurred while resetting your password.');
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
