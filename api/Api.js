export const host = "192.168.1.7";

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

// roomLayout  `http://192.168.1.7:8080/api/v1/show-times/${showtimeId}/seat-layout`
export const API_GetRoomLayout = `http://${host}:8080/api/v1/show-times/`

// Showtime
export const API_GetShowtime = `http://${host}:8080/api/v1/show-times`

// Combo
export const API_GetCombo = `http://${host}:8080/api/v1/products`


export const API_CreateOrder = `http://${host}:8080/api/v1/orders`

// Pyament
// http://192.168.1.7:8080/api/v1/orders/${orderId}/complete
export const API_CompleteOrder = `http://${host}:8080/api/v1/orders/`




