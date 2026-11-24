import getValidasiClosingBillingService from "./validasi_closing_billing.service.js";

const getValidasiClosingBilling = async (req, res) => {
  try {
    const { thblrek, limit } = req.query;

    const data =
      await getValidasiClosingBillingService.getValidasiClosingBilling({
        thblrek,
        limit,
      });

    // Jika ditemukan data, dianggap gagal
    if (data.length > 0) {
      return res.status(400).json({
        success: false,
        message: "GAGAL - DITEMUKAN DATA VALIDASI CLOSING BILLING",
        total: data.length,
        data,
      });
    }

    // Jika query berhasil tetapi tidak ada data
    return res.status(200).json({
      success: true,
      message: "SUKSES - TIDAK DITEMUKAN DATA VALIDASI CLOSING BILLING",
      total: 0,
      data: [],
    });

  } catch (error) {
    console.error("Controller Error getValidasiClosingBilling:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: "GAGAL - QUERY VALIDASI CLOSING BILLING ERROR",
      error: error.message,
    });
  }
};

export default { getValidasiClosingBilling };