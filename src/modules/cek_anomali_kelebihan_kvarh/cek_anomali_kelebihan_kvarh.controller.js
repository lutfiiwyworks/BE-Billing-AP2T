import cekAnomaliKelebihanKvarhService from "./cek_anomali_kelebihan_kvarh.service.js";

const getCekAnomaliKelebihanKvarh = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, limit } = req.query;

    const data =
      await cekAnomaliKelebihanKvarhService.getCekAnomaliKelebihanKvarh({
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
    console.error("Controller Error getCekAnomaliKelebihanKvarh:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekAnomaliKelebihanKvarh };
