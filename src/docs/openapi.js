const jsonResponse = {
  description: "Response JSON standar",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          message: { type: "string" },
          total: { type: "integer" },
          data: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      },
    },
  },
};

const errorResponse = {
  description: "Error response",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
    },
  },
};

const param = (name, description, required = false, example = undefined) => ({
  name,
  in: "query",
  required,
  description,
  schema: {
    type: "string",
    ...(example ? { example } : {}),
  },
});

const thblrekParam = param("thblrek", "Periode rekening format YYYYMM.", true, "202606");
const optionalThblrekParam = param(
  "thblrek",
  "Periode rekening format YYYYMM. Beberapa API lama menerima nilai kosong.",
  false,
  "202606"
);
const unitupiParam = param("unitupi", "Kode unit induk/unitupi.", false, "53");
const idpelParam = param("idpel", "ID pelanggan.", false, "123456789012");
const limitParam = param("limit", "Jumlah maksimal data per halaman. Default 100, maksimal 1000.", false, "100");
const pageParam = param("page", "Nomor halaman untuk pagination. Default 1.", false, "1");
const sortFieldParam = param("sortField", "Field sorting sesuai whitelist backend, contoh THBLREK, UNITUPI, IDPEL, NAMA.", false, "IDPEL");
const sortOrderParam = param("sortOrder", "Urutan sorting ASC atau DESC.", false, "ASC");
const searchParam = param("search", "Keyword pencarian. Filtering dilakukan di Oracle.", false, "ABC");

const sourceText = (sources, queryNote) => {
  const sourceLines = sources
    .map((source) => `- ${source.db}: \`${source.name}\``)
    .join("\n");

  return [`Source query:`, sourceLines, "", `Filter/query:`, queryNote].join("\n");
};

const getOperation = ({
  tag,
  summary,
  sources,
  queryNote,
  parameters = [thblrekParam, unitupiParam, idpelParam],
  security = true,
}) => ({
  get: {
    tags: [tag],
    summary,
    description: sourceText(sources, queryNote),
    ...(security ? { security: [{ bearerAuth: [] }] } : {}),
    parameters,
    responses: {
      200: jsonResponse,
      400: errorResponse,
      401: errorResponse,
      500: errorResponse,
    },
    "x-query-sources": sources,
    "x-query-note": queryNote,
  },
});

const standardEndpoints = [
  {
    path: "/api/cek-rpbeban",
    tag: "Cek Billing",
    summary: "Cek RP Beban",
    sources: [
      { db: "Oracle", name: "DTKS.VW_CEK_RPBEBAN" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_rpbeban" },
    ],
  },
  {
    path: "/api/cek-dibawah40jn",
    tag: "Cek Billing",
    summary: "Cek di bawah 40 jam nyala",
    sources: [
      { db: "Oracle", name: "DTKS.VW_CEK_DIBAWAH40JN" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_dibawah40jn" },
    ],
  },
  {
    path: "/api/cek-rptag-0",
    tag: "Cek Billing",
    summary: "Cek RP Tag 0",
    sources: [
      { db: "Oracle", name: "DTKS.VW_CEK_RPTAG_0" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_rptag_0" },
    ],
  },
  {
    path: "/api/cek-selisih-unsur-ptl",
    tag: "Cek Billing",
    summary: "Cek selisih unsur PTL",
    sources: [
      { db: "Oracle", name: "DTKS.VW_CEK_SELISIH_UNSUR_PTL" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_selisih_unsur_ptl" },
    ],
  },
  {
    path: "/api/cek-anomali-kelebihan-kvarh",
    tag: "Cek Billing",
    summary: "Cek anomali kelebihan kVARh",
    sources: [
      { db: "Oracle", name: "DTKS.CEK_ANOMALI_KELEBIHAN_KVARH" },
      { db: "PostgreSQL", name: "kunabakti.cek_anomali_kelebihan_kvarh" },
    ],
  },
  {
    path: "/api/vwbilling-720jn",
    tag: "Cek Billing",
    summary: "Cek billing 720 jam nyala",
    queryNote:
      "Filter `thblrek`; optional `unitupi`, `idpel`. Parameter dropdown `kondisi`: `BR` menambah filter `JAMNYALA_BR > '720'`, `LM` menambah filter `JAMNYALA_LM > '720'`, `ALL` hanya filter `thblrek`.",
    parameters: [
      thblrekParam,
      unitupiParam,
      idpelParam,
      {
        name: "kondisi",
        in: "query",
        required: false,
        description: "Pilihan dropdown kondisi jam nyala.",
        schema: {
          type: "string",
          enum: ["BR", "LM", "ALL"],
          default: "ALL",
        },
      },
    ],
    sources: [
      { db: "Oracle", name: "DTKS.VWBILLING_720JN" },
      { db: "PostgreSQL", name: "kunabakti.vwbilling_720jn" },
    ],
  },
  {
    path: "/api/cek-spel",
    tag: "Cek Billing",
    summary: "Cek pelanggan SPEL",
    queryNote:
      "Oracle: `THBLREK = :thblrek`. PostgreSQL: `thblrek = $1`.",
    parameters: [thblrekParam],
    sources: [
      { db: "Oracle", name: "DTKS.cek_pelanggan_spel" },
      { db: "PostgreSQL", name: "kunabakti.cek_pelanggan_spel" },
    ],
  },
  {
    path: "/api/cek-spel/tanpa-rptl-53950",
    tag: "Cek Billing",
    summary: "Cek pelanggan SPEL tanpa RPTL 53950",
    queryNote:
      "Oracle: `THBLREK = :thblrek AND RPTL <> '53950'`. PostgreSQL: `thblrek = $1 AND rptl <> '53950'`.",
    parameters: [thblrekParam],
    sources: [
      { db: "Oracle", name: "DTKS.cek_pelanggan_spel" },
      { db: "PostgreSQL", name: "kunabakti.cek_pelanggan_spel" },
    ],
  },
  {
    path: "/api/cek-stimulus",
    tag: "Cek Billing",
    summary: "Cek selisih unsur stimulus",
    sources: [
      { db: "Oracle", name: "dtks.cek_selisih_unsur_stimulus" },
      { db: "PostgreSQL", name: "kunabakti.cek_selisih_unsur_stimulus" },
    ],
  },
  {
    path: "/api/cek-pks-trflwbp-2000",
    tag: "Cek Billing",
    summary: "Cek PKS TRFLWBP periode",
    queryNote:
      "Oracle: `:thblrek BETWEEN THBL_AWAL AND THBL_AKHIR`, optional `UNITUPI`, `IDPEL`. PostgreSQL: `$1 BETWEEN thbl_awal AND thbl_akhir`, optional `unitupi`, `idpel`.",
    sources: [
      { db: "Oracle", name: "DTKS.VW_PKS_TRFLWBP_2000" },
      { db: "PostgreSQL", name: "kunabakti.vw_pks_trflwbp_2000" },
    ],
  },
  {
    path: "/api/cek-pks-trflwbp-2000/trflwbp-lebih-2000",
    tag: "Cek Billing",
    summary: "Cek PKS TRFLWBP lebih dari 2000",
    queryNote:
      "Oracle: `:thblrek BETWEEN THBL_AWAL AND THBL_AKHIR AND TRFLWBP > 2000`, optional `UNITUPI`, `IDPEL`. PostgreSQL: `$1 BETWEEN thbl_awal AND thbl_akhir AND trflwbp > 2000`, optional `unitupi`, `idpel`.",
    sources: [
      { db: "Oracle", name: "DTKS.VW_PKS_TRFLWBP_2000" },
      { db: "PostgreSQL", name: "kunabakti.vw_pks_trflwbp_2000" },
    ],
  },
  {
    path: "/api/cek-reduksi-rp0",
    tag: "Cek Billing",
    summary: "Cek reduksi lebih bayar saldo 0",
    sources: [
      { db: "Oracle", name: "dtks.vw_reduksi_lebihbayar_saldo0" },
      { db: "PostgreSQL", name: "kunabakti.vw_reduksi_lebihbayar_saldo0" },
    ],
  },
  {
    path: "/api/cek-reduksi-stimulus",
    tag: "Cek Billing",
    summary: "Cek reduksi lebih bayar stimulus",
    sources: [
      { db: "Oracle", name: "dtks.vw_reduksi_lebihbayar_stimulus" },
      { db: "PostgreSQL", name: "kunabakti.vw_reduksi_lebihbayar_stimulus" },
    ],
  },
  {
    path: "/api/cek-saldo-pasca",
    tag: "Cek Billing",
    summary: "Cek saldo pasca",
    sources: [
      { db: "Oracle", name: "dtks.vw_cek_saldo_pasca" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_saldo_pasca" },
    ],
  },
  {
    path: "/api/cek-plgc-kvarh",
    tag: "Cek Billing",
    summary: "Cek pelanggan C kVARh",
    sources: [
      { db: "Oracle", name: "dtks.cek_plg_c_kvarh" },
      { db: "PostgreSQL", name: "kunabakti.cek_plg_c_kvarh" },
    ],
  },
  {
    path: "/api/cek-anomali-stan",
    tag: "Cek Billing",
    summary: "Cek anomali stand",
    sources: [
      { db: "Oracle", name: "dtks.cek_anomali_stan" },
      { db: "PostgreSQL", name: "kunabakti.cek_anomali_stan" },
    ],
  },
  {
    path: "/api/cek-rp-koma",
    tag: "Cek Billing",
    summary: "Cek rupiah koma",
    sources: [
      { db: "Oracle", name: "dtks.cek_rupiah_koma" },
      { db: "PostgreSQL", name: "kunabakti.cek_rupiah_koma" },
    ],
  },
  {
    path: "/api/cek-stan-nomut",
    tag: "Cek Billing",
    summary: "Cek stand mundur tidak mutasi",
    sources: [
      { db: "Oracle", name: "dtks.stan_mundur_tidak_mutasi" },
      { db: "PostgreSQL", name: "kunabakti.stan_mundur_tidak_mutasi" },
    ],
  },
  {
    path: "/api/cek-plg-bts-mut",
    tag: "Cek Billing",
    summary: "Cek pelanggan BTS mutasi",
    sources: [
      { db: "Oracle", name: "dtks.cek_plg_bts_mutasi" },
      { db: "PostgreSQL", name: "kunabakti.cek_plg_bts_mutasi" },
    ],
  },
  {
    path: "/api/cek-plg-bts",
    tag: "Cek Billing",
    summary: "Cek pelanggan BTS",
    sources: [
      { db: "Oracle", name: "dtks.cek_plg_bts" },
      { db: "PostgreSQL", name: "kunabakti.cek_plg_bts" },
    ],
  },
  {
    path: "/api/cek-lp-kurangdari",
    tag: "Cek Billing",
    summary: "Cek LP kurang dari",
    sources: [
      { db: "Oracle", name: "dtks.cek_lp_kurangdari" },
      { db: "PostgreSQL", name: "kunabakti.cek_lp_kurangdari" },
    ],
  },
  {
    path: "/api/cek-lp-lebihdari",
    tag: "Cek Billing",
    summary: "Cek LP lebih dari",
    sources: [
      { db: "Oracle", name: "dtks.cek_lp_lebihdari" },
      { db: "PostgreSQL", name: "kunabakti.cek_lp_lebihdari" },
    ],
  },
  {
    path: "/api/cek-pemkwh0",
    tag: "Cek Billing",
    summary: "Cek pemakaian kWh 0",
    sources: [
      { db: "Oracle", name: "dtks.cek_pemkwh0" },
      { db: "PostgreSQL", name: "kunabakti.cek_pemkwh0" },
    ],
  },
  {
    path: "/api/cek-anomali-pemkwh",
    tag: "Cek Billing",
    summary: "Cek anomali pemakaian kWh",
    sources: [
      { db: "Oracle", name: "dtks.cek_anomali_pemkwh" },
      { db: "PostgreSQL", name: "kunabakti.cek_anomali_pemkwh" },
    ],
  },
  {
    path: "/api/cek-pb-pks",
    tag: "Cek Billing",
    summary: "Cek PB PKS",
    sources: [
      { db: "Oracle", name: "dtks.cek_pb_pks" },
      { db: "PostgreSQL", name: "kunabakti.cek_pb_pks" },
    ],
  },
].map((endpoint) => ({
  ...endpoint,
  queryNote:
    endpoint.queryNote ||
    "Oracle: `THBLREK = :thblrek`, optional `UNITUPI`, `IDPEL`. PostgreSQL: `thblrek = $1`, optional `unitupi`, `idpel`.",
}));

const noUnitEndpoints = [
  {
    path: "/api/cek-rppn-r3",
    summary: "Cek RPPN R3",
    sources: [
      { db: "Oracle", name: "DTKS.CEK_RPPN_R3" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_ppn_r3" },
    ],
  },
  {
    path: "/api/cek-rppn-lebih0",
    summary: "Cek RPPN lebih dari 0",
    sources: [
      { db: "Oracle", name: "dtks.cek_rppn_lebih0" },
      { db: "PostgreSQL", name: "kunabakti.cek_rppn_lebih0" },
    ],
  },
  {
    path: "/api/cek-stanmundur",
    summary: "Cek stand mundur",
    sources: [
      { db: "Oracle", name: "dtks.cek_standmundur" },
      { db: "PostgreSQL", name: "kunabakti.cek_standmundur" },
    ],
  },
].map((endpoint) => ({
  ...endpoint,
  tag: "Cek Billing",
  parameters: [thblrekParam, idpelParam],
  queryNote:
    "Oracle: `THBLREK = :thblrek`, optional `IDPEL`. PostgreSQL: `thblrek = $1`, optional `idpel`.",
}));

const paths = {
  "/apis/users/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description:
        "Source query: Oracle `INDIARTO_WIRAYUDA.usertab`.\n\nFilter/query: `id_user = :username`, password request di-hash MD5 lalu dibandingkan dengan kolom `passwd`. Response berisi JWT.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "admin" },
                password: { type: "string", format: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login berhasil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user: { type: "object", additionalProperties: true },
                    },
                  },
                },
              },
            },
          },
        },
        401: errorResponse,
      },
    },
  },
  "/apis/trans101": getOperation({
    tag: "Utility",
    summary: "Sample data trans_101",
    sources: [{ db: "Oracle", name: "bill52.trans_101" }],
    queryNote: "`SELECT * FROM bill52.trans_101`.",
    parameters: [],
  }),
  "/api/cek-materai": getOperation({
    tag: "Cek Billing",
    summary: "Cek validasi materai",
    sources: [
      { db: "Oracle", name: "DTKS.VW_VALIDASI_MATERAI" },
      { db: "PostgreSQL", name: "kunabakti.vw_validasi_materai" },
    ],
    queryNote:
      "Filter rule wajib: `MATERAI_LAMA` (`rpmat IN ('3000','6000')`), `MATERAI_5JT` (`rptag > 5000000 AND rpmat <> '10000'`), atau `MATERAI_DIBAWAH_5JT` (`rptag <= 5000000 AND rpmat > 0`). Optional `thblrek`, `unitupi`, `idpel`.",
    parameters: [
      optionalThblrekParam,
      unitupiParam,
      idpelParam,
      {
        name: "rule",
        in: "query",
        required: true,
        description: "Jenis rule validasi materai.",
        schema: {
          type: "string",
          enum: ["MATERAI_LAMA", "MATERAI_5JT", "MATERAI_DIBAWAH_5JT"],
        },
      },
    ],
  }),
  "/api/cek-ppn/sewatrafo": getOperation({
    tag: "Cek PPN",
    summary: "Cek PPN sewa trafo",
    sources: [
      { db: "Oracle", name: "dtks.cek_ppn_sewatrafo" },
      { db: "PostgreSQL", name: "kunabakti.cek_ppn_sewatrafo" },
    ],
    queryNote:
      "Filter `thblrek`; optional `unitupi` dan `idpel` hanya dipakai kalau kolomnya tersedia di view.",
  }),
  "/api/cek-ppn/bptrafo": getOperation({
    tag: "Cek PPN",
    summary: "Cek PPN BP trafo",
    sources: [
      { db: "Oracle", name: "dtks.cek_ppn_bptrafo" },
      { db: "PostgreSQL", name: "kunabakti.cek_ppn_bptrafo" },
    ],
    queryNote:
      "Filter `thblrek`; optional `unitupi` dan `idpel` hanya dipakai kalau kolomnya tersedia di view.",
  }),
  "/api/cek-ppn/sewakap": getOperation({
    tag: "Cek PPN",
    summary: "Cek PPN sewa kapasitor",
    sources: [
      { db: "Oracle", name: "dtks.cek_ppn_sewakap" },
      { db: "PostgreSQL", name: "kunabakti.cek_ppn_sewakap" },
    ],
    queryNote:
      "Filter `thblrek`; optional `unitupi` dan `idpel` hanya dipakai kalau kolomnya tersedia di view.",
  }),
  "/api/cek-ppj": getOperation({
    tag: "Cek Billing",
    summary: "Cek PPJ",
    sources: [
      { db: "Oracle", name: "dtks.cek_ppj_lebih3" },
      { db: "PostgreSQL", name: "kunabakti.cek_ppj_lebih3" },
    ],
    queryNote:
      "Filter `thblrek` pada view `cek_ppj_lebih3`.",
    parameters: [thblrekParam],
  }),
  "/api/cek-ppj/beda-prosen": getOperation({
    tag: "Cek Billing",
    summary: "Cek PPJ beda prosen",
    sources: [
      { db: "Oracle", name: "dtks.cek_ppj" },
      { db: "PostgreSQL", name: "kunabakti.cek_ppj" },
    ],
    queryNote:
      "Filter `thblrek` dan anomali `PROSENPPJ <> PROSEN_CEK` / `prosenppj <> prosen_cek`.",
    parameters: [thblrekParam],
  }),
  "/api/detil-anomali-haribaca-ap2t": getOperation({
    tag: "Cek Billing",
    summary: "Detil anomali haribaca AP2T",
    sources: [{ db: "Oracle", name: "dtks.DETIL_ANOMALI_HARIBACA_AP2T" }],
    queryNote:
      "Oracle only. Query dasar `SELECT * FROM dtks.DETIL_ANOMALI_HARIBACA_AP2T`; filter `THBLREK = :thblrek`, optional `UNITUPI`, `IDPEL`, search di Oracle, sorting whitelist, pagination `page` dan `limit`, count terpisah.",
    parameters: [
      thblrekParam,
      unitupiParam,
      idpelParam,
      pageParam,
      limitParam,
      sortFieldParam,
      sortOrderParam,
      searchParam,
    ],
  }),
  "/api/detil-anomali-haribaca-ap2t/export": {
    get: {
      tags: ["Cek Billing"],
      summary: "Export detil anomali haribaca AP2T ke Excel",
      description: sourceText(
        [{ db: "Oracle", name: "dtks.DETIL_ANOMALI_HARIBACA_AP2T" }],
        "Oracle only. Export memakai ResultSet batch 5000 dan streaming XLSX langsung ke response tanpa file temporary."
      ),
      security: [{ bearerAuth: [] }],
      parameters: [
        thblrekParam,
        unitupiParam,
        idpelParam,
        sortFieldParam,
        sortOrderParam,
        searchParam,
      ],
      responses: {
        200: {
          description: "File XLSX hasil export",
          content: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {},
          },
        },
        400: errorResponse,
        401: errorResponse,
        500: errorResponse,
      },
    },
  },
  "/api/cek-pecah-tdl": getOperation({
    tag: "Cek Billing",
    summary: "Cek pecah TDL",
    sources: [{ db: "Oracle", name: "dtks.cek_pecah_tdl" }],
    queryNote:
      "Oracle only. Filter `THBLREK = :thblrek`, optional `UNITUPI`, `IDPEL`. Data diurutkan berdasarkan `THBLREK`, `UNITUPI`, `IDPEL`.",
  }),
  "/api/cek-anomali-koreksi-billing": getOperation({
    tag: "Cek Billing",
    summary: "Cek anomali koreksi billing",
    sources: [{ db: "Oracle", name: "dtks.anomali_billing_koreksi" }],
    queryNote:
      "Oracle only. Filter `THBLREK = :thblrek`, optional `IDPEL`. Parameter `unitupi` diterima controller tetapi belum digunakan di query model.",
    parameters: [thblrekParam, idpelParam],
  }),
  "/api/cek-anomali-jn-lwbp": getOperation({
    tag: "Cek Billing",
    summary: "Cek anomali jam nyala LWBP",
    sources: [
      { db: "Oracle", name: "DTKS.VW_CEK_JAMNYALA_LWBP" },
      { db: "PostgreSQL", name: "kunabakti.vw_cek_jamnyala_lwbp" },
    ],
    queryNote:
      "Filter bisnis `TARIF <> 'P3'`, `TG = 'G'`, `THBLMUT <> THBLREK`, dan `THBLREK = :thblrek`/`$1`; optional `UNITUPI`, `IDPEL`.",
  }),
  "/api/cek-saldo-stimulus": getOperation({
    tag: "Cek Billing",
    summary: "Cek saldo stimulus",
    sources: [
      { db: "Oracle", name: "DTKS.CEK_SALDO_STIMULUS" },
      { db: "PostgreSQL", name: "kunabakti.cek_saldo_stimulus" },
    ],
    queryNote:
      "Filter `THBLREK = :thblrek`/`$1`, optional `IDPEL`; data diurutkan berdasarkan periode dan ID pelanggan.",
    parameters: [thblrekParam, idpelParam],
  }),
  "/api/cek-emulsion": getOperation({
    tag: "Cek Billing",
    summary: "Cek emulsion",
    sources: [
      { db: "Oracle", name: "DTKS.GET_EMULSION" },
      { db: "PostgreSQL", name: "kunabakti.get_emulsion" },
    ],
    queryNote:
      "Filter `thblrek` dapat berupa satu atau beberapa nilai, optional `UNITUPI`, `IDPEL`. Untuk banyak periode, Oracle memakai `IN` dan PostgreSQL memakai array `ANY`.",
    parameters: [
      {
        name: "thblrek",
        in: "query",
        required: false,
        description: "Satu periode atau beberapa periode rekening format YYYYMM.",
        schema: { type: "array", items: { type: "string", pattern: "^\\d{6}$" } },
        style: "form",
        explode: true,
        example: ["202606"],
      },
      unitupiParam,
      idpelParam,
    ],
  }),
};

for (const endpoint of [...standardEndpoints, ...noUnitEndpoints]) {
  paths[endpoint.path] = getOperation(endpoint);
}

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Billing Backend API",
    version: "1.0.0",
    description:
      "Dokumentasi endpoint Billing BE. Mayoritas endpoint membutuhkan Bearer token dari `/apis/users/login`. Bagian description tiap endpoint mencatat source query Oracle/PostgreSQL dan filter utamanya untuk tracing fitur.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Auth", description: "Login dan token" },
    { name: "Utility", description: "Endpoint utilitas/sample" },
    { name: "Cek Billing", description: "Endpoint validasi/anomali billing" },
    { name: "Cek PPN", description: "Endpoint validasi PPN" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths,
};

export default openApiSpec;
