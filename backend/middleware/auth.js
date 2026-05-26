import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator permissions required' });
  }
};

export const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Manager permissions required' });
  }
};

export const adminOrManagerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator or Manager role required' });
  }
};

export const isApprovedManager = (req, res, next) => {
  if (req.user && req.user.role === 'manager') {
    if (req.user.is_approved || req.user.payment_completed) {
      return next();
    }
    return res.status(403).json({ 
      message: 'Access denied: Manager account requires Admin approval or Pre-activation payment completion' 
    });
  }
  next();
};
