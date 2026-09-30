import getCekStanNoMutModel from "./cek_stanmundur_a.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekStanNoMut = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekStanNoMutModel.getCekStanNoMut({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekStanNoMut };
