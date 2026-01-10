import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaClock, FaMoneyBillWave, FaCreditCard, FaUserMd, FaCheckCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const SlotSelectionModal = ({ show, handleClose, slots, doctor }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [doctorFee, setDoctorFee] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor?.id) {
      fetchDoctorDetails(doctor.id);
    }
    fetchPatientDetails();
    setLoading(false);
  }, [doctor?.id]);

  // Fetch Doctor Details
  const fetchDoctorDetails = async (doctorId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/doctors/${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setDoctorFee(data.fees);
      } else {
        toast.error("Failed to fetch doctor details");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      toast.error("Error fetching doctor details");
    }
  };

  // Fetch Patient Details
  const fetchPatientDetails = async () => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData) {
      toast.error("User not logged in or session expired.");
      return;
    }
    const patientId = patientData.id;
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatientName(data.username);
        setPatientPhone(data.phone);
        setPatientEmail(data.email);
      } else {
        toast.error("Failed to fetch patient details");
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Error fetching patient details");
    }
  };

  // Select Appointment Slot
  const handleSlotSelect = (date, slot) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
  };

  // Book Appointment
  const handleBookAppointment = () => {
    if (selectedSlot) {
      setShowPaymentOptions(true);
    } else {
      toast.error("Please select a slot first.");
    }
  };

  // Store Appointment and Payment Details
  const storeAppointment = async (paymentMethod, razorpayId = "") => {
    const patientData = JSON.parse(sessionStorage.getItem("DocBook"));
    if (!patientData) {
      toast.error("User not logged in or session expired.");
      return;
    }
    const patientId = patientData.id;

    const appointmentData = {
      doctorId: doctor.id,
      patientId,
      date: selectedDate,
      slot: selectedSlot,
      status: "Pending",
      doctorFees: doctorFee,
      patientName,
      patientPhone,
      patientEmail,
    };

    try {
      const appointmentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (appointmentResponse.ok) {
        const appointment = await appointmentResponse.json(); // Get created appointment

        // Now store payment details
        const paymentData = {
          patientId,
          doctorId: doctor.id,
          appointmentId: appointment.id, // Store appointment ID
          amount: doctorFee,
          paymentMethod,
          razorpayId,
          paymentDate: new Date().toISOString(),
        };

        const paymentResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/Payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        });

        if (paymentResponse.ok) {
          toast.success("Appointment booked and payment recorded successfully!");
          handleClose();
        } else {
          toast.error("Appointment booked, but failed to record payment.");
        }
      } else {
        toast.error("Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error processing appointment and payment.");
    }
  };

  // Handle Online Payment via Razorpay
  const handleOnlinePayment = () => {
    const options = {
      key: "rzp_test_ovDgkuzi6Z5Udw",
      amount: doctorFee * 100,
      currency: "INR",
      name: "DocBook",
      description: "Appointment Payment",
      handler: function (response) {
        toast.success("Payment Successful!");
        storeAppointment("Pay Online", response.razorpay_payment_id);
      },
      prefill: {
        name: patientName,
        email: patientEmail,
        contact: patientPhone,
      },
      theme: { color: "#3399cc" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header 
        closeButton 
        style={{
          background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
          color: 'white',
          borderBottom: 'none',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
      >
        <Modal.Title style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
          <FaCalendarAlt style={{ fontSize: '24px' }} />
          Select an Appointment Slot
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
        {!showPaymentOptions ? (
          <>
            {doctor && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUserMd style={{ fontSize: '30px', color: 'white' }} />
                </div>
                <div>
                  <h5 style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>Dr. {doctor.username}</h5>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>{doctor.specialization}</p>
                  <p style={{ margin: 0, color: '#0d6efd', fontWeight: '600', fontSize: '16px', marginTop: '5px' }}>
                    Consultation Fee: ₹{doctorFee}
                  </p>
                </div>
              </div>
            )}
            
            {slots && Object.keys(slots).length > 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <h5 style={{ 
                  color: '#2c3e50', 
                  fontWeight: 'bold', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <FaClock style={{ color: '#0d6efd' }} />
                  Available Time Slots
                </h5>
                {Object.keys(slots).map((date, index) => (
                  <div key={index} style={{ marginBottom: '25px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '12px',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #0d6efd11 0%, #0dcaf022 100%)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #0d6efd'
                    }}>
                      <FaCalendarAlt style={{ color: '#0d6efd', fontSize: '18px' }} />
                      <h6 style={{ margin: 0, color: '#2c3e50', fontWeight: '600' }}>
                        {slots[date].day} ({date})
                      </h6>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', paddingLeft: '10px' }}>
                      {slots[date].slots.map((slot, i) => (
                        <Button
                          key={i}
                          variant={selectedSlot === slot && selectedDate === date ? "primary" : "outline-primary"}
                          style={{
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedSlot === slot && selectedDate === date ? '0 4px 12px rgba(13, 110, 253, 0.3)' : 'none',
                            transform: selectedSlot === slot && selectedDate === date ? 'scale(1.05)' : 'scale(1)'
                          }}
                          onClick={() => handleSlotSelect(date, slot)}
                        >
                          <FaClock style={{ marginRight: '8px' }} />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                color: '#6c757d'
              }}>
                <FaClock style={{ fontSize: '48px', color: '#dee2e6', marginBottom: '15px' }} />
                <p style={{ margin: 0, fontSize: '16px' }}>No slots available for this doctor.</p>
              </div>
            )}
          </>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h5 style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: '#2c3e50',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <MdPayment style={{ fontSize: '28px', color: '#0d6efd' }} />
              Choose Payment Method
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div
                onClick={() => storeAppointment("Pay on Counter")}
                style={{
                  background: 'linear-gradient(135deg, #19875411 0%, #19875422 100%)',
                  border: '2px solid #198754',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(25, 135, 84, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(25, 135, 84, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 135, 84, 0.2)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  boxShadow: '0 4px 15px rgba(25, 135, 84, 0.3)'
                }}>
                  <FaMoneyBillWave style={{ fontSize: '40px', color: 'white' }} />
                </div>
                <h6 style={{ fontWeight: 'bold', color: '#198754', marginBottom: '5px' }}>Pay on Counter</h6>
                <p style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>Pay at clinic during visit</p>
              </div>

              <div
                onClick={handleOnlinePayment}
                style={{
                  background: 'linear-gradient(135deg, #0d6efd11 0%, #0dcaf022 100%)',
                  border: '2px solid #0d6efd',
                  borderRadius: '12px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(13, 110, 253, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.2)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)'
                }}>
                  <FaCreditCard style={{ fontSize: '40px', color: 'white' }} />
                </div>
                <h6 style={{ fontWeight: 'bold', color: '#0d6efd', marginBottom: '5px' }}>Pay Online</h6>
                <p style={{ margin: 0, fontSize: '13px', color: '#6c757d' }}>Secure payment via Razorpay</p>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none', backgroundColor: '#f8f9fa', padding: '20px 30px' }}>
        {!showPaymentOptions ? (
          <Button
            style={{
              background: 'linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 30px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onClick={handleBookAppointment}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(13, 110, 253, 0.3)';
            }}
          >
            <FaCheckCircle style={{ marginRight: '8px' }} />
            Book Appointment
          </Button>
        ) : null}
        <Button 
          variant="secondary" 
          onClick={handleClose}
          style={{
            padding: '12px 30px',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SlotSelectionModal;
