export interface BattleShip {
  id: number;
  life: number;
  size: number;
  alive: boolean;
}

export interface Playground {
  cells: number[][];
  score?: number;
  ships_left?: number;
  ships?: BattleShip[];
  status?: number; // 0 - undef, 1 - win, 2 - lose
}

export interface Coordinates {
  x: number;
  y: number;
}

export const ATTACK_STATUS = {
  missed: 0,
  wounded: 1,
  destroyed: 2,
  lose: 3,
  duplicate: 4
};

/*
sea - 0
ship - 10-22
wounded ship - 110 - 122
destroyed ship - 210 - 222
fog - 3
water missed - 100
water just missed - 1100
just wounded ship - 1110 - 1122
just destroyed ship - 1210 - 1222
*/
