import axios from "axios";

export const downloadInvoice = async (order, type = "normal") => {
  const response = await axios.post("http://localhost:3000/invoice/download", {
    order,
    type,
  });
  return response.data.filePath; // URL to download
};
