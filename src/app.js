import express from "express";
import cors from "cors";

import trans101Routes from "./modules/trans101/trans101.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import getCekRpbeban from "./modules/cek_rpbeban/cek_rpbeban.routes.js";
import getCekDibawah40jn from "./modules/cek_dibawah40jn/cek_dibawah40jn.routes.js";
import getCekMaterai from "./modules/cek_materai/cek_materai.routes.js";
import getCekRptag0 from "./modules/cek_rptag_0/cek_rptag_0.routes.js";
import getCekRppnR3 from "./modules/cek_rppn_r3/cek_rppn_r3.routes.js";
import getCekSelisihUnsurPtl from "./modules/cek_selisih_unsur_ptl/cek_selisih_unsur_ptl.routes.js";
import getCekAnomaliKelebihanKvarh from "./modules/cek_anomali_kelebihan_kvarh/cek_anomali_kelebihan_kvarh.routes.js";
import getVwbilling720jn from "./modules/vwbilling_720jn/vwbilling_720jn.routes.js";
import getCekPlgSpel from "./modules/cek_spel/cek_spel.routes.js";
import getCekStimulus from "./modules/cek_selisih_stimulus/cek_selisih_stimulus.routes.js";
import getCekRppnLebih0 from "./modules/cek_rppn_lebih0/cek_rppn_lebih0.routes.js";
import getcekStanmundur from "./modules/cek_stanmundur/cek_stanmundur.routes.js";
import getCekPpnView from "./modules/cek_ppn_view/cek_ppn_view.routes.js";
import getCekPksTrflwbp2000 from "./modules/cek_pks_trflwbp_2000/cek_pks_trflwbp_2000.routes.js";
import getCekReduksiRp0 from "./modules/cek_reduksi_rp0/cek_reduksi_rp0.routes.js";
import getCekReduksiStimulus from "./modules/cek_lebih_stimulus/cek_lebih_stimulus.routes.js";
import getCekPecahTdl from "./modules/cek_pecah_tdl/cek_pecah_tdl.routes.js";
import getCekSaldoPasca from "./modules/cek_saldo_pasca/cek_saldo_pasca.routes.js"
import cekPlgCKvarh from "./modules/cek_plg_c_kvarh/cek_plg_c_kvarh.routes.js"
import getCekAnomaliStan from "./modules/cek_anomali_stan/cek_anomali_stan.routes.js" 
import getCekKoma from "./modules/cek_rp_koma/cek_rp_koma.routes.js";
import getCekStanNoMut from "./modules/cek_stanmundur_a/cek_stanmundur_a.routes.js";
import getPlgBtsMut from "./modules/cek_plg_bts_mut/cek_plg_bts_mut.routes.js";
import getPlgBts from "./modules/cek_plg_bts/cek_plg_bts.routes.js";
import getLpKurangDari from "./modules/cek_lp_kurangdari/cek_lp_kurangdari.routes.js";
import getLpLebihDari from "./modules/cek_lp_lebihdari/cek_lp_lebihdari.routes.js";
import getPemkwh0 from "./modules/cek_pemkwh0/cek_pemkwh0.routes.js";
import getCekAnomaliPemkwh from "./modules/cek_anomali_pemkwh/cek_anomali_pemkwh.routes.js";
import getCekPbPks from "./modules/cek_pb_pks/cek_pb_pks.routes.js";
import getCekPpj from "./modules/cek_ppj/cek_ppj.routes.js";
import getDetilAnomaliHaribacaAp2t from "./modules/detil_anomali_haribaca_ap2t/detil_anomali_haribaca_ap2t.routes.js";
import getCekAnomaliBillingKoreksi from "./modules/cek_anomali_koreksi/cek_anomali_koreksi.routes.js";
import getCekAnomaliJnLwbp from "./modules/cek_anomali_jn_lwbp/cek_anomali_jn_lwbp.routes.js";
import getCekSaldoStimulus from "./modules/cek_saldo_stimulus/cek_saldo_stimulus.routes.js";
import swaggerRoutes from "./docs/swagger.routes.js";
import getEmulsion from "./modules/cek_emulsion/cek_emulsion.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(swaggerRoutes);
app.use("/apis/trans101", trans101Routes);
app.use("/apis/users", usersRoutes);
app.use("/api/cek-rpbeban", getCekRpbeban);
app.use("/api/cek-dibawah40jn", getCekDibawah40jn);
app.use("/api/cek-materai", getCekMaterai);
app.use("/api/cek-rptag-0", getCekRptag0);
app.use("/api/cek-rppn-r3", getCekRppnR3);
app.use("/api/cek-selisih-unsur-ptl", getCekSelisihUnsurPtl);
app.use("/api/cek-anomali-kelebihan-kvarh", getCekAnomaliKelebihanKvarh);
app.use("/api/vwbilling-720jn", getVwbilling720jn);
app.use ("/api/cek-spel", getCekPlgSpel);
app.use ("/api/cek-stimulus", getCekStimulus);
app.use ("/api/cek-rppn-lebih0", getCekRppnLebih0);
app.use ("/api/cek-stanmundur",getcekStanmundur);
app.use("/api/cek-ppn", getCekPpnView);
app.use("/api/cek-pks-trflwbp-2000", getCekPksTrflwbp2000);
app.use ("/api/cek-reduksi-rp0",getCekReduksiRp0 );
app.use ("/api/cek-reduksi-stimulus", getCekReduksiStimulus);
app.use("/api/cek-pecah-tdl", getCekPecahTdl);
app.use ("/api/cek-saldo-pasca",getCekSaldoPasca);
app.use("/api/cek-plgc-kvarh",cekPlgCKvarh);
app.use ("/api/cek-anomali-stan",getCekAnomaliStan);
app.use ("/api/cek-rp-koma",getCekKoma);
app.use ("/api/cek-stan-nomut",getCekStanNoMut );
app.use ("/api/cek-plg-bts-mut",getPlgBtsMut);
app.use ("/api/cek-plg-bts",getPlgBts);
app.use ("/api/cek-lp-kurangdari",getLpKurangDari);
app.use ("/api/cek-lp-lebihdari",getLpLebihDari);
app.use ("/api/cek-pemkwh0",getPemkwh0);
app.use ("/api/cek-anomali-pemkwh",getCekAnomaliPemkwh);
app.use ("/api/cek-pb-pks",getCekPbPks);
app.use("/api/cek-ppj", getCekPpj);
app.use("/api/detil-anomali-haribaca-ap2t", getDetilAnomaliHaribacaAp2t);
app.use("/api/cek-anomali-koreksi-billing",getCekAnomaliBillingKoreksi);
app.use("/api/cek-anomali-jn-lwbp", getCekAnomaliJnLwbp);
app.use("/api/cek-saldo-stimulus", getCekSaldoStimulus);
app.use ("/api/cek-emulsion",getEmulsion);


export default app;
