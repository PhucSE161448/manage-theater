import React, { useState } from "react";
import "./App.css";

// Cấu trúc hàng ghế với số ghế bên trái và bên phải đều bằng nhau
const rows = [
  { row: "B", seats: 10 },
  { row: "C", seats: 10 },
  { row: "D", seats: 10 },
  { row: "E", seats: 10 },
  { row: "F", seats: 10 },
  { row: "G", seats: 10 },
  { row: "H", seats: 10 },
  { row: "I", seats: 10 },
  { row: "J", seats: 10 },
  { row: "K", seats: 10 },
  { row: "L", seats: 10 },
  { row: "M", seats: 10 },
  { row: "N", seats: 10 },

  // Thêm các hàng khác nếu cần
];
const seatPrices = {
  red: 300000, // Ghế màu đỏ
  yellow: 250000, // Ghế màu vàng
  green: 200000, // Ghế màu xanh
  pink: 150000, // Ghế màu hồng
};
function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const handleSelectSeat = (row, side, seat, color, price) => {
    const seatKey = `${row}-${side}-${seat}`;
    setSelectedSeats((prevSeats) => {
      const exists = prevSeats.find((s) => s.key === seatKey);
      if (exists) {
        // Nếu ghế đã được chọn, xóa khỏi danh sách
        return prevSeats.filter((s) => s.key !== seatKey);
      } else {
        // Nếu ghế chưa được chọn, thêm vào danh sách
        return [...prevSeats, { key: seatKey, row, side, seat, color, price }];
      }
    });
  };

  const handlePayment = () => {
    if (selectedSeats.length > 0) {
      alert(`Bạn đã chọn các ghế: ${selectedSeats.join(", ")}`);
    } else {
      alert("Vui lòng chọn ít nhất một ghế trước khi thanh toán!");
    }
  };

  const isYellowRow = (row) =>
    ["B", "C", "D", "E", "F", "G", "H"].includes(row);
  const isPinkRow = (row) => ["K", "L"].includes(row);
  const isPurpleRow = (row) => ["M"].includes(row);
  const isBlueRow = (row) => ["I", "J"].includes(row); // Thêm điều kiện cho hàng I và J

  const isBlueSeat = (row, seat) => {
    // For rows D, E, F, G, H, seats 17 and 19 are blue
    if (["D", "E", "F", "G", "H"].includes(row)) {
      return seat === 17 || seat === 19;
    }
    return false;
  };

  const isDisabledSeat = (row) => row === "N"; // Kiểm tra hàng N
  const totalPrice = selectedSeats.reduce(
    (total, seat) => total + seat.price,
    0
  );
  return (
    <div className="app">
      <h1>Sơ Đồ Ghế Nhà Hát</h1>
      <div className="stage">SÂN KHẤU</div>
      <div className="seat-map-container">
        <div className="seat-map">
          {rows.map((rowData) => (
            <div className="row" key={rowData.row}>
              {/* Ghế bên trái */}
              <div
                className={`side left ${rowData.row === "A" ? "side-a" : ""}`}
              >
                <div className="row-label">{rowData.row}</div>
                {rowData.row === "A"
                  ? // Hàng A không thể chọn ghế
                    Array.from({ length: 10 }).map((_, index) => (
                      <div key={`left-A-${index}`} className="seat disabled">
                        X
                      </div>
                    ))
                  : // Các hàng khác
                    Array.from({ length: rowData.seats }, (_, i) => 2 * i + 1)
                      .reverse()
                      .map((seat) => (
                        <div
                          key={`left-${rowData.row}${seat}`}
                          className={`seat ${
                            isYellowRow(rowData.row) ? "yellow" : ""
                          } ${isPinkRow(rowData.row) ? "pink" : ""} ${
                            isPurpleRow(rowData.row) ? "purple" : ""
                          } ${isBlueRow(rowData.row) ? "blue" : ""} ${
                            isBlueSeat(rowData.row, seat) ? "blue" : ""
                          } ${
                            selectedSeats.includes(`${rowData.row}-L-${seat}`)
                              ? "selected"
                              : ""
                          } ${isDisabledSeat(rowData.row) ? "disabled" : ""}`}
                          onClick={() =>
                            !isDisabledSeat(rowData.row) &&
                            handleSelectSeat(
                              rowData.row,
                              "L", // Hoặc "R" cho bên phải
                              seat,
                              isBlueRow(rowData.row)
                                ? "yellow"
                                : isPinkRow(rowData.row)
                                ? "blue"
                                : isPurpleRow(rowData.row)
                                ? "pink"
                                : isYellowRow(rowData.row) // Kiểm tra dòng màu đỏ
                                ? "red"
                                : "green", // Màu mặc định
                              seatPrices[
                                isBlueRow(rowData.row)
                                  ? "yellow"
                                  : isPinkRow(rowData.row)
                                  ? "blue"
                                  : isPurpleRow(rowData.row)
                                  ? "pink"
                                  : isYellowRow(rowData.row) // Kiểm tra màu đỏ
                                  ? "red"
                                  : "green"
                              ] // Giá dựa vào màu
                            )
                          }
                        >
                          {isDisabledSeat(rowData.row) ||
                          selectedSeats.includes(`${rowData.row}-L-${seat}`)
                            ? "X"
                            : seat}
                        </div>
                      ))}
              </div>

              {/* Lối đi */}
              <div className="aisle"></div>

              {/* Ghế bên phải */}
              <div
                className={`side right ${rowData.row === "A" ? "side-a" : ""}`}
              >
                {rowData.row === "A"
                  ? // Hàng A không thể chọn ghế
                    Array.from({ length: 10 }).map((_, index) => (
                      <div key={`right-A-${index}`} className="seat disabled">
                        X
                      </div>
                    ))
                  : // Các hàng khác
                    Array.from(
                      { length: rowData.seats },
                      (_, i) => 2 * i + 1
                    ).map((seat) => (
                      <div
                        key={`right-${rowData.row}${seat}`}
                        className={`seat ${
                          isYellowRow(rowData.row) ? "yellow" : ""
                        } ${isPinkRow(rowData.row) ? "pink" : ""} ${
                          isPurpleRow(rowData.row) ? "purple" : ""
                        } ${isBlueRow(rowData.row) ? "blue" : ""} ${
                          isBlueSeat(rowData.row, seat) ? "blue" : ""
                        } ${
                          selectedSeats.includes(`${rowData.row}-R-${seat}`)
                            ? "selected"
                            : ""
                        } ${isDisabledSeat(rowData.row) ? "disabled" : ""}`}
                        onClick={() =>
                          !isDisabledSeat(rowData.row) &&
                          handleSelectSeat(
                            rowData.row,
                            "R", // Hoặc "R" cho bên phải
                            seat,
                            isYellowRow(rowData.row)
                              ? "yellow"
                              : isPinkRow(rowData.row)
                              ? "pink"
                              : isPurpleRow(rowData.row)
                              ? "purple"
                              : "green", // Màu mặc định
                            seatPrices[
                              isYellowRow(rowData.row) ? "yellow" : "green"
                            ] // Giá dựa vào màu
                          )
                        }
                      >
                        {isDisabledSeat(rowData.row) ||
                        selectedSeats.includes(`${rowData.row}-R-${seat}`)
                          ? "X"
                          : seat}
                      </div>
                    ))}
              </div>
              <div className="row-label">{rowData.row}</div>
            </div>
          ))}

          {/* Hàng A và cửa */}
          <div className="door-row">
            {/* Ghế hàng A */}
            <div className="side left side-a">
              <div className="row-label">A</div>
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={`left-A-${index}`} className="seat disabled">
                  X
                </div>
              ))}
            </div>

            {/* Cửa ra vào */}
            <div className="door">
              <div className="door-label">Cửa Ra Vào</div>
              <i className="fas fa-door-closed door-icon"></i>
            </div>

            {/* Ghế hàng A bên phải */}
            <div className="side right side-a">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={`right-A-${index}`} className="seat disabled">
                  X
                </div>
              ))}
              <div className="row-label">A</div>
            </div>
          </div>

          {/* Đường gạch ngang */}
          <div className="horizontal-line"></div>

          <div className="center--section">
            <div className="grid-item">
              <div className="room-name">Kỹ Thuật Ánh Sáng</div>
              <div className="room-name">Kỹ Thuật</div>
            </div>
            <div className="grid-item">
              <div className="room-seats">
                {/* Ghế bên trái */}
                <div className="side-left">
                  <div className="row">
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng đầu tiên (màu vàng) */}
                  </div>
                  <div className="row">
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-item3">
              <div className="room-seats">
                {/* Ghế bên trái */}
                <div className="side-left">
                  <div className="row2">
                    <div className={`seat disabled}`}>X</div>{" "}
                    {/* Ghế hàng đầu tiên (màu vàng) */}
                  </div>
                  <div className="row2">
                    <div className={`seat disabled}`}>X</div>{" "}
                    <div className={`seat disabled}`}>X</div>{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-item">
              <div className="room-name1">Phía Trên Lầu</div>
              <div className="room-name">Phòng Kỹ Thuật Âm Thanh</div>
            </div>
            <div className="grid-item2">
              <div className="room-seats">
                {/* Ghế bên trái */}
                <div className="side-left">
                  <div className="row2">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-25`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 25)}
                    >
                      25
                    </div>{" "}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-26`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 26)}
                    >
                      26
                    </div>{" "}
                    {/* Ghế hàng đầu tiên (màu vàng) */}
                  </div>
                  <div className="row2">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-17`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 17)}
                    >
                      17
                    </div>{" "}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-18`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 18)}
                    >
                      18
                    </div>{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-item">
              <div className="room-seats">
                {/* Ghế bên trái */}
                <div className="side-left">
                  <div className="row">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-37`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 37)}
                    >
                      37
                    </div>{" "}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-38`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 38)}
                    >
                      38
                    </div>{" "}
                    {/* Ghế hàng đầu tiên (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-32`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 32)}
                    >
                      32
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-33`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 33)}
                    >
                      33
                    </div>{" "}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-34`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 34)}
                    >
                      34
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-27`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 27)}
                    >
                      27
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-28`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 28)}
                    >
                      28
                    </div>{" "}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-29`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 29)}
                    >
                      29
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-19`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 19)}
                    >
                      19
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-20`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 20)}
                    >
                      20
                    </div>{" "}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-21`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 21)}
                    >
                      21
                    </div>{" "}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-22`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 22)}
                    >
                      22
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-item">
              <div className="room-seats">
                {/* Ghế bên trái */}
                <div className="side-left">
                  <div className="row">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-39`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 39)}
                    >
                      39
                    </div>{" "}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-40`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 40)}
                    >
                      40
                    </div>{" "}
                    {/* Ghế hàng đầu tiên (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-35`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 35)}
                    >
                      35
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat yellow ${
                        selectedSeats.includes(`Tech-L-36`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 36)}
                    >
                      36
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-30`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 30)}
                    >
                      {" "}
                      30
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-31`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 31)}
                    >
                      {" "}
                      31
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                  <div className="row">
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-23`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 23)}
                    >
                      23
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                    <div
                      className={`seat pink ${
                        selectedSeats.includes(`Tech-L-24`) ? "selected" : ""
                      }`}
                      onClick={() => handleSelectSeat("Tech", "L", 24)}
                    >
                      24
                    </div>{" "}
                    {/* Ghế hàng thứ hai (màu vàng) */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="price-container">
          <div class="price-item">
            Giá ghế <span class="color-box red"></span> ĐỎ: 300.000 VND
          </div>
          <div class="price-item">
            Giá ghế <span class="color-box yellow"></span> VÀNG: 250.000 VND
          </div>
          <div class="price-item">
            Giá ghế <span class="color-box blue"></span> XANH: 200.000 VND
          </div>
          <div class="price-item">
            Giá ghế <span class="color-box pink"></span> HỒNG: 150.000 VND
          </div>
          <div className="payment-box">
            <div className="payment-box">
              <div className="selected-seats">
                <h3>Ghế đã chọn:</h3>
                <ul>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat, index) => (
                      <li key={index}>
                        {seat.row}-{seat.side}-{seat.seat} ({seat.color}) -{" "}
                        {seat.price} VND
                      </li>
                    ))
                  ) : (
                    <li>Chưa có ghế nào được chọn.</li>
                  )}
                </ul>
              </div>

              <div className="total-price">
                <h4>Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VND</h4>
              </div>

              <button className="payment-btn" onClick={handlePayment}>
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Cửa ra vào */}

      <button className="payment-btn" onClick={handlePayment}>
        Thanh Toán
      </button>
    </div>
  );
}

export default App;
