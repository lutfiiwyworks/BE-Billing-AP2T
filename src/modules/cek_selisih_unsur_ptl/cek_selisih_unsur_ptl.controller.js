import cekSelisihUnsurPtlService from "./cek_selisih_unsur_ptl.service.js";

const getCekSelisihUnsurPtl = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, limit } = req.query;

    const data = await cekSelisihUnsurPtlService.getCekSelisihUnsurPtl({
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
    console.error("Controller Error getCekSelisihUnsurPtl:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekSelisihUnsurPtl };
