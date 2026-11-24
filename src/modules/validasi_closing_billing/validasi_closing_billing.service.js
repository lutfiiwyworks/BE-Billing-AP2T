import getValidasiClosingBillingModel from "./validasi_closing_billing.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getValidasiClosingBilling = async ({ thblrek, limit }) => {
  if (!thblrek) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek"
    );
  }

  const rows = await getValidasiClosingBillingModel.getValidasiClosingBilling({
    thblrek,
  });

  return rows;
};

export default { getValidasiClosingBilling };
