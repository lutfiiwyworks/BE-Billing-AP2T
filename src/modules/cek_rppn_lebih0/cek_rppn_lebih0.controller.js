import getCekRppnLebih0Service from "./cek_rppn_lebih0.service.js";

const getCekRppnLebih0 = async (req, res) => {
  try {
    const { thblrek, idpel, limit } = req.query;

    const data = await getCekRppnLebih0Service.getCekRppnLebih0({
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

export default { getCekRppnLebih0 };
