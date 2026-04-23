exports.tokenExtractor = (req) => {
    return req.headers?.auth || req.cookies?.auth || (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null) || null;
}