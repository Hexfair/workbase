import path from "path";
import express from "express";
import cors from 'cors';
import fs from 'fs';
//=========================================================================================================================

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const icaoPoints = JSON.parse(fs.readFileSync(path.join(__dirname, 'dist', 'data', 'icao.json')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get('/json', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, 'areas.json'));
});

app.get('/fir', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, 'dist', 'data', 'fir.json'));
});

app.get('/bases', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, 'dist', 'data', 'bases.json'));
});

app.get('/missiles', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, 'dist', 'data', 'missiles.json'));
});

app.post('/icao', (req, res) => {
    const point = icaoPoints.find(obj => obj.ident === req.body.icao);
    res.header("Content-Type", 'application/json');
    if (point) {
        return res.status(200).json({ point });
    } else {
        return res.status(200).json({ point: null });
    }
});

app.post('/', (req, res) => {
    const areas = JSON.parse(fs.readFileSync('./areas.json', 'utf8'));
    const lastObj = areas.length > 0 ? areas[areas.length - 1] : null;
    const data = req.body.data;
    const isNew = req.body.isNew;
    const updateId = req.body.updateId;

    if (isNew) {
        areas.push({ ...data, id: lastObj ? lastObj.id + 1 : 1 });
        fs.writeFile('./areas.json', JSON.stringify(areas), (err) => {
            if (err) return res.status(400).json({ message: 'Ошибка при добавлении данных' });
            return res.status(200).json({ message: 'Данные успешно добавлены!' });
        });
    } else {
        const updateAreas = areas.map(obj => {
            if (obj.id === updateId) {
                return {
                    "name": data.name,
                    "country": data.country,
                    "rocket": data.rocket,
                    "area": data.area,
                    "id": updateId
                }
            }
            return obj;
        })

        fs.writeFile('./areas.json', JSON.stringify(updateAreas), (err) => {
            if (err) return res.status(400).json({ message: 'Ошибка при обновлении данных' });
            return res.status(200).json({ message: 'Данные успешно обновлены!' });
        });
    }
});

app.delete('/', (req, res) => {
    const areas = JSON.parse(fs.readFileSync('./areas.json', 'utf8'));
    const newAreas = areas.filter(obj => obj.id !== req.body.id);
    fs.writeFile('./areas.json', JSON.stringify(newAreas), (err) => {
        if (err) return res.status(400).json({ message: 'Ошибка при удалении данных' });
        return res.status(200).json({ message: 'Данные успешно удалены!' });
    });
});

app.listen(8000, () => {
    console.log("server started on port 5050");
});