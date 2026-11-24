import getValidasiClosingBillingService from "./validasi_closing_billing.service.js";

const getValidasiClosingBilling = async (req, res) => {
  try {
    const { thblrek, limit } = req.query;

    const data = await getValidasiClosingBillingService.getValidasiClosingBilling({
      thblrek,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "SUKSES",
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("Controller Error getGetClosingBilling:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default { getValidasiClosingBilling };
