import getCekSaldoPascaService from "./cek_saldo_pasca.service.js";

const getCekSaldoPasca = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, limit } = req.query;

    const data = await getCekSaldoPascaService.getCekSaldoPasca({
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
    console.error("Controller Error getCekRpbeban:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekSaldoPasca };
