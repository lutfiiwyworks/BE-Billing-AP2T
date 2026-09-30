import cekAnomaliJnLwbpService from "./cek_anomali_jn_lwbp.service.js";

const getCekAnomaliJnLwbp = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel } = req.query;

    const data = await cekAnomaliJnLwbpService.getCekAnomaliJnLwbp({
      thblrek,
      unitupi,
      idpel,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekAnomaliJnLwbp:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekAnomaliJnLwbp };
