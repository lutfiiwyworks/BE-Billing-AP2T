import cekPksTrflwbp2000Service from "./cek_pks_trflwbp_2000.service.js";

const getCekPksTrflwbp2000 = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, limit } = req.query;

    const data = await cekPksTrflwbp2000Service.getCekPksTrflwbp2000({
      thblrek,
      unitupi,
      idpel,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekPksTrflwbp2000:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getCekPksTrflwbpLebih2000 = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel } = req.query;

    const data = await cekPksTrflwbp2000Service.getCekPksTrflwbpLebih2000({
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
    console.error("Controller Error getCekPksTrflwbpLebih2000:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekPksTrflwbp2000, getCekPksTrflwbpLebih2000 };
