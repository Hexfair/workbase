import path from "path";
import express from "express";
//=========================================================================================================================

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(5000, () => {
	console.log("server started on port 5000");
});