import getCekAnomaliBillingKoreksiService from "./cek_anomali_koreksi.service.js";

const getCekAnomaliBillingKoreksi = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, limit } = req.query;

    const data = await getCekAnomaliBillingKoreksiService.getCekAnomaliBillingKoreksi({
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
    console.error("Controller Error getCekAnomaliBillingKoreksi:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekAnomaliBillingKoreksi };
