import getEmulsionService from "./cek_emulsion.service.js";

const getEmulsion = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi, limit } = req.query;

    const data = await getEmulsionService.getEmulsion({
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
    console.error("Controller Error getEmulsion:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getEmulsion };
