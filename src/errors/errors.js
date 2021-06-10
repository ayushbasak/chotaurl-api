const errors = [
    {
        errorId: 1,
        error: "Could Not Create Shortened / Obfuscated URL"
    },
    {
        errorId: 2,
        error: "Invalid URL provided"
    },
    {
        errorId: 3,
        error: "Authentication Failed"
    },
    {
        errorId: 4,
        error: "Invalid User accessing Admin"
    }
]

module.exports = {
    ERROR_CREATION: errors[0],
    ERROR_INVALID_URL: errors[1],
    ERROR_AUTHENTICATION: errors[2],
    ERROR_INVALID_USER: errors[3]
}