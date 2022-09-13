const express = require("express");
const path = require("path");
const { useRouter } = require("kz-router");

const app = express();
const router = useRouter({ dir: path.join(__dirname, "web") });
app.use(router);

app.listen(3000, () => console.log("Server started on port 3000"));
