const express = require("express");
const app = express();

require("./config/db-connect").config();
require("./config/express-middlewares").config(app);

app.listen(3000, () => {
    console.log("Server started on 3000 port!");
});
