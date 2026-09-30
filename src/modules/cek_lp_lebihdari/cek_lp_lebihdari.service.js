import getLpLebihDariModel from "./cek_lp_lebihdari.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getLpLebihDari = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getLpLebihDariModel.getLpLebihDari({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getLpLebihDari };
