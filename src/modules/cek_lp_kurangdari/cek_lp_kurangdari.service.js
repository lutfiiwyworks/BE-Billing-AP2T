import getLpKurangDariModel from "./cek_lp_kurangdari.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getLpKurangDari = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getLpKurangDariModel.getLpKurangDari({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getLpKurangDari };
