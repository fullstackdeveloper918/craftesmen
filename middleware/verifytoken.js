const { admin, bucket } = require("../firebase/firebase_auth");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.token;

    console.log(req.headers, "headers");
    console.log(token, "token");
    if (!token) {
      res.json({
        status: 500,
        message: "You don have provide the token",
      });
      return false;
    }

    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.decodedToken = decodedToken;
        next();
      })
      .catch((error) => {
        console.log(error.message, "within the try conditionn");
        res.status(400).json({
          status: 400,
          message: error.message,
        });
      });
  } catch (error) {
    console.log(error.message, "within the catch condition");
    res.json({
      status: 400,
      message: error.message,
    });
  }
};

module.exports = {
  verifyToken,
};
