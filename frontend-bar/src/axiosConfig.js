// src/axiosConfig.js
import axios from "axios";

const instanciaAxios = axios.create({
  baseURL: "http://localhost:5000", // Cambia si tu backend corre en otro puerto
});

export default instanciaAxios;
