import getEmulsionModel from "./cek_emulsion.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const normalizeThblrek = (thblrek) => {
  if (!thblrek) {
    return thblrek;
  }

  const thblrekList = String(thblrek)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!thblrekList.length) {
    return "";
  }

  const invalidThblrek = thblrekList.find((item) => !/^\d{6}$/.test(item));
  if (invalidThblrek) {
    throw createBadRequest(
      "Parameter thblrek harus format YYYYMM atau comma-separated, contoh: 202607,202608"
    );
  }

  return [...new Set(thblrekList)];
};

const getEmulsion = async ({
  thblrek,
  idpel,
  unitupi,
  limit,
}) => {
  const finalThblrek = normalizeThblrek(thblrek);

  if (!finalThblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  return getEmulsionModel.getEmulsion({
    thblrek: finalThblrek,
    idpel,
    unitupi,
  });
};

export default { getEmulsion };
