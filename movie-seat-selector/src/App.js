import React, { useEffect, useState } from "react";
import "./App.css"; // Tạo file CSS dựa trên phần style bạn cung cấp

const SeatLayout = ({ rows, cols, hiddenSeats, charCols, onSeatSelect }) => {
  const [seatData, setSeatData] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7170/api/Seat")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch seat data");
        }
        return response.json();
      })
      .then((result) => {
        const seatArray = result.data || []; // Trích xuất mảng "data"
        setSeatData(seatArray);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
      });
  }, []);

  const handleSeatClick = (rowChar, col, color) => {
    const seatId = `${rowChar}${col}`;
    const seatInfo = `${rowChar} - ${col} - ${color}`;

    if (selectedSeats.includes(seatInfo)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatInfo));
    } else {
      setSelectedSeats([...selectedSeats, seatInfo]);
    }

    onSeatSelect(seatId, rowChar, col, color);
  };

  const renderSeatLayout = () => {
    const layout = [];

    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row);

      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";
        let isHidden = false;
        let isBooked = false;
        if (hiddenSeats[rowChar]?.includes(col)) {
          isHidden = true;
        }

        const seat = Array.isArray(seatData)
          ? seatData.find((s) => s.rowChar === rowChar && s.colNumber === col)
          : null;

        if (seat) {
          color = seat.seatColor?.color || "";
          isBooked = seat.isBooked;
        }

        if (charCols.includes(col)) {
          className += " char";
          content = rowChar;
          color = "";
        } else {
          content = isHidden ? "" : col;
        }

        const seatInfo = `${rowChar} - ${col} - ${color}`;
        if (selectedSeats.includes(seatInfo)) {
          content = "X";
          className += " x-mark";
        }
        const seatStyle = isBooked
          ? { backgroundColor: "gray" } // Màu xám nếu ghế đã được đặt
          : color === "red"
          ? { backgroundColor: "red" }
          : color === "yellow"
          ? { backgroundColor: "#f5a003" }
          : {};

        if (!isHidden) {
          layout.push(
            <div
              key={`${row}-${col}`}
              className={className}
              style={seatStyle}
              onClick={
                isBooked ? null : () => handleSeatClick(rowChar, col, color)
              }
            >
              {content}
            </div>
          );
        } else {
          layout.push(<div key={`${row}-${col}`} className="seat empty"></div>);
        }
      }
    }

    return layout;
  };

  return <div className="seat-layout">{renderSeatLayout()}</div>;
};
const BottomLayout = ({
  rows,
  cols,
  hiddenSeats,
  charCols,
  selectedSeats,
  onSeatSelect,
}) => {
  const [seatsData, setSeatsData] = useState([]); // State chứa dữ liệu ghế từ API

  // Gọi API để lấy dữ liệu ghế
  useEffect(() => {
    fetch("https://localhost:7170/api/Seat")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch seat data");
        }
        return response.json();
      })
      .then((result) => {
        const seatArray = result.data || []; // Trích xuất mảng dữ liệu ghế
        const filteredSeats = seatArray.filter(
          (seat) => seat.floor === "Trên Lầu"
        );
        setSeatsData(filteredSeats);
      })
      .catch((error) => {
        console.error("Error fetching seat data:", error);
      });
  }, []); // Chỉ gọi API khi component được render lần đầu

  // Xử lý khi người dùng click vào ghế
  const handleBottomSeatClick = (rowChar, col, color) => {
    const seatId = `${rowChar}${col}`;
    onSeatSelect(seatId, rowChar, col, color, "Trên Lầu");
  };

  // Render layout ghế dưới
  const renderBottomLayout = () => {
    const layout = [];

    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row);
      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";
        let isBooked = false;
        let isHidden = false;

        if (hiddenSeats[rowChar]?.includes(col)) {
          isHidden = true;
        }

        // Tìm ghế trong dữ liệu từ API
        const seat = Array.isArray(seatsData)
          ? seatsData.find((s) => s.rowChar === rowChar && s.colNumber === col)
          : null;

        if (seat) {
          // Nếu ghế có dữ liệu, xác định trạng thái đã đặt và màu sắc
          isBooked = seat.isBooked;
          color = seat.seatColor?.color || ""; // Màu mặc định nếu không có thông tin màu
        }
        if (charCols.includes(col)) {
          className += " char";
          content = rowChar;
          color = "";
        } else {
          content = isHidden ? "" : col;
        }
        const isSelected = selectedSeats.some(
          (seat) => seat === `${rowChar} - ${col} - ${color} - Trên Lầu`
        );

        if (isSelected) {
          content = "X";
          className += " x-mark"; // Đánh dấu ghế đã chọn
        }

        // Xử lý màu sắc ghế
        const seatStyle = isBooked
          ? { backgroundColor: "gray" } // Màu xám nếu ghế đã được đặt
          : color === "blue"
          ? { backgroundColor: "#3498db" }
          : color === "pink"
          ? { backgroundColor: "#eb0578" }
          : {};
        const isClickable = !isBooked && !charCols.includes(col);
        // Thêm sự kiện click cho các ghế chưa được đặt và không phải là ký tự
        const handleClick = isClickable
          ? null
          : () => handleBottomSeatClick(rowChar, col, color);

        if (!isHidden) {
          layout.push(
            <div
              key={`${row}-${col}`}
              className={className}
              style={seatStyle}
              onClick={handleClick}
            >
              {content}
            </div>
          );
        } else {
          layout.push(<div key={`${row}-${col}`} className="seat empty"></div>);
        }
      }
    }

    return layout;
  };

  return (
    <div>
      <div style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
        <input
          type="text"
          value="Phía Trên Lầu"
          readOnly
          style={{
            padding: "10px",
            fontSize: "16px",
            textAlign: "center",
            width: "auto",
            backgroundColor: "#d3d3d3",
            color: "black",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="bottom-layout">{renderBottomLayout()}</div>
    </div>
  );
};

const seatPrices = {
  red: 300000,
  yellow: 250000,
  blue: 200000,
  pink: 150000,
};
const colorNamesInVietnamese = {
  red: " Ghế Đỏ",
  yellow: "Ghế Vàng",
  blue: "Ghế Xanh",
  pink: "Ghế Hồng",
};
const App = () => {
  const hiddenSeats = {
    A: [19, 20, 21, 22],
    B: [17, 19, 20, 21, 22],
    D: [17],
    F: [17],
    H: [17],
    J: [17],
    L: [17],
    N: [1, 2, 3, 4, 17, 19, 20, 21, 22],
  };

  const bottomLayoutProps = {
    rows: 10,
    cols: 23,
    hiddenSeats: {
      H: [7, 14, 23],
      D: [14],
      F: [14],
      B: [14],
      J: [9, 10, 11, 12, 13, 14],
    },
    charCols: [8, 15],
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatSelect = (seatId, rowChar, col, color, floor) => {
    const seatInfo = `${rowChar} - ${col} - ${color}${
      floor ? " - " + floor : ""
    }`;
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatInfo)) {
        return prevSeats.filter((seat) => seat !== seatInfo); // Remove if already selected
      }
      return [...prevSeats, seatInfo]; // Add if not selected
    });
  };
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const [, , color] = seat.split(" - ");
      return total + seatPrices[color]; // Tính tổng tiền theo màu ghế
    }, 0);
  };
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          backgroundColor: "#333",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Sân khấu
      </div>

      <div className="main-container">
        <div className="seat-layout-wrapper">
          <SeatLayout
            rows={14}
            cols={22}
            hiddenSeats={hiddenSeats}
            charCols={[5, 18]}
            onSeatSelect={handleSeatSelect}
          />
        </div>
        <div className="price-container-wrapper">
          <div className="layout-wrapper">
            <div className="price-container">
              <div className="price-item">
                Giá ghế ĐỎ <span className="color-box red"></span>: 300.000 VND
              </div>
              <div className="price-item">
                Giá ghế VÀNG <span className="color-box yellow"></span>: 250.000
                VND
              </div>
              <div className="price-item">
                Giá ghế XANH <span className="color-box blue"></span>: 200.000
                VND
              </div>
              <div className="price-item">
                Giá ghế Hồng <span className="color-box pink"></span>: 150.000
                VND
              </div>
            </div>
          </div>
          <div className="selected-seats">
            <h3>Ghế đã chọn:</h3>
            {selectedSeats.length === 0 ? (
              <p>Chưa có ghế nào được chọn</p>
            ) : (
              <ul style={{ fontSize: "18px", paddingLeft: "20px" }}>
                {selectedSeats.map((seat) => {
                  const [rowChar, col, color, floor] = seat.split(" - ");
                  return (
                    <li key={seat} style={{ marginBottom: "10px" }}>
                      {`${rowChar} - ${col} - `}
                      <span>{colorNamesInVietnamese[color]}</span>
                      {floor && <span> - {floor}</span>}
                      <span> - {seatPrices[color].toLocaleString()} VND</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <div
              className="total-price"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginTop: "10px",
                color: "#333",
              }}
            >
              Tổng tiền: {calculateTotalPrice().toLocaleString()} VND
            </div>
            <div className="payment-btn-wrapper" style={{ marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "30%",
                }}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>

        <div className="bottom-layout-wrapper">
          <BottomLayout
            {...bottomLayoutProps}
            selectedSeats={selectedSeats}
            onSeatSelect={handleSeatSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
