import cekPpjService from "./cek_ppj.service.js";

const createGetCekPpj = (onlyDifferent) => async (req, res) => {
  try {
    const { thblrek } = req.query;

    const data = await cekPpjService.getCekPpj({
      thblrek,
      onlyDifferent,
    });

    return res.status(200).json({
      success: true,
      message: "Data cek PPJ berhasil diambil",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekPpj:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getCekPpj: createGetCekPpj(false),
  getCekPpjBedaProsen: createGetCekPpj(true),
};
