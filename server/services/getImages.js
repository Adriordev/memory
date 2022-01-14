const axios = require("axios");
const getImages = async (couplesCount) => {
  const response = await axios.get(
    `https://picsum.photos/v2/list?limit=${couplesCount}`
  );
  const images = response.data.map((img) => img.download_url);
  return images;
};
module.exports = { getImages };
