import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or incorrect.",
      });
    }

    const Token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    const tokenDecoded = jwt.verify(Token, process.env.JWT_SECRET);
    req.body.userId = tokenDecoded.id;

    // console.log("Decoded Token Email:", tokenDecoded.email); // Log decoded email
    // console.log("Environment Admin Email:", process.env.ADMIN_EMAIL); // Log env variable for comparison

    // if (tokenDecoded.email !== process.env.ADMIN_EMAIL) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Authorization failed. Invalid admin email.",
    //   });
    // }

    next(); // Proceed to the next middleware if authorization is successful
  } catch (err) {
    console.error("Error in Token Verification:", err); // Log the error
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default authUser;
