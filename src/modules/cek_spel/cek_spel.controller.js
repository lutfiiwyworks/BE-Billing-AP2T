import cekPlgSpelService from "./cek_spel.service.js";

const createGetCekPlgSpel = (excludeRptl53950) => async (req, res) => {
  try {
    const { thblrek } = req.query;

    const data = await cekPlgSpelService.getCekPlgSpel({
      thblrek,
      excludeRptl53950,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekPlgSpel", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getCekPlgSpel: createGetCekPlgSpel(false),
  getCekPlgSpelTanpaRptl53950: createGetCekPlgSpel(true),
};
