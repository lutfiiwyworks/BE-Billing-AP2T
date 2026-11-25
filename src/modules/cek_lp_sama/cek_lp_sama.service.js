import getCekLpSamaModel from "./cek_lp_sama.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekLpSama = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekLpSamaModel.getCekLpSama({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekLpSama };
