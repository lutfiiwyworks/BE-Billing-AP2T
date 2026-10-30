import getCekRpBKModel from "./cek_rpbk.models.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekRpBK = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekRpBKModel.getCekRpBK({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekRpBK };
