const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  try {
    //token is like- Bearer eerreregffvdfdv    --- that's why we have to remove Bearer

    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: " Token missing",
      });
    }

    try {
      let decode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = decode.id;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong in authMiddlware",
    });
  }
};
