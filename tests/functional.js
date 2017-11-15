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

  describe('Add first user', () => {
    it('should list all users in an empty room', () => {
      assert.deepEqual(room.users(), []);
    });

    it('should find user in an empty room', () => {
      assert.deepEqual(room.userExists('ivanmicai'), undefined);
    });

    it('should list an user_inputs in an empty room', () => {
      assert.deepEqual(room.userInputs('ivanmicai'), undefined);
    });

    it('should list an user_last_input in an empty room', () => {
      assert.deepEqual(room.userInputs('ivanmicai'), undefined);
    });

    it('should Add a user', () => {
      room.userJoin('ivanmicai');
    });

    it('should list all users in a room with one user', () => {
      assert.deepEqual(room.users(), ['ivanmicai']);
    });

    it('should find user in a room with one user', () => {
      assert.equal(room.userExists('ivanmicai'), 'ivanmicai');
    });

    it('should find a diferent user in a room with one user', () => {
      assert.equal(room.userExists('ghost'), undefined);
    });

    it('should find user_inputs in a room with one user', () => {
      assert.deepEqual(room.userInputs('ivanmicai'), []);
    });

    it('should find user_last_inputs in a room with one user', () => {
      assert.deepEqual(room.userLastInput('ivanmicai'), undefined);
    });

    it('should get room ranking in a room with one user', () => {
      assert.deepEqual(room.ranking, [['ivanmicai', 0]]);
    });

    it('should get room score_board in a room with one user', () => {
      const scoreBoard = {
        ivanmicai: {
          score: 0,
          correctCursor: -1,
          status: 'waiting',
        },
      };

      assert.deepEqual(room.score_board, scoreBoard);
    });
  });

  describe('Add duplicated user', () => {
    it('should not duplicate the user', () => {
      room.userJoin('ivanmicai');

      assert.deepEqual(room.users(), ['ivanmicai']);
    });
  });
});