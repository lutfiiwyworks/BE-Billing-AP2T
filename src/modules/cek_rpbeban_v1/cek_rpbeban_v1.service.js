import cekRpbebanV1Model from "./cek_rpbeban_v1.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekRpbebanV1 = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await cekRpbebanV1Model.getCekRpbebanV1({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekRpbebanV1 };
