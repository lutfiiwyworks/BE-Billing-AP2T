import cekRpbebanV1Service from "./cek_rpbeban_v1.service.js";

const getCekRpbebanV1 = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, limit } = req.query;

    const data = await cekRpbebanV1Service.getCekRpbebanV1({
      thblrek,
      idpel,
      unitupi,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekRpbebanV1:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekRpbebanV1 };
