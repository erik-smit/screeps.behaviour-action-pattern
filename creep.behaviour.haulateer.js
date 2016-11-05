module.exports = {
    name: 'haulateer',
    run: function(creep) {
        // Assign next Action
        let oldTargetId = creep.data.targetId;
        if( creep.action == null || creep.action.name == 'idle' ) {
            this.nextAction(creep);
        }
        if( creep.data.targetId != oldTargetId ) {
            delete creep.data.path;
        }
        // Do some work
        if( creep.action && creep.target ) {
            creep.action.step(creep);
        } else {
            logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
        }
    },
    nextAction: function(creep){
        let priority;
        // at home
        if( creep.pos.roomName == creep.data.homeRoom ){
            if (creep.sum) {
                var actions = [Creep.action.storing];
                for(var iAction = 0; iAction < actions.length; iAction++) {   
                    var action = actions[iAction]; 
                    if(action.isValidAction(creep) && 
                        action.isAddableAction(creep) && 
                        action.assign(creep))
                    return;
                }
            } else if( this.exploitNextRoom(creep) ) 
                return;
            else {
                // no new flag
                // behave as hauler
                Creep.behaviour.hauler.nextAction(creep);
                return;
            }
        }
        var actions = [Creep.action.uncharging];
        for(var iAction = 0; iAction < actions.length; iAction++) {   
            var action = actions[iAction]; 
            if(action.isValidAction(creep) && 
                action.isAddableAction(creep) && 
                action.assign(creep))
                return;
         }
         if(this.exploitNextRoom(creep)) return;
    },
    exploitNextRoom: function(creep){
        if( creep.sum < creep.carryCapacity/2 ) {
            // calc by distance to home room
            let validColor = flagEntry => (
                (flagEntry.color == FLAG_COLOR.invade.exploit.color && flagEntry.secondaryColor == FLAG_COLOR.invade.exploit.secondaryColor) ||
                (flagEntry.color == FLAG_COLOR.invade.robbing.color && flagEntry.secondaryColor == FLAG_COLOR.invade.robbing.secondaryColor)
            );
            let flag = FlagDir.find(validColor, Game.rooms[creep.data.homeRoom].controller.pos, false, FlagDir.exploitMod, creep.name);
            // new flag found
            if( flag ) {
                // travelling
                if( Creep.action.travelling.assign(creep, flag) ) {
                    Population.registerCreepFlag(creep, flag);
                    return true;
                }
            }
        }
        // no new flag
        // go home
        Population.registerCreepFlag(creep, null);
        Creep.action.travelling.assign(creep, Game.rooms[creep.data.homeRoom].controller);
        return false;
    }
}
