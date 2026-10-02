const asyncHandler = (requestHandler) => {
    return (req,res,next) => {
        Promise
            .resolve(requestHandler(req,res,next))
            .catch((err) => next(err))
    }; // next --> is a middleware
}
export {asyncHandler}