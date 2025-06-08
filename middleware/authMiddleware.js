import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  // console.log("header",authHeader)
  

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  // console.log(token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log("Auth token received:", req.header("Authorization"));
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or Expired Token" });
    // console.log("invalid")
  }
};

export default auth;
