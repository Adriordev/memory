import axios from "axios";

export const helloWorld = async (sayHello) => {
  const response = await axios.get(`http://localhost:3000/`);
  sayHello.value = response.data;
};
