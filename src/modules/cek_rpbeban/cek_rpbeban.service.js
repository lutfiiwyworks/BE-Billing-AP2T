import cekRpbebanModel from "./cek_rpbeban.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekRpbeban = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await cekRpbebanModel.getCekRpbeban({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekRpbeban };
