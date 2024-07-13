class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleWare =(err, req, res, next) =>{
    err.message = err.message || "Internal Server Error",
    err.statusCode = err.statusCode || 500;

    if(err.name === "CaseError"){
        const message = `Resouce not found. invalid ${err.path}`
        err = new ErrorHandler(message, 400);
    }
    if(err.name === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
        err = new ErrorHandler(message, 400);
    }
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, Try again!`;
        err = new ErrorHandler(message, 400);
    }
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is expired, Try again!`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success : false,
        message : err.message,
});
};

export default ErrorHandler;