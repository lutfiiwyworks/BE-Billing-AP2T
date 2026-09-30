import getPemkwh0Model from "./cek_pemkwh0.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getPemkwh0 = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getPemkwh0Model.getPemkwh0({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getPemkwh0 };
