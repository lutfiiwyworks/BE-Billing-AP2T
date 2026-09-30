import vwbilling720jnService from "./vwbilling_720jn.service.js";

const getVwbilling720jn = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, kondisi, limit } = req.query;

    const data = await vwbilling720jnService.getVwbilling720jn({
      thblrek,
      unitupi,
      idpel,
      kondisi,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getVwbilling720jn:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getVwbilling720jn };
