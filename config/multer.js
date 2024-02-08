const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        console.log("received name: " + path.extname(file.originalname));
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        let lastFileName = file.fieldname + "-" + uniqueSuffix;
        module.exports.lastFileName = lastFileName;
        cb(null, lastFileName);
    },
});

const upload = multer({ storage });

module.exports = { upload };
