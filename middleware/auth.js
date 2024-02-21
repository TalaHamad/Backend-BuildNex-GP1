import { verifyToken } from '../utils/tokenUtils.js';

const authMiddleware = async (req, res, next) => {
  try {
    const reqtoken = req.headers.authorization;
    console.log('reqtoken:', reqtoken);

    if (!reqtoken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }


    verifyToken(reqtoken)
      .then((decoded) => {
        const userId = decoded.id;
        req.user = userId; 
        next();
      })
      .catch(() => {
        return res.status(401).json({ error: 'Unauthorized' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export default authMiddleware; 
