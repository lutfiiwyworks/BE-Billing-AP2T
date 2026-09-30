import vwbilling720jnModel from "./vwbilling_720jn.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const normalizeKondisi = (kondisi) => {
  const finalKondisi = String(kondisi || "ALL").trim().toUpperCase();

  if (["BR", "JAMNYALA_BR"].includes(finalKondisi)) {
    return "BR";
  }

  if (["LM", "JAMNYALA_LM"].includes(finalKondisi)) {
    return "LM";
  }

  if (["ALL", "SEMUA"].includes(finalKondisi)) {
    return "ALL";
  }

  throw createBadRequest("Parameter kondisi harus BR, LM, atau ALL");
};

const getVwbilling720jn = async ({ thblrek, unitupi, idpel, kondisi, limit }) => {
  const finalThblrek = String(thblrek || "").trim();
  const finalKondisi = normalizeKondisi(kondisi);

  if (!finalThblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  if (!/^\d{6}$/.test(finalThblrek)) {
    throw createBadRequest("Parameter thblrek harus format YYYYMM, contoh: 202605");
  }

  return vwbilling720jnModel.getVwbilling720jn({
    thblrek: finalThblrek,
    unitupi,
    idpel,
    kondisi: finalKondisi,
  });
};

export default { getVwbilling720jn };
