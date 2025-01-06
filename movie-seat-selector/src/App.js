import React, { useState } from "react";
import "./App.css"; // Tạo file CSS dựa trên phần style bạn cung cấp

const SeatLayout = ({ rows, cols, hiddenSeats, charCols, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (rowChar, col, color) => {
    const seatId = `${rowChar}${col}`;
    const seatInfo = `${rowChar} - ${col} - ${color}`; // Lưu thông tin ghế (hàng - cột - màu)

    if (selectedSeats.includes(seatInfo)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatInfo)); // Xóa nếu đã chọn
    } else {
      setSelectedSeats([...selectedSeats, seatInfo]); // Thêm nếu chưa chọn
    }

    onSeatSelect(seatId, rowChar, col, color); // Gọi hàm khi chọn ghế
  };

  const renderSeatLayout = () => {
    const layout = []; // Đếm số cột thật sự khi bỏ qua cột ký tự

    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row); // Tạo ký tự hàng (A, B, C, ...)
      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";

        const isInvalidSeat =
          (rowChar === "A" && col >= 19 && col <= 22) ||
          (rowChar === "B" && (col === 17 || (col >= 19 && col <= 22))) ||
          ((rowChar === "D" ||
            rowChar === "F" ||
            rowChar === "H" ||
            rowChar === "J" ||
            rowChar === "L") &&
            col === 17) ||
          (rowChar === "N" &&
            (col <= 4 || col === 17 || (col >= 19 && col <= 22)));

        if (isInvalidSeat) {
          layout.push(<div key={`${row}-${col}`} className="seat empty"></div>);
          continue;
        }

        // Kiểm tra màu ghế theo quy tắc đã chỉ định
        if (
          rowChar === "A" ||
          rowChar === "B" ||
          (rowChar === "C" && col >= 1 && col <= 17) ||
          (rowChar >= "D" && rowChar <= "I" && col >= 6 && col <= 17)
        ) {
          color = "red";
        } else {
          color = "yellow";
        }

        // Nếu là cột ký tự (cột 5 hoặc 18), hiển thị ký tự hàng
        if (col === 5 || col === 18) {
          className += " char";
          content = rowChar; // Hiển thị ký tự hàng (A, B, C, ...)
          color = ""; // Không áp dụng màu cho cột ký tự
        } else {
          // Nếu không phải cột ký tự, hiển thị số ghế
          content = col; // Sử dụng số cột thực sự không có ký tự// Tăng số cột thực sự sau khi đã bỏ qua các cột ký tự
        }

        // Kiểm tra xem ghế đã được chọn chưa
        const seatInfo = `${rowChar} - ${col} - ${color}`;

        if (selectedSeats.includes(seatInfo)) {
          content = "X";
          className += " x-mark"; // Hiển thị dấu "X" nếu ghế đã được chọn
        }

        // Thêm màu sắc vào className hoặc style trực tiếp cho các ghế (trừ cột ký tự)
        const seatStyle =
          color === "red"
            ? { backgroundColor: "red" }
            : color === "yellow"
            ? { backgroundColor: "#f5a003" }
            : {};

        // Cột ký tự không có sự kiện onClick
        const handleClick =
          col === 5 || col === 18
            ? null
            : () => handleSeatClick(rowChar, col, color);

        layout.push(
          <div
            key={`${row}-${col}`}
            className={className}
            style={seatStyle} // Áp dụng màu sắc vào mỗi ghế (trừ cột ký tự)
            onClick={handleClick} // Chỉ thêm sự kiện click vào các ghế (không vào cột ký tự)
          >
            {content}
          </div>
        );
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
  const handleBottomSeatClick = (rowChar, col, color) => {
    const seatId = `${rowChar}${col}`;

    // Gọi hàm onSeatSelect từ props để xử lý ghế được chọn
    onSeatSelect(seatId, rowChar, col, color, "Trên Lầu");
  };

  const renderBottomLayout = () => {
    const layout = [];
    for (let row = 1; row <= rows; row++) {
      const rowChar = String.fromCharCode(64 + row);
      for (let col = 1; col <= cols; col++) {
        let className = "seat";
        let content = "";
        let color = "";

        if (rowChar >= "A" && rowChar <= "D") {
          className += " blue";
          color = "blue";
        } else {
          className += " pink";
          color = "pink";
        }

        if (hiddenSeats[rowChar]?.includes(col)) {
          className = "seat empty";
        } else if (charCols.includes(col)) {
          className = "seat char";
          content = rowChar; // Không áp dụng màu cho cột ký tự
        } else {
          content = col; // Sử dụng số cột thực sự không có ký tự
        }
        const isSelected = selectedSeats.some(
          (seat) => seat === `${rowChar} - ${col} - ${color} - Trên Lầu`
        );

        if (isSelected) {
          content = "X";
          className += " x-mark"; // Đánh dấu ghế đã chọn
        }
        const handleClick =
          col === 8 || col === 15
            ? null
            : () => handleBottomSeatClick(rowChar, col, color);
        layout.push(
          <div
            key={`${row}-${col}`}
            className={className}
            onClick={handleClick} // Thêm sự kiện click
          >
            {content}
          </div>
        );
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
  const seatLayoutProps = {
    rows: 14,
    cols: 22,
    hiddenSeats: {
      A: [19, 20, 21, 22],
      B: [17, 19, 20, 21, 22],
      D: [17],
      F: [17],
      H: [17],
      J: [17],
      L: [17],
      N: [1, 2, 3, 4, 17, 19, 20, 21, 22],
    },
    charCols: [5, 18],
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
          <SeatLayout {...seatLayoutProps} onSeatSelect={handleSeatSelect} />
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
