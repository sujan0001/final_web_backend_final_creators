const express = require("express")
const router = express.Router()

const { registerUser, loginUser, resetPassword,sendResetLink, getAllCreators, getAllUsers } = require("../controllers/userController") 

router.post(
    "/register",
    registerUser
)
router.post(
    "/login",
    loginUser
)
router.post(
    "/request-reset",
     sendResetLink
)
router.post(
    "/reset-password/:token", 
    resetPassword
)

router.get(
    "/GetAllCreators",
     getAllCreators
)

router.get(
    "/admin/users",
     getAllUsers
); 

module.exports = router;
