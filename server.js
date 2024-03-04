import path from "path";
import express from "express";
import fs from 'fs';
//=========================================================================================================================

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));
app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get('/json', (req, res) => {
	res.header("Content-Type", 'application/json');
	res.sendFile(path.join(__dirname, 'areas.json'));
});

app.post('/', (req, res) => {
	const areas = JSON.parse(fs.readFileSync('./areas.json', 'utf8'));
	areas.push({ ...req.body, id: areas.length + 1 });
	fs.writeFile('./areas.json', JSON.stringify(areas), (err) => {
		if (err) {
			return res.status(400).json({ message: 'Ошибка при добавлении данных' });
		}
		return res.status(200).json({ message: 'Данные успешно добавлены!' });
	});
});

app.listen(5050, () => {
	console.log("server started on port 5050");
});