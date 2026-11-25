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
  const totalIdpel = data.reduce(
    (total, item) => total + Number(item.IDPEL ?? item.idpel ?? 0),
    0
  );
  return res.status(400).json({
    success: false,
    message: `Gagal - Ditemukan ${totalIdpel} IDPEL yang belum Closing Billing`,
    total: data.length,
    data,
  });
}

    // Jika query berhasil tetapi tidak ada data
    return res.status(200).json({
      success: true,
      message: "Sukses - Semua unit telah Closing Billing",
      total: 0,
      data: [],
    });

  } catch (error) {
    console.error("Controller Error getValidasiClosingBilling:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Gagal - 500",
      error: error.message,
    });
  }
};

export default { getValidasiClosingBilling };