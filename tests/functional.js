/* eslint-env node, mocha */
const assert = require('assert');
const { Room } = require('../models/room');

let room = new Room();

describe('Room', () => {
  describe('Initialization', () => {
    it('should initialize Room Class with diferente params', () => {
      const newDate = new Date();

      room = new Room({
        active_users: 4,
        keystrokes: 3,
        active_since: 0,
        counter: 2,
        below_mean: 1,
        ranking: [['a', 1]],
        last_minute_lead: 'a',
        users_history: [{}],
        created_at: newDate,
      });

      assert.equal(room.active_users, 4);
      assert.equal(room.keystrokes, 3);
      assert.equal(room.active_since, 0);
      assert.equal(room.counter, 2);
      assert.equal(room.below_mean, 1);
      assert.deepEqual(room.ranking, [['a', 1]]);
      assert.equal(room.last_minute_lead, 'a');
      assert.deepEqual(room.users_history, [{}]);
      assert.equal(room.created_at, newDate);
    });

    it('should initialize Room Class with default params', () => {
      room = new Room({ text: 'ivan' });
      assert.equal(room.active_users, 0);
      assert.equal(room.keystrokes, 0);
      assert.equal(room.counter, 0);
      assert.equal(room.below_mean, 0);
      assert.deepEqual(room.ranking, []);
      assert.equal(room.last_minute_lead, '');
      assert.deepEqual(room.users_history, []);
      assert.equal(room.status, 'waiting');
    });
  });
});