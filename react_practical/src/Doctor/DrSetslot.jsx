import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaClock, FaCalendarAlt, FaSave, FaCheckCircle } from "react-icons/fa";
import { MdSchedule, MdEventAvailable } from "react-icons/md";

const DrSetslot = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [dateSlots, setDateSlots] = useState({});
  const [activeDate, setActiveDate] = useState(null);

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
  ];

  const doctorId = JSON.parse(sessionStorage.getItem("DocBook"))?.id;

  const fetchSlotsFromBackend = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/slots?doctor_id=${doctorId}`,
      );

      if (response.data.length > 0) {
        // Transform array of individual slots into grouped format
        const groupedSlots = {};

        response.data.forEach((slot) => {
          // Convert ISO date to DD-MM-YYYY format
          const dateObj = new Date(slot.slot_date);
          const formattedDate = formatDate(slot.slot_date);

          // Get day of week
          const dayOfWeek = getDayFromDate(slot.slot_date);

          // Group slots by date
          if (!groupedSlots[formattedDate]) {
            groupedSlots[formattedDate] = {
              day: dayOfWeek,
              slots: [],
            };
          }

          groupedSlots[formattedDate].slots.push(slot.slot_time);
        });

        // Filter out expired slots
        const today = formatDate(new Date().toISOString().split("T")[0]);
        const currentHour = new Date().getHours();
        let filteredSlots = {};

        Object.entries(groupedSlots).forEach(([date, slotData]) => {
          if (date >= today) {
            const validSlots = slotData.slots.filter((slot) => {
              const slotHour = convertTo24HourFormat(slot.split(" - ")[0]);
              return !(date === today && slotHour <= currentHour);
            });

            if (validSlots.length > 0) {
              filteredSlots[date] = { ...slotData, slots: validSlots };
            }
          }
        });

        setDateSlots(filteredSlots);
        setSelectedDates(Object.keys(filteredSlots).sort());

        // Set first date as active if none selected
        if (!activeDate && Object.keys(filteredSlots).length > 0) {
          setActiveDate(Object.keys(filteredSlots).sort()[0]);
        }
      } else {
        // No slots found, reset state
        setDateSlots({});
        setSelectedDates([]);
        setActiveDate("");
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load slots");
    }
  };

  useEffect(() => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    fetchSlotsFromBackend();
  }, [doctorId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB").split("/").join("-");
  };

  const getDayFromDate = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[new Date(dateString).getDay()];
  };

  const addDate = (event) => {
    const rawDate = event.target.value;
    if (!rawDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    const selectedDate = new Date(rawDate);
    selectedDate.setHours(0, 0, 0, 0); // Reset time to midnight

    if (selectedDate < today) {
      toast.warn("You cannot select a past date!");
      return;
    }

    const formattedDate = formatDate(rawDate);

    if (selectedDates.includes(formattedDate)) {
      toast.warn("Date already selected!");
      return;
    }

    const day = getDayFromDate(rawDate);
    const updatedDates = [...selectedDates, formattedDate].sort();

    setSelectedDates(updatedDates);
    setDateSlots({
      ...dateSlots,
      [formattedDate]: { day, slots: [] },
    });
    setActiveDate(formattedDate);
  };

  const toggleSlotSelection = (date, slot) => {
    if (!dateSlots[date]) return;

    const today = formatDate(new Date().toISOString().split("T")[0]);
    if (date === today) {
      const currentHour = new Date().getHours();
      const slotHour = convertTo24HourFormat(slot.split(" - ")[0]);

      if (slotHour <= currentHour) {
        toast.warn("Cannot select a past time slot for today!");
        return;
      }
    }

    const slots = dateSlots[date].slots || [];
    const updatedSlots = slots.includes(slot)
      ? slots.filter((s) => s !== slot)
      : [...slots, slot];

    setDateSlots({
      ...dateSlots,
      [date]: { ...dateSlots[date], slots: updatedSlots },
    });
  };

  const convertTo24HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return time.includes("PM") && hour !== 12 ? hour + 12 : hour;
  };

  const saveSlots = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found. Please log in.");
      return;
    }

    const filteredDateSlots = Object.fromEntries(
      Object.entries(dateSlots).filter(
        ([date, slotData]) => slotData.slots.length > 0,
      ),
    );
    const filteredSelectedDates = Object.keys(filteredDateSlots);

    setSelectedDates(filteredSelectedDates);
    setDateSlots(filteredDateSlots);

    const data = {
      doctor_id: doctorId,
      availableSlots: filteredDateSlots,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/slots`,
        data,
      );
      if (response.status === 201 || response.status === 200) {
        toast.success("Slots saved successfully!");
      }

      // Refetch slots to ensure UI reflects saved data
      await fetchSlotsFromBackend();
    } catch (err) {
      console.error("Error saving slots:", err);
      toast.error(err.response?.data?.message || "Error saving slots.");
    }
  };

  return (
    <Container className="mt-4">
      <style>{`
        .slot-button {
          transition: all 0.3s ease;
        }
        .slot-button:hover {
          transform: translateY(-2px);
        }
        .date-card {
          transition: all 0.3s ease;
        }
        .date-card:hover {
          transform: scale(1.02);
        }
      `}</style>

      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          color: "white",
          boxShadow: "0 10px 30px rgba(111, 66, 193, 0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <MdSchedule style={{ fontSize: "30px" }} />
          </div>
          <div>
            <h2 style={{ margin: "0", fontWeight: "700", fontSize: "28px" }}>
              Manage Availability
            </h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.9, fontSize: "15px" }}>
              Set your available dates and time slots
            </p>
          </div>
        </div>
      </div>

      {/* Current Schedule Overview */}
      {selectedDates.length > 0 && (
        <Card
          style={{
            border: "none",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #198754, #20c997)",
              padding: "20px",
              color: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <MdEventAvailable style={{ fontSize: "28px" }} />
              <div>
                <h5 style={{ margin: 0, fontWeight: "700" }}>
                  Current Schedule Overview
                </h5>
                <p
                  style={{
                    margin: "3px 0 0 0",
                    fontSize: "14px",
                    opacity: 0.9,
                  }}
                >
                  Your currently active availability slots
                </p>
              </div>
            </div>
          </div>
          <div style={{ padding: "25px" }}>
            <Row>
              {selectedDates.map((date) => (
                <Col md={6} lg={4} key={date} className="mb-3">
                  <Card
                    style={{
                      border: "2px solid #e9ecef",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "100%",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0, 0, 0, 0.1)";
                      e.currentTarget.style.borderColor = "#198754";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#e9ecef";
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                        padding: "15px",
                        borderBottom: "2px solid #dee2e6",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "45px",
                            height: "45px",
                            background:
                              "linear-gradient(135deg, #198754, #20c997)",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              lineHeight: "1",
                            }}
                          >
                            {date.split("-")[0]}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              textTransform: "uppercase",
                            }}
                          >
                            {date.split("-")[1]}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "700",
                              fontSize: "15px",
                              color: "#2c3e50",
                            }}
                          >
                            {date}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6c757d" }}>
                            {dateSlots[date]?.day}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "15px" }}>
                      {dateSlots[date]?.slots?.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {dateSlots[date].slots.map((slot, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                background: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px solid #e9ecef",
                              }}
                            >
                              <FaClock
                                style={{ color: "#198754", fontSize: "14px" }}
                              />
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#495057",
                                }}
                              >
                                {slot}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "15px",
                            color: "#dc3545",
                            fontSize: "13px",
                          }}
                        >
                          No slots selected for this date
                        </div>
                      )}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      )}

      <Card
        style={{
          border: "none",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row>
          {/* Date Picker & Selected Dates */}
          <Col md={4}>
            <div
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <FaCalendarAlt style={{ color: "#6f42c1", fontSize: "20px" }} />
                <h6 style={{ margin: 0, fontWeight: "600", color: "#2c3e50" }}>
                  Select Date
                </h6>
              </div>
              <Form.Control
                type="date"
                onChange={addDate}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "2px solid #e0e0e0",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6f42c1")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>

            <Card
              style={{
                border: "none",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #0dcaf0)",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ color: "white", fontWeight: "600", margin: 0 }}>
                  <MdEventAvailable style={{ marginRight: "8px" }} />
                  Selected Dates
                </h6>
              </div>
              <div style={{ padding: "15px" }}>
                {selectedDates.length > 0 ? (
                  selectedDates.map((date) => (
                    <Button
                      key={date}
                      className="date-card slot-button"
                      style={{
                        width: "100%",
                        marginTop: "8px",
                        padding: "12px",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          activeDate === date
                            ? "linear-gradient(135deg, #198754, #20c997)"
                            : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                        color: activeDate === date ? "white" : "#2c3e50",
                        fontWeight: "600",
                        fontSize: "14px",
                        textAlign: "left",
                      }}
                      onClick={() => setActiveDate(date)}
                    >
                      <FaCalendarAlt style={{ marginRight: "8px" }} />
                      {date}
                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "4px",
                          opacity: 0.8,
                        }}
                      >
                        {dateSlots[date]?.day}
                      </div>
                    </Button>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6c757d",
                      padding: "20px 0",
                      margin: 0,
                    }}
                  >
                    No dates selected
                  </p>
                )}
              </div>
            </Card>
          </Col>

          {/* Time Slots */}
          <Col md={4}>
            {activeDate && (
              <Card
                style={{
                  border: "none",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #9d7bd8)",
                    padding: "15px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <FaClock style={{ fontSize: "24px", marginBottom: "8px" }} />
                  <h6 style={{ fontWeight: "600", margin: "5px 0 0 0" }}>
                    Time Slots for {activeDate}
                  </h6>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: "5px 0 0 0",
                      opacity: 0.9,
                    }}
                  >
                    {dateSlots[activeDate]?.day}
                  </p>
                </div>
                <div style={{ padding: "20px" }}>
                  <div className="d-flex flex-wrap justify-content-center">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        className="slot-button"
                        style={{
                          margin: "5px",
                          padding: "10px 15px",
                          borderRadius: "10px",
                          border: "none",
                          background: dateSlots[activeDate]?.slots?.includes(
                            slot,
                          )
                            ? "linear-gradient(135deg, #198754, #20c997)"
                            : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                          color: dateSlots[activeDate]?.slots?.includes(slot)
                            ? "white"
                            : "#2c3e50",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                        onClick={() => toggleSlotSelection(activeDate, slot)}
                      >
                        {dateSlots[activeDate]?.slots?.includes(slot) && (
                          <FaCheckCircle
                            style={{ marginRight: "6px", fontSize: "12px" }}
                          />
                        )}
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </Col>

          {/* Selected Schedule */}
          <Col md={4}>
            <Card
              style={{
                border: "none",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #fd7e14, #ffc107)",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <h6 style={{ color: "white", fontWeight: "600", margin: 0 }}>
                  <FaCalendarAlt style={{ marginRight: "8px" }} />
                  Your Schedule
                </h6>
              </div>
              <div
                style={{
                  padding: "15px",
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                {selectedDates.length > 0 ? (
                  selectedDates.map((date) => (
                    <div
                      key={date}
                      style={{
                        marginBottom: "15px",
                        padding: "15px",
                        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <FaCalendarAlt
                          style={{ color: "#fd7e14", fontSize: "16px" }}
                        />
                        <strong style={{ color: "#2c3e50", fontSize: "14px" }}>
                          {date}
                        </strong>
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginBottom: "8px",
                          fontWeight: "600",
                        }}
                      >
                        {dateSlots[date]?.day}
                      </p>
                      <div style={{ fontSize: "13px", color: "#495057" }}>
                        {dateSlots[date]?.slots?.length > 0 ? (
                          dateSlots[date].slots.map((slot, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 0",
                                borderBottom:
                                  idx < dateSlots[date].slots.length - 1
                                    ? "1px solid #dee2e6"
                                    : "none",
                              }}
                            >
                              <FaClock
                                style={{ color: "#6f42c1", fontSize: "12px" }}
                              />
                              {slot}
                            </div>
                          ))
                        ) : (
                          <p
                            style={{
                              color: "#dc3545",
                              fontSize: "13px",
                              margin: 0,
                            }}
                          >
                            No slots selected
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6c757d",
                      padding: "20px 0",
                      margin: 0,
                    }}
                  >
                    No schedule set
                  </p>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Save Button */}
        <div className="text-center mt-4">
          <Button
            size="lg"
            onClick={saveSlots}
            style={{
              background: "linear-gradient(135deg, #198754, #20c997)",
              border: "none",
              padding: "15px 40px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "16px",
              boxShadow: "0 6px 20px rgba(25, 135, 84, 0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(25, 135, 84, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 6px 20px rgba(25, 135, 84, 0.3)";
            }}
          >
            <FaSave style={{ fontSize: "18px" }} />
            Save Slots
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default DrSetslot;
