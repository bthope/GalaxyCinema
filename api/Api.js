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



