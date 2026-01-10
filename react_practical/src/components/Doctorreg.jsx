import { Button } from "react-bootstrap";
import React, { useState } from "react"; 
import { Card, Col, Container, Form, InputGroup, Row, Tabs, Tab, Badge } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaUser, FaBriefcaseMedical, FaHospital, FaLock, FaUpload, FaUserMd, FaStethoscope, FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router";
import axios from "axios";

const Doctorreg = () => {
  const redirect =  useNavigate()
  const [isLoading,setIsLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [doctor, setUser] = useState({
    username: '',
    email: '',
    password: '',
    cpassword: '',
    phone: '',
    gender: '',
    age: '',
    clinicName: '',
    clinicAddress: '',
    city:'',
    specialization: '',
    qualification: '',
    experience: '',
    fees: '',
    profileimg:'',
    identityproof:'',
    degreeProof:'',
    clinicRegProof:'',
    status:'Pending',
    isDoctors:true
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    let { username, email, password, cpassword, phone, gender, age, clinicName, clinicAddress, specialization, qualification, profileimg, identityproof, degreeProof, clinicRegProof, experience, fees} = doctor;
    let pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/;

    if (!username || !email || !password || !phone || !gender || !age ||  !clinicName || !clinicAddress || !specialization || !qualification || !profileimg || !identityproof  || !degreeProof || !clinicRegProof || !experience || !fees) {
      toast.error("Please fill all the fields");
    } else if (!pattern.test(email)) {
      toast.error("Invalid email");
    } else if (password !== cpassword) {
      toast.error("Passwords do not match");
    } else{
      try{
        await axios.post(`${import.meta.env.VITE_BASE_URL}/doctors`, {...doctor, createdAt:new Date()})
        toast.success("registered successfully")
        redirect('/login')
      }
      catch(err){toast.error(err)}
    }
  }
  
  const handleImage =  async(e ,fieldName)=>{
    let img = e.target.files[0]
    let ext = ["image/jpg","image/jpeg","image/png","image/gif","image/webp","image/jfif","image/avif",]

    if(img==undefined){toast.error("please choose image")}
    else if(img.size > 1048576) toast.error("File size exceeded (Max 1MB)")
    else if(!ext.includes(img.type))toast.error("invalid extension")
    else {
      setIsLoading(true)  
      const data =  new FormData()
      data.append("file",img)
      data.append("cloud_name","dhrumil7")
      data.append("upload_preset","DocBook")
      data.append("folder","Doctors") 
      try{
          const res = await axios.post("https://api.cloudinary.com/v1_1/dhrumil7/image/upload" , data)
          const imageUrl = res.data.url;
          setUser(prev => ({ ...prev, [fieldName]: imageUrl }));
          setIsLoading(false);
          toast.success(`${fieldName} uploaded successfully`);
      }
      catch(err){toast.error(err.message);setIsLoading(false)}
    }
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "40px 0" }}>
      <Container style={{ maxWidth: "1400px" }}>
        <Row>
          {/* Sidebar with Icons */}
          <Col md={3} className="d-none d-md-block">
            <div style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
              borderRadius: "20px",
              padding: "40px 20px",
              color: "white",
              height: "100%",
              minHeight: "700px",
              position: "sticky",
              top: "20px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)"
            }}>
              {/* Main Icon */}
              <div style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 30px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                animation: "pulse 2s ease-in-out infinite"
              }}>
                <FaUserMd style={{ fontSize: "60px", color: "white" }} />
              </div>

              <h4 className="text-center fw-bold mb-3">Join as Doctor</h4>
              <p className="text-center" style={{ fontSize: "14px", opacity: 0.9, marginBottom: "40px" }}>
                Register to provide healthcare services and manage patients
              </p>

              {/* Feature Icons */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaStethoscope style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>Manage Patients</div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>Track appointments</div>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaHeartbeat style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>Set Schedule</div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>Flexible timings</div>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px"
                  }}>
                    <FaNotesMedical style={{ fontSize: "20px" }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>Digital Records</div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>Secure & accessible</div>
                  </div>
                </div>
              </div>

              <style>
                {`
                  @keyframes pulse {
                    0%, 100% {
                      transform: scale(1);
                      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }
                    50% {
                      transform: scale(1.05);
                      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
                    }
                  }
                `}
              </style>
            </div>
          </Col>

          {/* Form Section */}
          <Col md={9}>
            <Card style={{
              borderRadius: "20px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              border: "none",
              backgroundColor: "white",
              padding: "40px"
            }}>
              <div className="mb-4">
                <h2 style={{ fontWeight: "bold", color: "#2c3e50", marginBottom: "10px" }}>Doctor Registration</h2>
                <p style={{ color: "#6c757d", fontSize: "15px" }}>
                  Are you a Patient? <Link to="/Register" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "500" }}>Register Here</Link>
                </p>
              </div>
              <hr style={{ margin: "30px 0", borderTop: "2px solid #e9ecef" }} />
            
            <Form onSubmit={handleSubmit}>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
                style={{ borderBottom: "2px solid #e9ecef" }}
              >
                {/* Personal Information Tab */}
                <Tab 
                  eventKey="personal" 
                  title={
                    <span style={{ fontSize: "15px" }}>
                      <FaUser className="me-2" />
                      Personal Info
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={4}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="text" placeholder="" value={doctor.username}
                            onChange={(e) => setUser({ ...doctor, username: e.target.value })} />
                          <Form.Label>Full Name</Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="email" placeholder="" value={doctor.email}
                            onChange={(e) => setUser({ ...doctor, email: e.target.value })} />
                          <Form.Label>Email Address</Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="text" placeholder="" value={doctor.phone}
                            onChange={(e) => setUser({ ...doctor, phone: e.target.value })} />
                          <Form.Label>Phone Number</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="number" placeholder="" value={doctor.age}
                            onChange={(e) => setUser({ ...doctor, age: e.target.value })} />
                          <Form.Label>Age</Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Select style={{ height: '57px' }} value={doctor.gender}
                            onChange={(e) => setUser({ ...doctor, gender: e.target.value })}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="text-end mt-3">
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('professional')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </Tab>

                {/* Professional Details Tab */}
                <Tab 
                  eventKey="professional" 
                  title={
                    <span style={{ fontSize: "15px" }}>
                      <FaBriefcaseMedical className="me-2" />
                      Professional
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600" }}>Specialization</Form.Label>
                          <Form.Select style={{ height: '50px' }} value={doctor.specialization}
                            onChange={(e) => setUser({ ...doctor, specialization: e.target.value })}>
                            <option value="" disabled>Select Specialization</option>
                            <option>General Physician</option>
                            <option>Cardiologist</option>
                            <option>Dermatologist</option>
                            <option>Neurologist</option>
                            <option>Orthopedic Surgeon</option>
                            <option>Pediatrician</option>
                            <option>Psychiatrist</option>
                            <option>ENT Specialist</option>
                            <option>Gynecologist</option>
                            <option>Dentist</option>
                            <option>Urologist</option>
                            <option>Radiologist</option>
                            <option>Oncologist</option>
                            <option>Ophthalmologist</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ fontWeight: "600" }}>Qualification</Form.Label>
                          <Form.Select style={{ height: '50px' }} value={doctor.qualification}
                            onChange={(e) => setUser({ ...doctor, qualification: e.target.value })}>
                            <option value="" disabled>Select Qualification</option>
                            <option>MBBS</option>
                            <option>MD (Doctor of Medicine)</option>
                            <option>MS (Master of Surgery)</option>
                            <option>BDS (Bachelor of Dental Surgery)</option>
                            <option>MDS (Master of Dental Surgery)</option>
                            <option>DNB (Diplomate of National Board)</option>
                            <option>DM (Doctorate of Medicine)</option>
                            <option>M.Ch (Master of Chirurgiae)</option>
                            <option>BHMS (Homeopathy)</option>
                            <option>BAMS (Ayurveda)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="number" placeholder="" value={doctor.experience} 
                            onChange={(e) => setUser({ ...doctor, experience: e.target.value })} />
                          <Form.Label>Experience (Years)</Form.Label>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="number" placeholder="" value={doctor.fees} 
                            onChange={(e) => setUser({ ...doctor, fees: e.target.value })} />
                          <Form.Label>Consultation Fees (₹)</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveTab('personal')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        ← Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('clinic')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </Tab>

                {/* Clinic Information Tab */}
                <Tab 
                  eventKey="clinic" 
                  title={
                    <span style={{ fontSize: "15px" }}>
                      <FaHospital className="me-2" />
                      Clinic Info
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={12}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control type="text" placeholder="" value={doctor.clinicName}
                            onChange={(e) => setUser({ ...doctor, clinicName: e.target.value })} />
                          <Form.Label>Clinic Name</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control as="textarea" rows={3} placeholder="" value={doctor.clinicAddress}
                            onChange={(e) => setUser({ ...doctor, clinicAddress: e.target.value })} />
                          <Form.Label>Clinic Address</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveTab('professional')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        ← Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('security')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </Tab>

                {/* Security Tab */}
                <Tab 
                  eventKey="security" 
                  title={
                    <span style={{ fontSize: "15px" }}>
                      <FaLock className="me-2" />
                      Security
                    </span>
                  }
                >
                  <div className="p-4">
                    <Row>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label style={{ fontWeight: "600" }}>Create Password</Form.Label>
                          <InputGroup style={{ borderRadius: "8px", overflow: "hidden" }}>
                            <Form.Control type={show ? "text" : "password"} placeholder="Enter password"
                              style={{ height: '50px', border: "1px solid #ced4da" }} value={doctor.password}
                              onChange={(e) => setUser({ ...doctor, password: e.target.value })} />
                            <Button variant='light' className='border' onClick={() => setShow(!show)}>
                              {show ? <BsEye /> : <BsEyeSlash />}
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label style={{ fontWeight: "600" }}>Confirm Password</Form.Label>
                          <InputGroup style={{ borderRadius: "8px", overflow: "hidden" }}>
                            <Form.Control type={show ? "text" : "password"} placeholder="Re-enter password"
                              style={{ height: '50px', border: "1px solid #ced4da" }} value={doctor.cpassword}
                              onChange={(e) => setUser({ ...doctor, cpassword: e.target.value })} />
                            <Button variant='light' className='border' onClick={() => setShow(!show)}>
                              {show ? <BsEye /> : <BsEyeSlash />}
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveTab('clinic')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        ← Back
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('documents')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </Tab>

                {/* Documents Upload Tab */}
                <Tab 
                  eventKey="documents" 
                  title={
                    <span style={{ fontSize: "15px" }}>
                      <FaUpload className="me-2" />
                      Documents
                    </span>
                  }
                >
                  <div className="p-4">
                    <p style={{ color: "#6c757d", marginBottom: "20px", fontSize: "14px" }}>
                      Please upload clear images of your original documents (Max 1MB each)
                    </p>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: "600" }}>Profile Photo</Form.Label>
                          <Form.Control type="file" accept='image/*' onChange={(e) => handleImage(e, "profileimg")} 
                            style={{ padding: "10px" }} />
                          {doctor.profileimg && <small className="text-success">✓ Uploaded</small>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: "600" }}>Identity Proof (Aadhar/DL/Voter ID)</Form.Label>
                          <Form.Control type="file" accept='image/*' onChange={(e) => handleImage(e, "identityproof")}
                            style={{ padding: "10px" }} />
                          {doctor.identityproof && <small className="text-success">✓ Uploaded</small>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: "600" }}>Degree Certificate</Form.Label>
                          <Form.Control type="file" accept='image/*' onChange={(e) => handleImage(e, "degreeProof")}
                            style={{ padding: "10px" }} />
                          {doctor.degreeProof && <small className="text-success">✓ Uploaded</small>}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label style={{ fontWeight: "600" }}>Clinic Registration Proof</Form.Label>
                          <Form.Control type="file" accept='image/*' onChange={(e) => handleImage(e, "clinicRegProof")}
                            style={{ padding: "10px" }} />
                          {doctor.clinicRegProof && <small className="text-success">✓ Uploaded</small>}
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="d-flex justify-content-between mt-3">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setActiveTab('security')}
                        style={{ borderRadius: "8px", padding: "10px 30px", fontWeight: "600" }}
                      >
                        ← Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        style={{ 
                          borderRadius: "8px", 
                          padding: "10px 40px", 
                          fontWeight: "600",
                          backgroundColor: isLoading ? '#6c757d' : '#0d6efd',
                          border: 'none'
                        }}
                      >
                        {isLoading ? 'Uploading...' : 'Submit Registration →'}
                      </Button>
                    </div>
                  </div>
                </Tab>
              </Tabs>

              <p className="text-center mt-4" style={{ fontSize: "14px", color: "#6c757d" }}>
                Already have an account? <Link to="/Login" style={{ color: "#0d6efd", textDecoration: "none", fontWeight: "500" }}>Log In</Link>
              </p>
            </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Doctorreg;
