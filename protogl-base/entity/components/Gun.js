var Gun = function(ammo, maxAmmo, fireRate, offsetList, startingAngles, targets) {
    this.ammo = ammo;
    this.maxAmmo = maxAmmo;
    this.fireRate = fireRate;
    this.lastFire = 0;
    this.sprayX = 0;
    this.sprayY = 0;
    this.bulletList = offsetList || null;
    this.startingAngles = startingAngles || null;
    this.bulletTargets = targets || null;

    this.shoot = GAME.entityShoot;
};
Gun.prototype.name = "gun";