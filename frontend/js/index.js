
function obtenerCiudadDesdeURL() {
    const params = new URLSearchParams(window.location.search);
     const ciudad =  params.get("ciudad");
     if(ciudad === null){
         window.location.href = "index.html"
     }
     return ciudad;
    
}

async function obtenerDatos(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error en la petición de datos");
        }
        
        const data = await response.json();

        const {
            resolvedAddress: ciudad,
            timezone: zonaHoraria,
            currentConditions: { 
                temp: temperaturaActual, 
                humidity: humedad, 
                conditions: condicionCielo, 
                uvindex: indiceUV 
            },
            days: [{ 
                tempmax: temperaturaMaxima, 
                tempmin: temperaturaMinima, 
                precipprob: probabilidadLluvia, 
                description: descripcionClima ,
                preciptype: precipitacion,
                snow : nieve,
                solarenergy: energiaSolar
            }]
        } = data;

        return { 
            ciudad, 
            zonaHoraria, 
            temperaturaActual, 
            humedad, 
            condicionCielo, 
            indiceUV, 
            temperaturaMaxima, 
            temperaturaMinima, 
            probabilidadLluvia, 
            descripcionClima ,
            precipitacion,
            nieve,
            energiaSolar
        };

    } catch (error) {
        console.error("No se encontraron los datos:", error);
        return null; // Retorna null en caso de error para evitar fallos en el resto del código
    }
}

async function buscarCiudad(){
    try{
        const ciudad = obtenerCiudadDesdeURL();
        const urlApi = `http://localhost:3000/weather/${ciudad}`
        const datos = await obtenerDatos(urlApi);
        console.log(datos);
        return datos;
    } catch (error) {
        console.error("No se encontraron los datos:", error);
        return null; // Retorna null en caso de error para evitar fallos en el resto del código
    }
}

function convertidorCelcius(number){
    return Math.floor((number - 32) * 5/9); // Fórmula para convertir de Fahrenheit a Celcius
}

function obtenerImagenClima(temperatura) {
    if (temperatura >= 30) {
      // Clima soleado
      return "/frontend/utils/summer.webp"; 
    } else if (temperatura >=  15 && temperatura < 25) {
      // Clima nublado
      return "/frontend/utils/Climanublado.webp"; 
    } else {
      // Clima lluvioso
      return "/frontend/utils/Climalluvioso.webp"; 
    }
  }

async function AsignacionValores(event) {
    event.preventDefault();
    
    // Esperar la respuesta de la API
    const data = await buscarCiudad(); 
    if (!data) {
        // esto es para detectar si no se encontraron datos
        console.error("No se encontraron datos.");
        return;
    }
   
    
    // Obtener elementos del DOM
    const imagenBackground  = document.querySelector(".city");
    const ciudad = document.getElementById("nombreCiudad");
    const Probabilidad = document.getElementById("Probabilidad");
    const TemperaturaActual = document.getElementById("actual");
    const description = document.getElementById("descripcion");
    const TemperaturaMaxima = document.getElementById("maxima");
    const TemperaturaMinima = document.getElementById("minina");
    const indiceUV = document.getElementById("indiceUV");
    const humedad = document.getElementById("humedad");
    const precipitacion = document.getElementById("preciptype");
    const nieve = document.getElementById("snow");
    const energiaSolar = document.getElementById("solarEnergy");
    
    // convertidores de temperatura
    let imagenClima = obtenerImagenClima(data.temperaturaActual);
  

    // Asignar valores a los elementos
    imagenBackground.style.backgroundImage = `url("${imagenClima}")`;
    ciudad.textContent = data.ciudad;
    Probabilidad.textContent = data.probabilidadLluvia + "%";
    TemperaturaActual.textContent = data.temperaturaActual + "°C";
    description.textContent = data.descripcionClima;
    TemperaturaMaxima.textContent = data.temperaturaMaxima + "°C"; 
    TemperaturaMinima.textContent = data.temperaturaMinima + "°C";
    indiceUV.textContent = data.indiceUV;
    humedad.textContent = data.humedad + "%";
    precipitacion.textContent = data.precipitacion;
    nieve.textContent = data.nieve;
    energiaSolar.textContent = data.energiaSolar;
}



// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    AsignacionValores(new Event("load")); // Simulamos un evento para evitar errores
});

