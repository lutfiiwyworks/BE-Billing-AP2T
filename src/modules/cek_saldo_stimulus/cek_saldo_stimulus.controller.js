import cekSaldoStimulusService from "./cek_saldo_stimulus.service.js";

const getCekSaldoStimulus = async (req, res) => {
  try {
    const { thblrek, idpel } = req.query;

    const data = await cekSaldoStimulusService.getCekSaldoStimulus({
      thblrek,
      idpel,
    });

    return res.status(200).json({
      success: true,
      message: "Data sudah sesuai tidak ada anomali",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getCekSaldoStimulus:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getCekSaldoStimulus };
