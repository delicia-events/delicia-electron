exports.wageSpliter = function (
  staffDetails,
  staffShare,
  basicConfig,
  workType
) {
  let wageMap;
  let perheadFullwork;
  let perheadSetup;
  let perheadPhaseout;
  let setupStaffNo = 0;
  let phaseoutStaffNo = 0;

  staffDetails.map((staff) => {
    if (staff.workType === "setup") {
      setupStaffNo += 1;
    } else if (staff.workType === "phaseout") {
      phaseoutStaffNo += 1;
    } else if (staff.workType === "fullwork") {
      setupStaffNo += 1;
      phaseoutStaffNo += 1;
    }
  });

  if (workType === "panthal") {
    perheadSetup =
      (staffShare *
        (basicConfig.setup_labour_charge / basicConfig.total_labour_charge)) /
      setupStaffNo;

    perheadPhaseout =
      (staffShare *
        (basicConfig.phaseout_labour_charge /
          basicConfig.total_labour_charge)) /
      phaseoutStaffNo;
  } else if (workType === "mandapam") {
    perheadSetup =
      (staffShare *
        (basicConfig.stage_setup_labour_charge /
          basicConfig.stage_total_labour_charge)) /
      setupStaffNo;

    perheadPhaseout =
      (staffShare *
        (basicConfig.stage_phaseout_labour_charge /
          basicConfig.stage_total_labour_charge)) /
      phaseoutStaffNo;
  }

  perheadFullwork = perheadSetup + perheadPhaseout;

  wageMap = {
    perheadFullwork,
    perheadSetup,
    perheadPhaseout,
  };

  return wageMap;
};
