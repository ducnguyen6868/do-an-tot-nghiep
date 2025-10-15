const { recipient,
    addRecipient,
    deleteRecipient,
    setDefaultRecipient,
    editRecipient } = require("../controllers/recipientController");
const express = require("express");
const verifyUser = require('../middlewares/authUser');
const router = express.Router();

router.get("/", verifyUser, recipient);
router.post("/add", verifyUser, addRecipient);
router.delete("/:recipientId", verifyUser, deleteRecipient);
router.patch('/setDefault/:recipientId', verifyUser, setDefaultRecipient);
router.put('/edit',verifyUser,editRecipient);
module.exports = router;