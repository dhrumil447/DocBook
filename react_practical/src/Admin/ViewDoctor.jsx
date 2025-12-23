import React, { useEffect, useState } from 'react';
import { FaPenAlt, FaTrash, FaUserCheck, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { selectdoctors, store_doctors } from '../redux/doctorSlice';
import { Modal, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { api } from '../utils/api';

const ViewDoctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const dispatch = useDispatch();
  const redirect = useNavigate();
  const doctors = useSelector(selectdoctors);

  const getData = async () => {
    console.log('📥 Fetching doctors...');
    const { data, error } = await api.fetchDoctors();
    if (error) {
      console.error('❌ Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } else {
      console.log('✅ Doctors loaded:', data.length);
      dispatch(store_doctors(data));
    }
  };

  useEffect(() => {
    getData();
  }, [isDeleted]);

  const handleDelete = async(id) => {
    if(window.confirm("Are you sure you want to delete this doctor?")) {
      console.log('🗑️ Deleting doctor:', id);
      const { data, error } = await api.deleteDoctor(id);
      if (error) {
        console.error('❌ Delete failed:', error);
        toast.error(error);
      } else {
        console.log('✅ Doctor deleted');
        toast.success('Doctor deleted successfully');
        setIsDeleted(!isDeleted);
      }
    }
  };

  const handleApprove = async (id) => {
    console.log('✅ Approving doctor:', id);
    const { data, error } = await api.patchDoctor(id, { status: 'Accept' });
    if (error) {
      console.error('❌ Approval failed:', error);
      toast.error(error);
    } else {
      console.log('✅ Doctor approved');
      toast.success('Doctor approved!');
      getData();
    }
  };

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const handleAcceptStatus = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    console.log('✅ Accepting doctor status:', selectedDoctor.id);
    const { data, error } = await api.patchDoctor(selectedDoctor.id, { status: 'Accept' });
    if (error) {
      console.error('❌ Status update failed:', error);
      toast.error(error);
    } else {
      console.log('✅ Doctor status updated');
      toast.success('Doctor accepted successfully!');
      getData();
      setShowModal(false);
    }
    setLoading(false);
  };

  return (
    <div className='mt-3'>
      <h3 className='text-info'>View Doctor</h3>
      <hr />
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Fees</th>
              <th>Clinic</th>
              <th>Status</th>
              <th>View Doctor Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={8} className='text-center'>No Doctor Found</td>
              </tr>
            ) : doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doctor.username}</td>
                <td>{doctor.specialization || 'N/A'}</td>
                <td>₹{doctor.consultation_fee || 0}</td>
                <td>{doctor.clinic_name || 'N/A'}</td>
                <td>
                  <span className={`badge ${doctor.status === "Accept" ? 'bg-success' : doctor.status === "Reject" ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {doctor.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <button
                    className='btn btn-info me-2'
                    onClick={() => handleViewProfile(doctor)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className='btn btn-success me-2'
                    onClick={() => handleApprove(doctor.id)}
                    disabled={doctor.status === "Accept"}
                  >
                    <FaUserCheck />
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-success me-2'
                    onClick={() => redirect(`/admin/doctor/edit/${doctor.id}`)}
                  >
                    <FaPenAlt />
                  </button>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(doctor.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Doctor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <Card className="shadow p-3 rounded">
              <Row>
                <Col md={12}>
                  {/* Profile Image */}
                  <div className="text-center mb-3">
                    {selectedDoctor.profile_image ? (
                      <img
                        src={selectedDoctor.profile_image}
                        alt="Profile"
                        className="rounded-circle mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="rounded-circle mb-3 bg-secondary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                        <span className="text-white fs-1">{selectedDoctor.username?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <h5 className="fw-bold">Dr. {selectedDoctor.username}</h5>
                    <p className="text-muted">{selectedDoctor.specialization || 'Not Specified'}</p>
                    <p><strong>Status:</strong> <span className={`badge ${selectedDoctor.status === 'Accept' ? 'bg-success' : selectedDoctor.status === 'Reject' ? 'bg-danger' : 'bg-warning text-dark'}`}>{selectedDoctor.status || 'Pending'}</span></p>
                  </div>

                  {/* Doctor Details */}
                  <Row className="mb-2">
                    <Col md={6}><strong>Email:</strong> {selectedDoctor.email}</Col>
                    <Col md={6}><strong>Phone:</strong> {selectedDoctor.phone || 'N/A'}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6}><strong>Gender:</strong> {selectedDoctor.gender || 'N/A'}</Col>
                    <Col md={6}><strong>Age:</strong> {selectedDoctor.age || 'N/A'}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6}><strong>Qualification:</strong> {selectedDoctor.qualification || 'N/A'}</Col>
                    <Col md={6}><strong>Experience:</strong> {selectedDoctor.experience || 0} years</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6}><strong>Clinic Name:</strong> {selectedDoctor.clinic_name || 'N/A'}</Col>
                    <Col md={6}><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultation_fee || 0}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={6}><strong>Available Days:</strong> {selectedDoctor.available_days || 'Not Provided'}</Col>
                    <Col md={6}><strong>Available Time:</strong> {selectedDoctor.available_time || 'Not Provided'}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={12}><strong>Clinic Address:</strong> {selectedDoctor.clinic_address || 'N/A'}</Col>
                    <Col md={12}><strong>City:</strong> {selectedDoctor.city || 'N/A'}</Col>
                  </Row>
                  
                  <hr />

                  {/* Document Proofs */}
                  {selectedDoctor.identity_proof && (
                    <div className="mb-3">
                      <p className="fw-bold">Identity Proof:</p>
                      <img
                        src={selectedDoctor.identity_proof}
                        alt="Identity Proof"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        className="rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <Alert variant="info" style={{ display: 'none' }}>Image not available</Alert>
                    </div>
                  )}

                  {selectedDoctor.degree_proof && (
                    <div className="mb-3">
                      <p className="fw-bold">Degree Certificate:</p>
                      <img
                        src={selectedDoctor.degree_proof}
                        alt="Degree Proof"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        className="rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <Alert variant="info" style={{ display: 'none' }}>Image not available</Alert>
                    </div>
                  )}
                 
                  {selectedDoctor.clinic_reg_proof && (
                    <div className="mb-3">
                      <p className="fw-bold">Clinic Registration Proof:</p>
                      <img
                        src={selectedDoctor.clinic_reg_proof}
                        alt="Clinic Registration Proof"
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        className="rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <Alert variant="info" style={{ display: 'none' }}>Image not available</Alert>
                    </div>
                  )}

                  {!selectedDoctor.identity_proof && !selectedDoctor.degree_proof && !selectedDoctor.clinic_reg_proof && (
                    <Alert variant="warning">
                      <strong>No documents uploaded yet</strong>
                    </Alert>
                  )}
                </Col>
              </Row>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedDoctor && selectedDoctor.status !== 'Accept' && (
            <Button variant="success" onClick={handleAcceptStatus} disabled={loading}>
              {loading ? 'Updating...' : 'Accept Doctor'}
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewDoctor;
