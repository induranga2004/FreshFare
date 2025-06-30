import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import Input from '../UI/Input';
import './EnterEmail.css';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';

function EnterEmail() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await axios.post("http://localhost:5000/api/auth/acceptEmail", {
      email: email
    }).then((res) => {
      toast.success(res.data.message);
      navigate(`/otp/${email}`)
    }).catch((error) => {
      setError('Invalid or unregistered email.');
    }).finally(() => setLoading(false));
  }

  return (
    <div className="enter-email-container">
      <form className="enter-email-card" onSubmit={handleSubmit} autoComplete="off">
        <div className="enter-email-icon">
          <FaEnvelope />
        </div>
        <h1>Reset Password</h1>
        <Input
          label="Enter Your Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          placeholder="Enter your registered email"
        />
        {error && <div className="enter-email-error">{error}</div>}
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      </form>
    </div>
  )
}

export default EnterEmail
