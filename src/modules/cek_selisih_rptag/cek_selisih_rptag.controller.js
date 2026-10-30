import getCekSelisihRpTagService from "./cek_selisih_rptag.service.js";

const getCekSelisihRpTag = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, limit } = req.query;

    const data = await getCekSelisihRpTagService.getCekSelisihRpTag({
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
    console.error("Controller Error getCekSelisihRpTag:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekSelisihRpTag };
