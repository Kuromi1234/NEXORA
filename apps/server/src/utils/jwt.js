import jwt from "jsonwebtoken";

export const generateToken = (agentId) => {
  return jwt.sign({ agentId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
