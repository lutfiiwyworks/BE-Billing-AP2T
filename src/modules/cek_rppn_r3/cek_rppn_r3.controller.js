import cekRppnR3Service from "./cek_rppn_r3.service.js";

const getCekRppnR3 = async (req, res) => {
  try {
    const { thblrek, idpel, limit } = req.query;

    const data = await cekRppnR3Service.getCekRppnR3({
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
    console.error("Controller Error getCekRppnR3:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekRppnR3 };
