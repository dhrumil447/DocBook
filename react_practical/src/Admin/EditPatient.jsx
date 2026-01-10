import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { selectpatients } from "../redux/patientSlice";
import { FaUser } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const EditPatient = () => {
  const [patient, setPatient] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const patients = useSelector(selectpatients);
  const patientEdit = patients.find((item) => item.id == id);
  const redirect = useNavigate();

  useEffect(() => {
    if (id) {
      setPatient({ ...patientEdit });
    } else {
      setPatient({
        username: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, gender, age } = patient;
    const pattern = /^[\w\.]+\@[\w]+\.[a-zA-Z]{3}$/;

    if (!username || !email || !phone || !gender || !age) {
      toast.error("Please fill all the fields");
    } else if (!pattern.test(email)) {
      toast.error("Invalid email");
    } else if (id) {
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/patients/${id}`, {
          ...patient,
          createdAt: patientEdit.createdAt,
          editedAt: new Date(),
        });
        toast.success("Patient details updated");
        redirect("/admin/patient");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
    <Container className="mt-3">
      <div style={{
        background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
        padding: '25px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(111, 66, 193, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <MdEdit style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <h3 style={{ margin: 0, color: 'white', fontWeight: '700' }}>Edit Patient Details</h3>
          </div>
          <button
            type="button"
            onClick={() => redirect('/admin/patient')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            View Patients
          </button>
        </div>
      </div>
      <Card style={{ border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderRadius: '15px', padding: '30px' }}>
    <Row>
        <Col md={12}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                name="fullName"
                placeholder=""
                value={patient.username}
                onChange={(e) =>
                  setPatient({ ...patient, username: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Name</Form.Label>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="email"
                name="email"
                placeholder=""
                value={patient.email}
                onChange={(e) =>
                  setPatient({ ...patient, email: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Email</Form.Label>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="phone"
                name="phone"
                placeholder=""
                value={patient.phone}
                onChange={(e) =>
                  setPatient({ ...patient, phone: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Phone Number</Form.Label>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group className="form-floating mb-3">
              <Form.Control
                type="text"
                name="age"
                placeholder=""
                value={patient.age}
                onChange={(e) =>
                  setPatient({ ...patient, age: e.target.value })
                }
              ></Form.Control>
              <Form.Label className="form-label">Enter Age</Form.Label>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className=" mb-3">
              <Form.Select
                name="gender"
                style={{ height: "57px" }}
                value={patient.gender}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button
          type="submit"
          style={{
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6f42c1, #9d7bd8)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            transition: 'all 0.3s ease'
          }}
        >
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : 'Update Patient'}
        </Button>
      </Form>
      </Col>
      </Row>
      </Card>
      </Container>
      </>
  );
};

export default EditPatient;
