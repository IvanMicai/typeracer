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

  describe('Add duplicated user', () => {
    it('should not duplicate the user', () => {
      room.userJoin('ivanmicai');

      assert.deepEqual(room.users(), ['ivanmicai']);
    });
  });

  describe('Add second user', () => {
    it('should Add a second user', () => {
      room.userJoin('amanda');
    });

    it('should list all users in a room with two user', () => {
      assert.deepEqual(room.users(), ['ivanmicai', 'amanda']);
    });

    it('should find user in a room with two user', () => {
      assert.equal(room.userExists('ivanmicai'), 'ivanmicai');
      assert.equal(room.userExists('amanda'), 'amanda');
    });

    it('should find a diferent user in a room with two user', () => {
      assert.equal(room.userExists('ghost'), undefined);
    });

    it('should get room ranking in a room with two user', () => {
      assert.deepEqual(room.ranking, [['ivanmicai', 0], ['amanda', 0]]);
    });

    it('should get room score_board in a room with two user', () => {
      const scoreBoard = {
        ivanmicai: {
          score: 0,
          correctCursor: -1,
          status: 'waiting',
        },
        amanda: {
          score: 0,
          correctCursor: -1,
          status: 'waiting',
        },
      };

      assert.deepEqual(room.score_board, scoreBoard);
    });
  });

  describe('Start the game', () => {
    it('should not start the game with all users on waiting status', () => {
      const scoreBoard = {
        ivanmicai: { score: 0, correctCursor: -1, status: 'waiting' },
        amanda: { score: 0, correctCursor: -1, status: 'waiting' },
      };

      const ranking = [
        ['ivanmicai', 0],
        ['amanda', 0],
      ];

      assert.equal(room.status, 'waiting');
      assert.deepEqual(room.score_board, scoreBoard);
      assert.deepEqual(room.ranking, ranking);

      const tryStart = room.start();

      assert.equal(tryStart, false);
      assert.equal(room.status, 'waiting');
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should not start with one user ready', () => {
      const scoreBoard = {
        ivanmicai: { score: 0, correctCursor: -1, status: 'ready' },
        amanda: { score: 0, correctCursor: -1, status: 'waiting' },
      };

      const ranking = [
        ['ivanmicai', 0],
        ['amanda', 0],
      ];

      room.userReady('ivanmicai');
      const tryStart = room.start();

      assert.equal(tryStart, false);
      assert.equal(room.status, 'waiting');
      assert.deepEqual(room.score_board, scoreBoard);
      assert.deepEqual(room.ranking, ranking);
    });

    it('should start with all user ready', () => {
      const scoreBoard = {
        ivanmicai: { score: 0, correctCursor: -1, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      room.userReady('amanda');
      const tryStart = room.start();

      assert.equal(tryStart, true);
      assert.equal(room.status, 'running');
      assert.deepEqual(room.score_board, scoreBoard);
    });
  });

  describe('Add to first user some inputs', () => {
    it('should send the first input', () => {
      room.newUserInput({
        username: 'ivanmicai',
        cursor: 0,
        character: 'i',
        time: (new Date()).getTime(),
      });
    });

    it('should userInputs equal lastInput', () => {
      const userInputs = room.userInputs('ivanmicai');
      const userLastInput = room.userLastInput('ivanmicai');

      assert.deepEqual(userInputs[0], userLastInput);
      assert.equal(room.userInputs('ivanmicai').length, 1);
    });

    it('should first input update score_board', () => {
      const scoreBoard = {
        ivanmicai: { score: 1, correctCursor: 0, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send an incorrect input (incorrect cursor +1)', () => {
      const inputResult = room.newUserInput({
        username: 'ivanmicai',
        cursor: 2,
        character: 'v',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 1, correctCursor: 0, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('ivanmicai').length, 2);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send a second input (correct)', () => {
      const inputResult = room.newUserInput({
        username: 'ivanmicai',
        cursor: 1,
        character: 'v',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 2, correctCursor: 1, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      const ranking = [
        ['ivanmicai', 2],
        ['amanda', 0],
      ];

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('ivanmicai').length, 3);
      assert.deepEqual(room.score_board, scoreBoard);
      assert.deepEqual(room.ranking, ranking);
    });

    it('should send a third input (incorrect character)', () => {
      const inputResult = room.newUserInput({
        username: 'ivanmicai',
        cursor: 2,
        character: 'n',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 2, correctCursor: 1, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('ivanmicai').length, 4);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send a fourth input (correct)', () => {
      const inputResult = room.newUserInput({
        username: 'ivanmicai',
        cursor: 2,
        character: 'a',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 0, correctCursor: -1, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('ivanmicai').length, 5);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should first user lastInput be equals fourth input', () => {
      const userInputs = room.userInputs('ivanmicai');
      const userLastInput = room.userLastInput('ivanmicai');

      assert.deepEqual(userInputs[4], userLastInput);
    });
  });

  describe('Add to second user some inputs', () => {
    it('should send the second input', () => {
      room.newUserInput({
        username: 'amanda',
        cursor: 0,
        character: 'i',
        time: (new Date()).getTime(),
      });
    });

    it('should userInputs equal lastInput', () => {
      const userInputs = room.userInputs('amanda');
      const userLastInput = room.userLastInput('amanda');

      assert.deepEqual(userInputs[0], userLastInput);
      assert.equal(room.userInputs('amanda').length, 1);
    });

    it('should second input update score_board', () => {
      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 1, correctCursor: 0, status: 'running' },
      };

      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send an incorrect input (incorrect cursor +1)', () => {
      const inputResult = room.newUserInput({
        username: 'amanda',
        cursor: 2,
        character: 'v',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 1, correctCursor: 0, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('amanda').length, 2);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send a second input (correct)', () => {
      const inputResult = room.newUserInput({
        username: 'amanda',
        cursor: 1,
        character: 'v',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 2, correctCursor: 1, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('amanda').length, 3);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send a third input (incorrect character)', () => {
      const inputResult = room.newUserInput({
        username: 'amanda',
        cursor: 2,
        character: 'n',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 2, correctCursor: 1, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('amanda').length, 4);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should send a fourth input (correct)', () => {
      const inputResult = room.newUserInput({
        username: 'amanda',
        cursor: 2,
        character: 'a',
        time: (new Date()).getTime(),
      });

      const scoreBoard = {
        ivanmicai: { score: 3, correctCursor: 2, status: 'running' },
        amanda: { score: 3, correctCursor: 2, status: 'running' },
      };

      assert.equal(inputResult, true);
      assert.equal(room.userInputs('amanda').length, 5);
      assert.deepEqual(room.score_board, scoreBoard);
    });

    it('should first user lastInput be equals fourth input', () => {
      const userInputs = room.userInputs('amanda');
      const userLastInput = room.userLastInput('amanda');

      assert.deepEqual(userInputs[4], userLastInput);
    });
  });
});