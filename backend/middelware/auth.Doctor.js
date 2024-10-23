import jwt from "jsonwebtoken";
// authorization of Doctor
const authDoctor = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or incorrect.",
      });
    }

    const dToken = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    const tokenDecoded = jwt.verify(dToken, process.env.JWT_SECRET);
    req.body.docId = tokenDecoded.id;
    next(); // Proceed to the next middleware if authorization is successful
  } catch (err) {
    console.error("Error in Token Verification:", err); // Log the error
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default authDoctor;
