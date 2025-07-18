// Login validation
const validateLogin = (req, res, next) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        return res.status(400).json({
            success: false,
            message: 'email and password are required'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

// SignUp validation
const validateSignUp = (req, res, next) => {
    const { organizationType, organizationName, userName, emailId, password } = req.body;
 
    if (!organizationType) {
        return res.status(400).json({
            success: false,
            message: 'Organization type is required',
        });
    }
    
    if (!organizationName) {
        return res.status(400).json({
            success: false,
            message: 'Organization name is required',
        });
    }
    
    if (!userName) {
        return res.status(400).json({
            success: false,
            message: 'User name is required',
        });
    }
    
    if (!emailId) {
        return res.status(400).json({
            success: false,
            message: 'Email ID is required',
        });
    }
    
    if (!password) {
        return res.status(400).json({
            success: false,
            message: 'Password is required',
        });
    }
    

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

// Email check
const validateCheckEmail = (req, res, next) => {
    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }

    next();
};

// Password check for login
const validatePassword = (req, res, next) => {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
        return res.status(400).json({
            success: false,
            message: 'email and password are required'
        });
    }

    next();
};

const validateChangePassword = (req, res, next) => {
    const { organization_id, oldPassword, newPassword, userId } = req.body;
  
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id is required'
      });
    }
  
    if (!oldPassword) {
      return res.status(400).json({
        success: false,
        message: 'oldPassword is required'
      });
    }
  
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'newPassword is required'
      });
    }
  
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }
  
    next();
  };

export {
    validateSignUp,
    validateLogin,
    validateCheckEmail,
    validatePassword,
    validateChangePassword
};
