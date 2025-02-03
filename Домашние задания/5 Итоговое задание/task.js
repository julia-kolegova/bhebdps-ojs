class Player {
    constructor(position, name) {
      this._life = 100;
      this._magic = 20;
      this._speed = 1;
      this._attack = 10;
      this._agility = 5;
      this._luck = 10;
      this._description = "Игрок";
      this._weapon = new Arm();
      this._name = name;
      this._position = position;
    }
  
    getLuck() {
      return (Math.floor(Math.random() * 100) + this._luck) / 100;
    }
  
    getPosition() {
      return this._position;
    }
  
    getDamage(distance) {
      return (
        ((this._attack + this._weapon.getDamage()) * this.getLuck()) / distance
      );
    }
  
    takeDamage(damage) {
      this._life = Math.max(this._life - damage, 0);
    }
  
    isDead() {
      Boolean(this._life);
    }
  
    moveLeft(distance) {
      this._position -= distance > this._speed ? this._speed : distance;
    }
  
    moveRight(distance) {
      this._position += distance > this._speed ? this._speed : distance;
    }
  
    move(distance) {
      if (distance < 0) {
        this.moveLeft(Math.abs(distance));
        return;
      }
  
      this.moveRight(distance);
    }
  
    isAttackBlocked() {
      return this.getLuck() > (100 - this._luck) / 100;
    }
  
    dodged() {
      return this.getLuck() > (100 - this._agility - this._speed * 3) / 100;
    }
  
    takeAttack(damage) {
      if (this.dodged()) {
        return;
      }
  
      if (this.isAttackBlocked()) {
        this._weapon.takeDamage(damage);
        return;
      }
  
      this.takeDamage(damage);
    }
  
    checkWeapon() {
      if (this._weapon.isBroken()) {
      }
    }
  
    tryAttack(enemy) {
      const distance = Math.abs(this.getPosition() - enemy.getPosition());
      if (distance > this._weapon.getRange()) {
        return;
      }
  
      this._weapon.takeDamage(10 * this.getLuck());
      enemy.takeAttack(this.getDamage(distance));
  
      if (this.getPosition() === enemy.getPosition()) {
        enemy.moveRight(1);
      }
    }
  
    chooseEnemy(players) {
      return players.reduce(
        (min, player) => {
          return player._life < min._life && player !== this ? player : min;
        },
        { _life: Infinity, isNoEnemies: true }
      );
    }
  
    moveToEnemy(enemy) {
      this._position = enemy.getPosition();
    }
  
    turn(players) {
      const enemy = this.chooseEnemy(players);
      if (enemy.isNoEnemies) return;
  
      this.moveToEnemy(enemy);
      this.tryAttack(enemy);
    }
  
    play(players) {
      while (!this.isDead() && !this.chooseEnemy(players).isNoEnemies) {
        this.turn(players);
      }
      if (this.isDead()) console.log("Игроку хана");
      if (this.chooseEnemy(players).isNoEnemies) console.log("Всех убил");
    }
  }
  
  class Warrior extends Player {
    constructor(position) {
      super(position, "Warrior");
      this._life = 120;
      this._initialLife = 120;
      this._speed = 2;
      this._attack = 10;
      this._description = "Воин";
      this._weapon = new Sword();
    }
  
    takeDamage(damage) {
      if (
        this._life < this._initialLife * 0.5 &&
        this.getLuck() > 0.8 &&
        this._magic > 0
      ) {
        this._magic = Math.max(this._magic - damage, 0);
        return;
      }
  
      super.takeDamage(damage);
    }
  }
  
  class Archer extends Player {
    constructor(position) {
      super(position, "Archer");
      this._life = 80;
      this._magic = 35;
      this._attack = 5;
      this._agility = 10;
      this._description = "Лучник";
      this._weapon = new Bow();
    }
  
    getDamage(distance) {
      return (
        ((this._attack + this._weapon.getDamage()) * this.getLuck() * distance) /
        this._weapon.getRange()
      );
    }
  }
  
  class Mage extends Player {
    constructor(position) {
      super(position, "Mage");
      this._life = 70;
      this._magic = 100;
      this._magicInitial = this._magic;
      this._attack = 5;
      this._agility = 8;
      this._description = "Маг";
      this._weapon = new Staff();
    }
  
    takeDamage(damage) {
      if (this._magic > this._magicInitial * 0.5) {
        super.takeDamage(damage / 2);
        this._magic = Math.max(this._magic - 12, 0);
        return;
      }
  
      super.takeDamage(damage);
    }
  }
  
  class Dwarf extends Warrior {
    constructor(position) {
      super(position);
      this._hits = 0;
      this._name = "Dwarf";
      this._life = 130;
      this._attack = 15;
      this._luck = 20;
      this._description = "Гном";
      this._weapon = new Axe();
    }
  
    takeDamage(damage) {
      this._hits += 1;
      if (this._hits % 6 === 0 && this.getLuck() > 0.5) {
        super.getDamage(damage / 2);
        return;
      }
      super.getDamage(damage);
    }
  }
  
  class Crossbowman extends Archer {
    constructor(position) {
      super(position);
      this._name = "Dwarf";
      this._life = 85;
      this._attack = 8;
      this._agility = 20;
      this._luck = 15;
      this._description = "Арбалетчик";
      this._weapon = new LongBow();
    }
  }
  
  class Demiurge extends Mage {
    constructor(position) {
      super(position);
      this._name = "Demiurge";
      this._life = 80;
      this._magic = 120;
      this._attack = 6;
      this._luck = 12;
      this._description = "Демиург";
      this._weapon = new StormStaff();
    }
  
    getDamage() {
      if (this._magic > 0 && this.getLuck() > 0.5) {
        return super.getDamage() * 1.5;
      }
  
      return super.getDamage();
    }
  }
  
  class Weapon {
    constructor(name, attack, durability, range) {
      this._name = name;
      this._attack = attack;
      this._durabilityInitial = durability;
      this._durability = durability;
      this._range = range;
    }
  
    takeDamage(damage) {
      if (this._durability - damage < 0) {
        this._durability = 0;
        return;
      }
  
      this._durability -= damage;
    }
  
    getDamage() {
      if (this._durability >= this._durabilityInitial * 0.3) {
        return this._attack;
      }
  
      return this._attack / 2;
    }
  
    isBroken() {
      return Boolean(this._durability);
    }
  
    getRange() {
      return this._range;
    }
  }
  
  class Arm extends Weapon {
    constructor() {
      super("Рука", 1, Infinity, 1);
    }
  }
  
  class Bow extends Weapon {
    constructor() {
      super("Лук", 10, 200, 3);
    }
  }
  
  class LongBow extends Bow {
    constructor() {
      super();
      this._name = "Длинный лук";
      this._attack = 15;
      this._range = 4;
    }
  }
  
  class Sword extends Weapon {
    constructor() {
      super("Меч", 25, 500, 1);
    }
  }
  
  class Axe extends Sword {
    constructor() {
      super();
      this._name = "Секира";
      this._attack = 27;
      this._durability = 800;
      this._durabilityInitial = this._durability;
    }
  }
  
  class Knife extends Weapon {
    constructor() {
      super("Нож", 5, 300, 1);
    }
  }
  
  class Staff extends Weapon {
    constructor() {
      super("Посох", 8, 300, 2);
    }
  }
  
  class StormStaff extends Staff {
    constructor() {
      super();
      this._range = "Посох Бури";
      this._attack = 10;
      this._range = 3;
    }
  }
  