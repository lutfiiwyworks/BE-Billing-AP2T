import getGetClosingBillingModel from "./get_closing_billing.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getGetClosingBilling = async ({ thblrek, limit }) => {
  if (!thblrek) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek"
    );
  }

  const rows = await getGetClosingBillingModel.getGetClosingBilling({
    thblrek,
  });

  return rows;
};

export default { getGetClosingBilling };
