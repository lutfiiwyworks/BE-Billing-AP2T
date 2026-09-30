import cekRptag0Service from "./cek_rptag_0.service.js";

const getCekRptag0 = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, limit } = req.query;

    const data = await cekRptag0Service.getCekRptag0({
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
    console.error("Controller Error getCekRptag0:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekRptag0 };
