var mod = {
    extend: function(){
        Spawn.prototype.priority = [
                Creep.setup.miner, 
                Creep.setup.mineralMiner,
                Creep.setup.worker, 
                Creep.setup.hauler,
                Creep.setup.upgrader,
                Creep.setup.warrior,
                Creep.setup.melee,
                Creep.setup.ranger,
                Creep.setup.healer,
                Creep.setup.pioneer, 
                Creep.setup.privateer,
                Creep.setup.haulateer,
                Creep.setup.claimer];
        Spawn.prototype.loop = function(){
            if( this.spawning ) return;
            let that = this;
            let room = this.room;
            let probe = setup => {
                return setup.isValidSetup(room) && that.createCreepBySetup(setup);
            }
            _.find(this.priority, probe);
        };
        Spawn.prototype.createCreepBySetup = function(setup, spawn){
            spawn = spawn || this;
            var params = setup.buildParams(spawn);
            if( params.parts.length == 0 ) return null;
            var newName = spawn.createCreep(params.parts, params.name, null);
            if( params.name == newName || translateErrorCode(newName) === undefined ){
                Population.registerCreep(newName, params.setup, params.cost, spawn.room, spawn.name, params.parts);
                if(CENSUS_ANNOUNCEMENTS) console.log( dye(CRAYON.system, spawn.pos.roomName  + ' &gt; ') + dye(CRAYON.birth, 'Good morning ' + newName + '!') );
                return params;
            }
            if( DEBUG ) console.log( dye(CRAYON.system, spawn.pos.roomName + ' &gt; ') + dye(CRAYON.error, 'Offspring failed: ' + translateErrorCode(newName) + ', spawn params: ' + JSON.stringify(params) ) );
            return null;
        };
        Spawn.loop = function(){      
            var loop = spawn => { 
                if( !spawn.spawning ) 
                    spawn.loop(); 
            };
            _.forEach(Game.spawns, loop);
        }
    }
};

module.exports = mod;
