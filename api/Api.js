export const host = "192.168.1.8";

// Account

export const API_Register = `http://${host}:8080/api/v1/auth/register`;
export const API_CheckOTPEmail = `http://${host}:8080/api/v1/auth/register/validate-otp`;
export const API_Login = `http://${host}:8080/api/v1/auth/login`;
export const API_EditPassword = `http://${host}:8080/api/v1/auth/change-password`
export const API_forgotPassword = `http://${host}:8080/api/v1/auth/forgot-password`

export const API_logout = `http://${host}:8080/api/v1/auth/logout`


// Movies

export const API_GetMovies = `http://${host}:8080/api/v1/movies`
export const API_GetMovieSlug = `http://${host}:8080/api/v1/movies/`

// Cinema
export const API_GetCinema = `http://${host}:8080/api/v1/cinemas`

// roomLayout  
export const API_GetRoomLayout = `http://${host}:8080/api/v1/show-times/`

// Showtime
export const API_GetShowtime = `http://${host}:8080/api/v1/show-times`

// Get Sản phẩm
export const API_GetCombo = `http://${host}:8080/api/v1/products`

//Tạo đơn hàng
export const API_CreateOrder = `http://${host}:8080/api/v1/orders`


// Pyament Hoàn tất đơn hàng
export const API_CompleteOrder = `http://${host}:8080/api/v1/orders/`

// Transaction  Lịch sử
export const API_GetTransaction = `http://${host}:8080/api/v1/orders`

// Cập nhật sản phẩm 
export const API_UpdateProduct = `http://${host}:8080/api/v1/orders/`

// Tạo Discount
export const API_GetDiscount = `http://${host}:8080/api/v1/orders/`

// Xóa discount  
export const API_DeleteDiscount = `http://${host}:8080/api/v1/orders/`




