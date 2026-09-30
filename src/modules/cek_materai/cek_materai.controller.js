import cekMateraiService from "./cek_materai.service.js";

const getCekMaterai = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, rule, limit } = req.query;

    const data = await cekMateraiService.getCekMaterai({
      thblrek,
      idpel,
      unitupi,
      rule,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekMaterai:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekMaterai };
