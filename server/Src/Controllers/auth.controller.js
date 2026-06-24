const bcrypt = require('bcrypt')
const User = require('../Models/User.model')
const { generateAccessToken, generateRefreshToken } = require('../Utils/generatetoken')

const register = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = await User.create({
      username,
      email,
      phone,
      passwordHash,
      role: 'user'
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    })

  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    })

  } catch (error) {
    next(error)
  }
}

const refresh = async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken')
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ error: 'No refresh token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ error: 'Invalid refresh token' })
    }

    const accessToken = generateAccessToken(user)
    res.json({ accessToken })

  } catch (error) {
    return res.status(403).json({ error: 'Refresh token expired or invalid' })
  }
}

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken
    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null })
    }
    res.clearCookie('refreshToken')
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, refresh, logout }