const express = require('express')
const router = express.Router()

const {register, login, editprofile, addfriend, viewfriend, deletefriend, sendmessage} = require("../controller/control")

router.post("/user",register)
router.post("/login", login)
router.put("/user/:username",editprofile)
router.post("/friend",addfriend)
router.get("/friend/:username",viewfriend)
router.delete("/friend",deletefriend)
router.post("/message", sendmessage)
router.get("/message/:username")
module.exports = router
