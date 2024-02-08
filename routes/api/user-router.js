const express = require("express");
const router = express.Router();
const UserModel = require("../../models/user");
const upload = require("../../config/multer").upload;
const security = require("../../utils/security");

const validation = require("../../utils/validation/user");

const messageHandler = require("../../config/middlewares/message");

router.post("/register", upload.single("profilePicture"), async (req, res) => {
    if (req.session.user) {
        return res.redirect("/");
    }

    const { username, email, password, birthDate } = req.body;
    const fileName = require("../../config/multer").lastFileName;

    console.log(username, email, password, birthDate, fileName);

    if (!username || !email || !password || !birthDate) {
        return res.redirect(
            `/register${messageHandler.formatMessage(
                "Provided invalid data!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const validationResult = validation.validateUser({ ...req.body });
    if (validationResult.status === validation.VALIDATION_STATUSES.Error) {
        return res.redirect(
            `/register${messageHandler.formatMessage(
                validationResult.text,
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const userWithSameUniqueFields = await UserModel.findOne({
        $or: [{ username }, { email }],
    });

    if (userWithSameUniqueFields) {
        if (userWithSameUniqueFields.username === username) {
            return res.redirect(
                `/register${messageHandler.formatMessage(
                    "Username is unavailable!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }

        if (userWithSameUniqueFields.email === email) {
            return res.redirect(
                `/register${messageHandler.formatMessage(
                    "Email is unavailable!",
                    messageHandler.MESSAGE_STATUSES.Error
                )}`
            );
        }
    }

    const salt = security.generateSalt();
    const hashedPassword = security.hashPassword(password, salt);

    const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        salt,
        birthDate,
        profilePicture: `http://localhost:3000/public/images/${fileName}`,
    });
    await newUser.save();
    req.session.user = {
        ...newUser,
        loggedIn: true,
        // admin: newUser.username === "Gymmed",
    };

    return res.redirect(
        `/register${messageHandler.formatMessage(
            "Email is unavailable!",
            messageHandler.MESSAGE_STATUSES.Error
        )}`
    );
    // return res.status(200).json({ user: newUser });
});

router.post("/login", upload.none(), async (req, res) => {
    if (req.session.user) {
        return res.status(400).json({ message: "You are already logged in!" });
    }

    const { username, password } = req.body;

    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Not all required data is provided!" });

    const user = !username.includes("@")
        ? await UserModel.findOne({ username: username })
        : await UserModel.findOne({ email: username });

    if (
        !user ||
        !security.isValidCrediantials(password, user.salt, user.password)
    ) {
        return res.status(401).json({ message: "Invalid credentials!" });
    }

    req.session.user = {
        ...user,
        loggedIn: true,
        // admin: newUser.username === "Gymmed",
    };

    //res.status(200).json({ message: "Successfully logged in!" })
    return res.redirect(
        `/${messageHandler.formatMessage(
            "Successfully logged in!",
            messageHandler.MESSAGE_STATUSES.Success
        )}`
    );
});

router.get("/logout", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login first to logout!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    return req.session.destroy((error) => {
        if (error) return res.redirect("/");

        res.clearCookie("connect.sid");
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "Successfully logged out!",
                messageHandler.MESSAGE_STATUSES.Success
            )}`
        );
    });
});

router.get("/users", async (req, res) => {
    const users = await UserModel.find({ username: "gymmed" });

    return res.status(200).json({ users });
});

router.post("/change-password", async (req, res) => {
    if (!req.session.user) {
        return res.redirect(
            `/login${messageHandler.formatMessage(
                "You need to login first to change account password!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const { newPassword, currentPassword } = req.body;

    if (newPassword === currentPassword)
        return res.redirect(
            `/change-password${messageHandler.formatMessage(
                "You provided current and new passwords with the same value! In order to change current password they cannot match!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );

    const user = await UserModel.findOne({
        username: req.session.user._doc.username,
    });

    if (!user) {
        console.error(
            "change-password route have session of user but cannot retrieve user in db!"
        );
        return res.redirect(
            `/${messageHandler.formatMessage(
                "It seems we encountered an unusual error and are working on it!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const passwordValidation = validation.validatePassword(newPassword);

    if (passwordValidation.status === validation.VALIDATION_STATUSES.Error) {
        return res.redirect(
            `/change-password${messageHandler.formatMessage(
                passwordValidation.text,
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    if (
        !security.isValidCrediantials(currentPassword, user.salt, user.password)
    ) {
        return res.redirect(
            `/change-password${messageHandler.formatMessage(
                "Provided invalid current password!",
                messageHandler.MESSAGE_STATUSES.Error
            )}`
        );
    }

    const salt = security.generateSalt();
    const hashedPassword = security.hashPassword(newPassword, salt);

    user.salt = salt;
    user.password = hashedPassword;

    await user.save();
    req.session.user = {
        ...user,
        loggedIn: true,
    };

    return res.redirect(
        `/change-password${messageHandler.formatMessage(
            "Successfully changed password!",
            messageHandler.MESSAGE_STATUSES.Success
        )}`
    );
});

module.exports = router;
