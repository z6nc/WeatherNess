require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.get("/weather/:city", async (req, res) => {
    const { city } = req.params; // Obtiene la ciudad desde la URL
    const key = process.env.API_KEY;
   
    try {
        const response = await axios.get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${key}&contentType=json`, 
          
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});