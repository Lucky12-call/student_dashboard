import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });

import jwt from "jsonwebtoken";

console.log(process.env.ADMIN_EMAIL);
console.log(process.env.ADMIN_PASSWORD);
console.log(process.env.JWT_SECRET);

// LOGIN CONTROLLER
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email & Password required" });
    }

    // Check admin credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create token payload
    const tokenPayload = { email: process.env.ADMIN_EMAIL, role: "admin" };

    // Generate JWT token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set HttpOnly Cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT CONTROLLER
const logoutAdmin = (_, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out successfully" });
};

export { loginAdmin, logoutAdmin };
