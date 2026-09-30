import cekPpnViewService from "./cek_ppn_view.service.js";

const createGetCekPpnView = (key) => async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, limit } = req.query;

    const data = await cekPpnViewService.getCekPpnView({
      key,
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
    console.error(`Controller Error getCekPpnView ${key}:`, error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getCekPpnSewatrafo: createGetCekPpnView("sewatrafo"),
  getCekPpnBptrafo: createGetCekPpnView("bptrafo"),
  getCekPpnSewakap: createGetCekPpnView("sewakap"),
};
