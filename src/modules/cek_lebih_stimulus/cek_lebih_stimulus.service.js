import getCekReduksiStimulusModel from "./cek_lebih_stimulus.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekReduksiStimulus = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekReduksiStimulusModel.getCekReduksiStimulus({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekReduksiStimulus };
