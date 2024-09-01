import React, { useEffect, useState } from 'react';

function ChooseFoodInformation() {
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const storedDetails = localStorage.getItem("bookingDetails");
    if (storedDetails) {
      setBookingDetails(JSON.parse(storedDetails));
    }
  }, []);

  if (!bookingDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="choose-food-container">
      <div className="movie-info p-4 bg-white rounded-lg shadow-lg border-t-4 border-orange-500">
        <div className="flex items-start mb-4">
          <img
            src={bookingDetails.image}
            alt={bookingDetails.movieTitle}
            className="w-24 h-32 object-cover mr-4 rounded-md-"
          />
          <div>
            <h2 className="text-xl font-bold mb-6">{bookingDetails.movieTitle}</h2>
            <p className="text-sm">{bookingDetails.format} - <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">T16</span></p>
          </div>
        </div>
        <p className="text-[18px] mb-2">
          <span className="font-semibold">{bookingDetails.theaterName}</span>
        </p>
        <p className="text-[16px] mb-4">
          <span className="font-sans">Suất:</span> <span className="font-bold">{bookingDetails.time}</span> - {bookingDetails.date}
        </p>
        <p className="text-[16px] mb-4">
          Ghế đã chọn: <span className="font-bold">{bookingDetails.selectedSeats.join(', ')}</span>
        </p>
        <div className="total mt-4 flex items-center justify-between">
          <p className="text-lg font-bold">Tổng cộng:</p>
          <p className="text-orange-500 font-bold">{bookingDetails.totalPrice.toLocaleString()} đ</p>
        </div>
      </div>

      {/* Tiếp tục với phần chọn đồ ăn */}
      <div className="food-selection mt-8">
        <h3 className="text-lg font-bold mb-4">Chọn đồ ăn</h3>
        {/* Render các lựa chọn đồ ăn */}
      </div>
    </div>
  );
}

export default ChooseFoodInformation;
