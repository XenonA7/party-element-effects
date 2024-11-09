sc.PartyMemberEntity.inject({
  updateElement: function () {
      if (this.model) {
        var a = this.getBestElement();
        if (this.model.currentElementMode != a) {
          sc.combat.showModeChange(this, a);
          //sc.combat.showModeAura(this, a);
        }
        a != this.model.currentElementMode && this.model.setElementMode(a);
      }
    }
});

sc.PartyMemberEntity.inject({
  update(...args) {
    if(!sc.model.isCombatMode() && !sc.model.isCombatCooldown() && this.model != null)
    { //if outside combat, and not in the cooldown before combat *actually* cancels
    if(this.model.currentElementMode != 0 && this.timeUntilNeutral == null)
    {
      this.timeUntilNeutral = 0.5 + Math.random() * 2; //random between 0.5 and 2.5 seconds before reverting
    }
    if(this.timeUntilNeutral != null)
    { //decrement the counter
      this.timeUntilNeutral -= 1 * ig.system.tick;
      if(this.timeUntilNeutral <= 0) //if outside combat, and the timer has hit zero, swap back to neutral
      {
      sc.combat.showModeChange(this, 0); //hook this one line up to a toggle option to disable the neutral element animation maybe?
      this.model.currentElementMode = 0;
      this.timeUntilNeutral = null;
      }
    }
    }
    else
    this.timeUntilNeutral = null;
    
    
    var speedmagnitude = Math.sqrt(this.coll.vel.x*this.coll.vel.x + this.coll.vel.y*this.coll.vel.y);
    if (speedmagnitude > 50)
    this.movingtime=0.5; //if they're moving, set a timer for 0.5 seconds
    if (this.movingtime == null)
    this.movingtime=0;
    this.movingtime -= 1 * ig.system.tick;

    var auratype = this.model != null ? this.model.currentElementMode : 0;
    if (this.movingtime < 0) //if it's been over 0.5 seconds since they moved, override the aura type to be nothing
    auratype = 0;
    
    if(this.lastauratype == null || this.lastauratype != auratype) //if the new aura type is different from what's active, swap it
    {
    this.lastauratype = auratype;
    sc.combat.showModeAura(this, auratype);
    }
    
    this.parent(...args);
  },
});