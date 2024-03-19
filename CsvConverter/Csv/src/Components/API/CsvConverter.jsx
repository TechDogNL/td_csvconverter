import axios from "axios";

const converter = axios.create({
    baseURL: 'https://csv-converter.techdogcloud.com/api/',
});

export default converter