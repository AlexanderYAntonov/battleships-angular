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

export const PLAYGROUND_STATUS = {
  undef: 0,
  win: 1,
  lose: 2
};

export interface WebSocketIncomingMessage {
  type: string; // 'set_cells', 'update_cell', 'win', 'lose', 'started', 'team_name'
  playgroundID: number; // 0 - left, 1 - right
  value?: number; // cell value
  x?: number; // cell x coordinate
  y?: number; // cell y coordinate
  cells?: number[][];
  name?: string;
}

export interface WebSocketOutgoingMessage {
  started: boolean; // when 'start' clicked
}

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
