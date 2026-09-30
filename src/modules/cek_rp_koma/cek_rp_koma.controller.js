import getCekKomaService from "./cek_rp_koma.service.js";

const getCekKoma = async (req, res) => {
  try {
    const { thblrek, idpel, limit } = req.query;

    const data = await getCekKomaService.getCekKoma({
      thblrek,
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
    console.error("Controller Error getCekRpbeban:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekKoma };
