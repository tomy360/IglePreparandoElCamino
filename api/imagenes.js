import fs from "fs";
import path from "path";

const carpetas = {
    emergente: "Charlas/Emergente",
    igle: "Charlas/igle"
};

export default function handler(req, res) {
    const nombre = req.query.carpeta;
    const base = carpetas[nombre];

    if (!base) {
        return res.status(400).json({ error: "Carpeta no válida" });
    }

    const carpeta = path.join(process.cwd(), base);

    let archivos;
    try {
        archivos = fs.readdirSync(carpeta)
            .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
            .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
    } catch {
        return res.status(200).json([]);
    }

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(archivos.map(f => `${base}/${f}`));
}