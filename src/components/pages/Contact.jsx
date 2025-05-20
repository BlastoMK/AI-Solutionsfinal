import React, { useState } from "react";
import { Heading } from "../common/Heading";
import { contact } from "../data/dummydata";
import axios from "axios";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    jobTitle: "",
    requirements: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/enquiries', formData);
      if (response.status === 201) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          country: "",
          jobTitle: "",
          requirements: ""
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='contact'>
        <div className='container'>
          <Heading title='Contact Us' />
          <p className="contact-subtitle" data-aos="fade-up">
            Fill out the form below to inquire about our AI solutions for your business needs.
          </p>
          
          <div className='content flexsb'>
            <div className='right'>
              {success && (
                <div className="success-message">
                  Thank you! Your enquiry has been submitted successfully.
                </div>
              )}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className='flex'>
                  <div className="form-group" data-aos='flip-left'>
                    <label>Full Name*</label>
                    <input 
                      type='text' 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group" data-aos='flip-right'>
                    <label>Email Address*</label>
                    <input 
                      type='email' 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className='flex'>
                  <div className="form-group" data-aos='flip-left'>
                    <label>Phone Number</label>
                    <input 
                      type='tel' 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group" data-aos='flip-right'>
                    <label>Company Name</label>
                    <input 
                      type='text' 
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className='flex'>
                  <div className="form-group" data-aos='flip-left'>
                    <label>Country</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group" data-aos='flip-right'>
                    <label>Job Title</label>
                    <input 
                      type='text' 
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="CTO, IT Manager, etc."
                    />
                  </div>
                </div>

                <div className="form-group" data-aos='flip-up'>
                  <label>Project Requirements*</label>
                  <textarea 
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows='6'
                    required
                  ></textarea>
                  <p className="hint-text">
                    Provide as much detail as possible to help us understand your needs better.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  data-aos='zoom-in-up'
                >
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
            
            <div className='left'>
              {contact.map((item, index) => (
                <div className='box' data-aos='zoom-in' key={index}>
                  <i>{item.icon}</i>
                  <p>{item.text1}</p>
                  <p>{item.text2}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}