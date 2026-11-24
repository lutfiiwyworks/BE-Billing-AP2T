import getGetClosingBillingService from "./get_closing_billing.service.js";

const getGetClosingBilling = async (req, res) => {
  try {
    const { thblrek, limit } = req.query;

    const data = await getGetClosingBillingService.getGetClosingBilling({
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

export default { getGetClosingBilling };
