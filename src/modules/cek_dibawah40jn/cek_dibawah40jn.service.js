import cekDibawah40jnModel from "./cek_dibawah40jn.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekDibawah40jn = async ({
  thblrek,
  idpel,
  unitupi,
  limit,
}) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  return cekDibawah40jnModel.getCekDibawah40jn({
    thblrek,
    idpel,
    unitupi,
  });
};

export default { getCekDibawah40jn };
