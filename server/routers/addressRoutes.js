const {
     getAddress,
    postAddress,
    deleteAddress,
    patchAddress,
    putAddress } = require("../controllers/addressController");
const express = require("express");
const verifyUser = require('../middlewares/authUser');
const router = express.Router();

router.get("/", verifyUser, getAddress);
router.post("/add", verifyUser, postAddress);
router.delete("/:addressId", verifyUser, deleteAddress);
router.patch('/setDefault/:addressId', verifyUser, patchAddress);
router.put('/edit',verifyUser,putAddress);
module.exports = router;