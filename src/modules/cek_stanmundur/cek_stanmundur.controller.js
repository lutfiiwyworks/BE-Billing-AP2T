import getCekStanmundurService from "./cek_stanmundur.service.js";

const getCekStanmundur = async (req, res) => {
  try {
    const { thblrek, idpel, limit } = req.query;

    const data = await getCekStanmundurService.getCekStanmundur({
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
    console.error("Controller Error getCekStanmundur:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekStanmundur };
