const express = require("express")
const {sendEmail} = require("../Controllers/sendemail")
const router = express.Router()
router.post("/reset",sendEmail)
module.exports = router;