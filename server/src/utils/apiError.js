class apiError extends Error {
    constructor(
        statusCode,
        message = "somethin went wrong",
    ){
        super(message)
        this.statusCode = statusCode
    }
}

export {apiError}