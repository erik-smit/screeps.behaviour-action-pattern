var setup = new Creep.Setup('haulateer');
setup.minControllerLevel = 3;
setup.globalMeasurement = true;
setup.measureByHome = true;
setup.default = {
    fixedBody: [], 
    multiBody: [CARRY, CARRY, MOVE], 
    minAbsEnergyAvailable: 400, 
    minEnergyAvailable: 0.8,
    maxMulti: 10,
    minMulti: (room) => (room.controller.level),
    maxWeight: (room) => room.privateerMaxWeight
};
setup.RCL = {
    1: setup.none,
    2: setup.none,
    3: setup.default,
    4: setup.default,
    5: setup.default,
    6: setup.default,
    7: setup.default,
    8: setup.default
};
module.exports = setup;