import getCekPecahTdlService from "./cek_pecah_tdl.service.js";

const getCekPecahTdl = async (req, res) => {
  try {
    const { thblrek, idpel, unitupi } = req.query;

    const data = await getCekPecahTdlService.getCekPecahTdl({
      thblrek,
      idpel,
      unitupi,
    });

    return res.status(200).json({
      success: true,
      message: "Data cek pecah TDL berhasil diambil",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekPecahTdl:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekPecahTdl };
