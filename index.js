const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require('cors');

const port = process.env.PORT || 3030;

app.use(cors());
app.options('*', cors());

app.use("/", routes);

app.listen(port, () => console.log(`Server started at PORT - ${port}`));
